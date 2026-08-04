const rawUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const API_URL: string =
  rawUrl && !/^https?:\/\//i.test(rawUrl)
    ? `https://${rawUrl}`
    : rawUrl;

export const SERVER_URL: string = API_URL.replace(/\/api\/?$/, "");

export const GOOGLE_AUTH_URL: string = `${API_URL}/auth/google`;
