import { authClient } from "./auth-client";
import { API_URL } from "./constants";

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

// ---------- JWT handling ----------
// BetterAuth hands out a short lived JWT for the logged-in user. We keep it in memory (never in localStorage),
// reuse it until shortly before it expires, and attach it to every protected call to the Express API.

let cached: { token: string; expiresAt: number } | null = null;

function readExpiry(token: string): number {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    if (typeof exp === "number") return exp * 1000;
  } catch {
    // fall through to the default below
  }
  return Date.now() + 5 * 60 * 1000;
}

export function clearTokenCache() {
  cached = null;
}

async function getToken(): Promise<string | null> {
  if (cached && cached.expiresAt - 30_000 > Date.now()) return cached.token;

  const { data, error } = await authClient.token();
  if (error || !data?.token) return null;

  cached = { token: data.token, expiresAt: readExpiry(data.token) };
  return data.token;
}

let signingOut = false;

/** The API said the session is no good (expired or invalid token): log out and send the user to Login. */
async function endSession() {
  if (signingOut || typeof window === "undefined") return;
  signingOut = true;
  clearTokenCache();
  try {
    await authClient.signOut();
  } finally {
    window.location.assign("/login?expired=1");
  }
}

// ---------- Requests ----------

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the JWT. Required for every protected endpoint. */
  auth?: boolean;
  signal?: AbortSignal;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (!token) {
      await endSession();
      throw new ApiError("Please log in to continue", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("We could not reach the server. Check your connection and try again", 0);
  }

  const data = (await response.json().catch(() => null)) as
    | { message?: string; errors?: Record<string, string> }
    | null;

  if (!response.ok) {
    if (response.status === 401 && auth) await endSession();
    throw new ApiError(data?.message ?? "Something went wrong. Please try again", response.status, data?.errors);
  }

  return data as T;
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again"): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
