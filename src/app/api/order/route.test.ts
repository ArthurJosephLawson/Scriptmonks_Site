import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/order/route";

const deliverOrder = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/delivery", () => ({
  deliverOrder: (...args: unknown[]) => deliverOrder(...args),
}));

function makeRequest(body: unknown, ip = "203.0.113.1"): Request {
  return new Request("http://localhost/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  scope: { projectType: "custom-software" },
  commercial: { budget: "250-1k", timeline: "2-4-weeks" },
  brief: { title: "Portal bot", description: "x".repeat(60), references: [] },
  contact: { name: "Ada", email: "a@b.co" },
  meta: { startedAt: 1, honeypot: "", source: "web:/order" },
};

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `203.0.113.${ipCounter % 250}`;
}

describe("POST /api/order spam checks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("honeypot filled: fake success, no delivery", async () => {
    const res = await POST(
      makeRequest(
        { ...validPayload, meta: { ...validPayload.meta, honeypot: "spam" } },
        freshIp(),
      ),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; ref: string };
    expect(body.ok).toBe(true);
    expect(body.ref).toMatch(/^SM-[A-Z0-9]{6}$/);
    expect(deliverOrder).not.toHaveBeenCalled();
  });

  it("time-trap too fast: fake success, no delivery", async () => {
    const startedAt = Date.now() - 1000;
    const res = await POST(
      makeRequest({ ...validPayload, meta: { ...validPayload.meta, startedAt } }, freshIp()),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; ref: string };
    expect(body.ok).toBe(true);
    expect(body.ref).toMatch(/^SM-/);
    expect(deliverOrder).not.toHaveBeenCalled();
  });

  it("human-timed valid order: delivers and returns ref", async () => {
    const startedAt = Date.now() - 10_000;
    const res = await POST(
      makeRequest({ ...validPayload, meta: { ...validPayload.meta, startedAt } }, freshIp()),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; ref: string };
    expect(body.ok).toBe(true);
    expect(body.ref).toMatch(/^SM-[A-Z0-9]{6}$/);
    expect(deliverOrder).toHaveBeenCalledOnce();
  });

  it("invalid payload: 400 INVALID with fieldErrors", async () => {
    const res = await POST(makeRequest({ scope: {} }, freshIp()));
    expect(res.status).toBe(400);
    const body = (await res.json()) as {
      ok: boolean;
      code: string;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
    expect(body.ok).toBe(false);
    expect(body.code).toBe("INVALID");
    expect(typeof body.message).toBe("string");
    expect(body.fieldErrors).toBeTruthy();
  });

  it("non-JSON content type: 415 UNSUPPORTED", async () => {
    const res = await POST(
      new Request("http://localhost/api/order", {
        method: "POST",
        headers: { "Content-Type": "text/plain", "x-forwarded-for": freshIp() },
        body: "hello",
      }),
    );
    expect(res.status).toBe(415);
    const body = (await res.json()) as { ok: boolean; code: string };
    expect(body.code).toBe("UNSUPPORTED");
  });

  it("rate limit: 6th request from same IP gets 429 with Retry-After", async () => {
    const ip = freshIp();
    const startedAt = Date.now() - 10_000;
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await POST(
        makeRequest({ ...validPayload, meta: { ...validPayload.meta, startedAt } }, ip),
      );
      statuses.push(res.status);
      if (res.status === 429) {
        expect(res.headers.get("Retry-After")).toBeTruthy();
        const body = (await res.json()) as {
          code: string;
          retryAfterSeconds?: number;
        };
        expect(body.code).toBe("RATE_LIMIT");
        expect(typeof body.retryAfterSeconds).toBe("number");
      }
    }
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });

  it("delivery failure: 500 SERVER with mailto fallback copy", async () => {
    deliverOrder.mockRejectedValueOnce(new Error("All delivery channels failed"));
    const startedAt = Date.now() - 10_000;
    const res = await POST(
      makeRequest({ ...validPayload, meta: { ...validPayload.meta, startedAt } }, freshIp()),
    );
    expect(res.status).toBe(500);
    const body = (await res.json()) as { ok: boolean; code: string; message: string };
    expect(body.ok).toBe(false);
    expect(body.code).toBe("SERVER");
    expect(body.message).toMatch(/email/i);
  });
});
