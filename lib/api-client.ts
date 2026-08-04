import { API_URL } from "./config";

const BASE_URL = API_URL;

// ── Token storage ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "panpata_access_token";
const REFRESH_KEY = "panpata_refresh_token";

export const tokenStore = {
  getAccess: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────

type ApiError = { message: string; statusCode: number };

export class ApiException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = tokenStore.getAccess();
  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Try to refresh on 401 (expired access token)
  if (res.status === 401 && retry) {
    const refreshToken = tokenStore.getRefresh();
    if (refreshToken) {
      const refreshed = await tryRefresh(refreshToken);
      if (refreshed) return request<T>(path, options, false); // retry once
    }
    tokenStore.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiException("Session expired", 401);
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = body as ApiError;
    throw new ApiException(err.message ?? "Request failed", res.status);
  }

  // Unwrap the { success, data } envelope from the TransformInterceptor
  return (body.data !== undefined ? body.data : body) as T;
}

async function tryRefresh(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const body = await res.json();
    const data = body.data ?? body;
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

export const api = {
  /**
   * GET request.
   * Pass `fetchOptions` with `{ next: { revalidate: 60 } }` from Server Components
   * to opt into ISR caching. Client components omit it — no change needed.
   */
  get: <T>(path: string, fetchOptions?: RequestInit) =>
    request<T>(path, { method: "GET", ...fetchOptions }),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  /** Upload files as multipart/form-data (no Content-Type header — browser sets boundary) */
  upload: <T>(path: string, formData: FormData) => {
    const token = tokenStore.getAccess();
    return request<T>(path, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  },
};
