import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { resetRateLimits } from "@/lib/rate-limit";

const deliverContactMessage = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/delivery/contact", () => ({
  deliverContactMessage: (...args: unknown[]) => deliverContactMessage(...args),
}));

function makeRequest(body: unknown, ip = "203.0.113.9"): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const validGeneral = {
  kind: "general",
  name: "Ada",
  email: "a@b.co",
  message: "x".repeat(40),
  links: [],
  meta: { startedAt: 1, honeypot: "", source: "web:/contact" },
};

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `203.0.113.${200 + (ipCounter % 50)}`;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
  });

  it("honeypot filled: fake success, no delivery", async () => {
    const res = await POST(
      makeRequest({ ...validGeneral, meta: { ...validGeneral.meta, honeypot: "spam" } }, freshIp()),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; ref: string };
    expect(body.ok).toBe(true);
    expect(body.ref).toMatch(/^SM-C[A-Z0-9]{5}$/);
    expect(deliverContactMessage).not.toHaveBeenCalled();
  });

  it("time-trap too fast: fake success, no delivery", async () => {
    const startedAt = Date.now() - 1000;
    const res = await POST(makeRequest({ ...validGeneral, meta: { ...validGeneral.meta, startedAt } }, freshIp()));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; ref: string };
    expect(body.ok).toBe(true);
    expect(deliverContactMessage).not.toHaveBeenCalled();
  });

  it("rate limit uses separate key prefix from order", async () => {
    const ip = "198.51.100.77";
    const startedAt = Date.now() - 10000;
    for (let i = 0; i < 5; i += 1) {
      const res = await POST(makeRequest({ ...validGeneral, meta: { ...validGeneral.meta, startedAt } }, ip));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest({ ...validGeneral, meta: { ...validGeneral.meta, startedAt } }, ip));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    const body = (await res.json()) as { ok: boolean; code: string };
    expect(body.ok).toBe(false);
    expect(body.code).toBe("RATE_LIMIT");
    expect(deliverContactMessage).toHaveBeenCalledTimes(5);
  });

  it("valid general delivers", async () => {
    const res = await POST(makeRequest({ ...validGeneral, meta: { ...validGeneral.meta, startedAt: Date.now() - 10000 } }, freshIp()));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
    expect(deliverContactMessage).toHaveBeenCalledTimes(1);
  })
});