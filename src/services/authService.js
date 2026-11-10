import { apiRequest } from "./apiClient";

// Real admin authentication, backed by the Express server: credentials are
// checked server-side against a bcrypt hash, and the session is a random
// token stored server-side, referenced only by a signed, httpOnly cookie.
// The frontend never sees a password hash or a forgeable token.
const LOGIN_ENDPOINT = "/api/admin/login";
const LOGOUT_ENDPOINT = "/api/admin/logout";
const SESSION_ENDPOINT = "/api/admin/session";

/** Logs in against the backend. Throws on invalid credentials. Returns the username on success. */
export async function login(username, password) {
  const data = await apiRequest(LOGIN_ENDPOINT, { method: "POST", body: { username, password } });
  return data.username;
}

/** Invalidates the session server-side and clears the session cookie. */
export async function logout() {
  await apiRequest(LOGOUT_ENDPOINT, { method: "POST" });
}

/** Asks the server whether the current session (cookie) is still valid. Returns the username or null. */
export async function fetchSession() {
  const data = await apiRequest(SESSION_ENDPOINT);
  return data.authenticated ? data.username : null;
}
