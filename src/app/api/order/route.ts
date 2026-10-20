import { randomBytes } from "crypto";
import { deliverOrder } from "@/lib/delivery";
import { rateLimit } from "@/lib/rate-limit";
import { orderPayloadSchema } from "@/lib/validation";
import type { OrderApiError, OrderApiSuccess } from "@/types/order";

export const runtime = "nodejs";

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const MIN_FILL_TIME_MS = 3_000;
const MAX_BODY_BYTES = 20_000;

function json(body: OrderApiSuccess | OrderApiError, status = 200): Response {
  return Response.json(body, { status });
}

function makeRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = randomBytes(6);
  let out = "";
  for (const byte of bytes) out += chars[byte % chars.length];
  return `SM-${out}`;
}

function firstIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json({ ok: false, error: "Unsupported media type" }, 400);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Payload too large" }, 413);
  }

  const limit = rateLimit(firstIp(request), RATE_LIMIT);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ ok: false, error: "Too many requests. Try again later." } satisfies OrderApiError),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const parsed = orderPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }

  const order = parsed.data;
  const fastSubmit = Date.now() - order.meta.startedAt < MIN_FILL_TIME_MS;

  // Spam: honeypot filled or form filled too fast — fake success, no delivery
  if (order.meta.honeypot !== "" || fastSubmit) {
    return json({ ok: true, ref: makeRef() });
  }

  const ref = makeRef();
  try {
    await deliverOrder(order, ref);
  } catch {
    return json(
      {
        ok: false,
        error: "Delivery failed. Please email script.monks.mail@gmail.com",
      },
      502,
    );
  }

  return json({ ok: true, ref });
}
