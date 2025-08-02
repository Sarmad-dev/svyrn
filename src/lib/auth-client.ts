import { createAuthClient } from "better-auth/react";
import { config } from "./config";

type RequestInfo = string | URL | Request;

interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  credentials?: RequestCredentials; // 👈 important for cookies
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  // and more...
}

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: config.apiUrl || "http://localhost:5000",
  fetch: (url: RequestInfo, options: RequestInit) =>
    fetch(url, {
      ...options,
      credentials: "include", // 👈 VERY IMPORTANT
    }),
});
