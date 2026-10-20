import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  apiError,
  apiErrorResponse,
  apiFetch,
  codeForStatus,
  isApiError,
  logServerError,
  statusForCode,
  toApiError,
} from "@/lib/errors";

const ALLOWED_STATUSES = [400, 403, 404, 405, 409, 413, 415, 429, 500, 503];

describe("code map", () => {
  it("covers every code with a non-empty friendly message", () => {
    for (const code of ERROR_CODES) {
      expect(ERROR_MESSAGES[code]).toBeTruthy();
      expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    }
  });

  it("maps every code to an allowed HTTP status", () => {
    for (const code of ERROR_CODES) {
      expect(ALLOWED_STATUSES).toContain(statusForCode(code));
    }
  });

  it("spot-checks the spec-mandated statuses", () => {
    expect(statusForCode("INVALID")).toBe(400);
    expect(statusForCode("METHOD")).toBe(405);
    expect(statusForCode("DUPLICATE")).toBe(409);
    expect(statusForCode("TOO_LARGE")).toBe(413);
    expect(statusForCode("UNSUPPORTED")).toBe(415);
    expect(statusForCode("RATE_LIMIT")).toBe(429);
    expect(statusForCode("SERVER")).toBe(500);
    expect(statusForCode("PAUSED")).toBe(503);
  });

  it("reverse-maps statuses and falls back to SERVER", () => {
    expect(codeForStatus(429)).toBe("RATE_LIMIT");
    expect(codeForStatus(405)).toBe("METHOD");
    expect(codeForStatus(502)).toBe("SERVER");
    expect(codeForStatus(418)).toBe("SERVER");
  });
});

describe("isApiError", () => {
  it("accepts the contract shape", () => {
    expect(isApiError({ ok: false, code: "INVALID", message: "x" })).toBe(true);
  });

  it("rejects lookalikes", () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError({ ok: true, code: "INVALID", message: "x" })).toBe(false);
    expect(isApiError({ ok: false, code: "NOPE", message: "x" })).toBe(false);
    expect(isApiError({ ok: false, code: "INVALID" })).toBe(false);
    expect(isApiError({ ok: false, code: 400, message: "x" })).toBe(false);
  });
});

describe("apiError", () => {
  it("uses the map message by default", () => {
    expect(apiError("RATE_LIMIT").message).toBe(ERROR_MESSAGES.RATE_LIMIT);
  });

  it("supports overrides without leaking undefined keys", () => {
    const error = apiError("RATE_LIMIT", { retryAfterSeconds: 30, ref: "SM-X" });
    expect(error.retryAfterSeconds).toBe(30);
    expect(error.ref).toBe("SM-X");
    expect("fieldErrors" in error).toBe(false);
  });
});

describe("toApiError", () => {
  it("passes ApiErrors through unchanged", () => {
    const input = apiError("INVALID", { message: "custom" });
    expect(toApiError(input)).toBe(input);
  });

  it("turns unknown errors into generic SERVER — never leaks the message", () => {
    const raw = toApiError(new Error("SELECT * FROM users --secret"));
    expect(raw.code).toBe("SERVER");
    expect(raw.message).toBe(ERROR_MESSAGES.SERVER);
    expect(raw.message).not.toContain("SELECT");
  });

  it("handles non-Error values", () => {
    expect(toApiError("boom").code).toBe("SERVER");
    expect(toApiError(undefined).code).toBe("SERVER");
    expect(toApiError({ message: "provider down" }).code).toBe("SERVER");
  });
});

describe("apiErrorResponse", () => {
  it("uses the mapped status and JSON content type", async () => {
    const response = apiErrorResponse("TOO_LARGE");
    expect(response.status).toBe(413);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    const body = (await response.json()) as { code: string };
    expect(body.code).toBe("TOO_LARGE");
  });

  it("sets Retry-After for RATE_LIMIT", async () => {
    const response = apiErrorResponse("RATE_LIMIT", { retryAfterSeconds: 42 });
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    const body = (await response.json()) as { retryAfterSeconds?: number };
    expect(body.retryAfterSeconds).toBe(42);
  });

  it("sets Allow for METHOD", async () => {
    const response = apiErrorResponse("METHOD", { allow: "POST, HEAD" });
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST, HEAD");
  });
});

describe("logServerError", () => {
  afterEach(() => vi.restoreAllMocks());

  it("logs route + code only, never the original message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logServerError("/api/order", new Error("secret payload detail"));
    const line = String(spy.mock.calls[0]?.[0]);
    expect(line).toContain("/api/order");
    expect(line).toContain("SERVER");
    expect(line).not.toContain("secret payload detail");
  });
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("apiFetch", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns data on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { ok: true, ref: "SM-1" }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiFetch<{ ref: string }>("/api/order", {
      method: "POST",
      body: "{}",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.ref).toBe("SM-1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps transport failure to NETWORK and retries idempotent GET once", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiFetch("/api/work");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NETWORK");
      expect(result.error.message).toBe(ERROR_MESSAGES.NETWORK);
    }
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-idempotent POST", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiFetch("/api/order", { method: "POST", body: "{}" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NETWORK");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps abort/timeout to TIMEOUT and never throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const abort = new Error("aborted");
            abort.name = "AbortError";
            reject(abort);
          });
        });
      }),
    );
    const result = await apiFetch("/api/slow", { timeoutMs: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("TIMEOUT");
  });

  it("recovers when a retried GET succeeds after a 500", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("bad gateway", { status: 502 }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiFetch("/api/work");
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("passes ApiError bodies through from error responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(429, { ok: false, code: "RATE_LIMIT", message: "slow down" }),
      ),
    );
    const result = await apiFetch("/api/contact", { method: "POST" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(429);
      expect(result.error.code).toBe("RATE_LIMIT");
      expect(result.error.message).toBe("slow down");
    }
  });

  it("maps framework error responses without a JSON contract body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Method Not Allowed", { status: 405 })),
    );
    const result = await apiFetch("/api/order");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("METHOD");
  });

  it("survives malformed success bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not json", { status: 200 })),
    );
    const result = await apiFetch("/api/work");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("SERVER");
  });
});
