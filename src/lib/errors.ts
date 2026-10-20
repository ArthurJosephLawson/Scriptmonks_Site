// Central API error contract (SPEC_V5 §2.2).
// One code → friendly message map, one status map, one client fetch wrapper.
// No raw error text ever reaches the UI from here.

export const ERROR_CODES = [
  "INVALID",
  "FILTER",
  "DUPLICATE",
  "ORIGIN",
  "BOT",
  "BANNED",
  "RATE_LIMIT",
  "PAUSED",
  "TOO_LARGE",
  "UNSUPPORTED",
  "NOT_FOUND",
  "METHOD",
  "DISABLED",
  "IMAGE",
  "NETWORK",
  "TIMEOUT",
  "SERVER",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface ApiError {
  ok: false;
  code: ErrorCode;
  message: string;
  retryAfterSeconds?: number;
  ref?: string;
  /**
   * Extra: per-field validation detail. Not part of the SPEC_V5 §2.2 base
   * type; kept because the earlier specs' forms contract includes it.
   */
  fieldErrors?: Record<string, string[]>;
}

/** Human-readable, always safe to display. */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID: "Some fields need attention. Please check your input.",
  FILTER: "That filter isn't valid.",
  DUPLICATE: "That was already submitted.",
  ORIGIN: "This request came from an unknown source.",
  BOT: "We couldn't verify that this request came from a person.",
  BANNED: "This address can't send requests right now.",
  RATE_LIMIT: "You're going a little fast. Please wait a moment and try again.",
  PAUSED: "This part of the site is paused right now. Please try again later.",
  TOO_LARGE: "That payload is too large.",
  UNSUPPORTED: "That content type isn't supported. Please send application/json.",
  NOT_FOUND: "We couldn't find what you requested.",
  METHOD: "That method isn't allowed here.",
  DISABLED: "This feature is currently disabled.",
  IMAGE: "That image couldn't be processed.",
  NETWORK: "Network problem. Check your connection and try again.",
  TIMEOUT: "The request took too long. Please try again.",
  SERVER:
    "Sorry about that. It's not your fault. Please try again, and if it keeps happening, email us.",
};

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  INVALID: 400,
  FILTER: 400,
  IMAGE: 400,
  ORIGIN: 403,
  BOT: 403,
  BANNED: 403,
  DISABLED: 403,
  NOT_FOUND: 404,
  METHOD: 405,
  DUPLICATE: 409,
  TOO_LARGE: 413,
  UNSUPPORTED: 415,
  RATE_LIMIT: 429,
  SERVER: 500,
  NETWORK: 500,
  TIMEOUT: 500,
  PAUSED: 503,
};

export function statusForCode(code: ErrorCode): number {
  return STATUS_BY_CODE[code];
}

/** One canonical code per status (several codes share 400/403). */
const REVERSE_STATUS: Record<number, ErrorCode> = {
  400: "INVALID",
  403: "ORIGIN",
  404: "NOT_FOUND",
  405: "METHOD",
  409: "DUPLICATE",
  413: "TOO_LARGE",
  415: "UNSUPPORTED",
  429: "RATE_LIMIT",
  500: "SERVER",
  503: "PAUSED",
};

/** Reverse map for responses we did not produce (proxies, framework 405s…). */
export function codeForStatus(status: number): ErrorCode {
  return REVERSE_STATUS[status] ?? "SERVER";
}

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && (ERROR_CODES as readonly string[]).includes(value);
}

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== "object" || value === null || !("ok" in value)) return false;
  const candidate = value as { ok?: unknown; code?: unknown; message?: unknown };
  return candidate.ok === false && isErrorCode(candidate.code) && typeof candidate.message === "string";
}

export interface ApiErrorInit {
  /** Override the map message with another human-readable, safe message. */
  message?: string;
  retryAfterSeconds?: number;
  ref?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Build an ApiError for a known failure. */
export function apiError(code: ErrorCode, init: ApiErrorInit = {}): ApiError {
  const error: ApiError = { ok: false, code, message: init.message ?? ERROR_MESSAGES[code] };
  if (init.retryAfterSeconds !== undefined) error.retryAfterSeconds = init.retryAfterSeconds;
  if (init.ref !== undefined) error.ref = init.ref;
  if (init.fieldErrors !== undefined) error.fieldErrors = init.fieldErrors;
  return error;
}

/**
 * Normalize any thrown/unknown value into a safe ApiError.
 * Error messages, stack traces, SQL/provider details are never forwarded.
 */
export function toApiError(input: unknown): ApiError {
  if (isApiError(input)) return input;
  return apiError("SERVER");
}

export interface ApiResponseInit extends ApiErrorInit {
  /** Extra Allow header value for METHOD errors (405). */
  allow?: string;
}

/** JSON Response for an ApiError with the correct HTTP status and headers. */
export function apiErrorResponse(
  code: ErrorCode,
  init: ApiResponseInit = {},
): Response {
  const { allow, ...errorInit } = init;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (code === "RATE_LIMIT" && errorInit.retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(errorInit.retryAfterSeconds);
  }
  if (code === "METHOD" && allow !== undefined) {
    headers["Allow"] = allow;
  }
  return Response.json(apiError(code, errorInit), {
    status: statusForCode(code),
    headers,
  });
}

/**
 * Server-side error log: route + code (+ ref) only.
 * Never logs request bodies or personal data (SPEC_V5 §2.1).
 */
export function logServerError(route: string, error: unknown): void {
  const code = toApiError(error).code;
  console.error(`[api-error] ${route} code=${code}`);
}

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: ApiError };

export interface ApiFetchOptions extends RequestInit {
  /** Per-request timeout; defaults to 10 000 ms. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

function failureFromResponse(status: number, body: unknown): ApiError {
  if (isApiError(body)) return body;
  const code = codeForStatus(status);
  return apiError(code);
}

/**
 * Client fetch wrapper (SPEC_V5 §2.2):
 * 10 s timeout, NETWORK/TIMEOUT mapping, one retry for idempotent GETs,
 * never throws — failures come back as safe ApiErrors.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: ApiFetchOptions = {},
): Promise<ApiResult<T>> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;
  const method = (init.method ?? "GET").toUpperCase();
  const attempts = method === "GET" ? 2 : 1;
  let lastFailure: ApiError = apiError("NETWORK");

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      let body: unknown = null;
      if (response.status !== 204) {
        try {
          body = await response.json();
        } catch {
          body = null;
        }
      }
      if (!response.ok) {
        lastFailure = failureFromResponse(response.status, body);
        // Retryable server failures on GET get the single retry too.
        if (response.status >= 500 && attempt + 1 < attempts) continue;
        return { ok: false, status: response.status, error: lastFailure };
      }
      if (body === null && response.status !== 204) {
        return { ok: false, status: response.status, error: apiError("SERVER") };
      }
      return { ok: true, status: response.status, data: body as T };
    } catch (err) {
      clearTimeout(timer);
      const aborted = err instanceof Error && err.name === "AbortError";
      lastFailure = apiError(aborted ? "TIMEOUT" : "NETWORK");
      // The single retry for idempotent GETs also covers network failures.
      if (attempt + 1 < attempts) continue;
      return { ok: false, status: 0, error: lastFailure };
    }
  }
  return { ok: false, status: 0, error: lastFailure };
}
