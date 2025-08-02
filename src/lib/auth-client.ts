import { createAuthClient } from "better-auth/react";
import { config } from "./config";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: config.apiUrl || "http://localhost:5000",
});
