import { randomBytes } from "crypto";
import { deliverOrder } from "@/lib/delivery";
import { apiErrorResponse, logServerError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { orderPayloadSchema } from "@/lib/validation";
import type { OrderApiSuccess } from "@/types/order";

export const runtime = "nodejs";

const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 } as const;
const MIN_FILL_TIME_MS = 3_000;
const MAX_BODY_BYTES = 20_000;

function json(body: OrderApiSuccess, status = 200): Response {
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
    return apiErrorResponse("UNSUPPORTED");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return apiErrorResponse("TOO_LARGE");
  }

  const limit = rateLimit(firstIp(request), RATE_LIMIT);
  if (!limit.allowed) {
    return apiErrorResponse("RATE_LIMIT", {
      retryAfterSeconds: Math.ceil(limit.retryAfterMs / 1000),
    });
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return apiErrorResponse("INVALID", {
      message: "That request couldn't be read. Please try again.",
    });
  }

  const parsed = orderPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return apiErrorResponse("INVALID", {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
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
  } catch (error) {
    // Server-side log: route + code only, never the payload or personal data.
    logServerError("/api/order", error);
    return apiErrorResponse("SERVER", {
      message: "Delivery failed. Please email script.monks.mail@gmail.com",
    });
  }

  return json({ ok: true, ref });
}
