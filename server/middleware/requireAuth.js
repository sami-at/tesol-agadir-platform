import { getSession, SESSION_COOKIE_NAME } from "../lib/session.js";

/** Rejects requests without a valid, unexpired admin session. Attaches req.admin on success. */
export function requireAuth(req, res, next) {
  const sessionId = req.signedCookies?.[SESSION_COOKIE_NAME];
  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({ message: "Authentication required." });
  }
  req.admin = session;
  next();
}
