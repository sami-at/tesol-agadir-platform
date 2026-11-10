import crypto from "node:crypto";
import { db } from "../db.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
export const SESSION_COOKIE_NAME = "tesol_session";

export function createSession(userId) {
  const id = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  db.prepare("INSERT INTO admin_sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(
    id,
    userId,
    expiresAt,
  );
  return { id, expiresAt };
}

/** Returns the session's user info, or null if missing/expired (also cleans up expired rows). */
export function getSession(sessionId) {
  if (!sessionId) return null;
  const row = db
    .prepare(
      `SELECT admin_sessions.expires_at AS expiresAt, admin_users.id AS userId, admin_users.username AS username
       FROM admin_sessions
       JOIN admin_users ON admin_users.id = admin_sessions.user_id
       WHERE admin_sessions.id = ?`,
    )
    .get(sessionId);

  if (!row) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    destroySession(sessionId);
    return null;
  }
  return { userId: row.userId, username: row.username };
}

export function destroySession(sessionId) {
  if (!sessionId) return;
  db.prepare("DELETE FROM admin_sessions WHERE id = ?").run(sessionId);
}

export function pruneExpiredSessions() {
  db.prepare("DELETE FROM admin_sessions WHERE expires_at < datetime('now')").run();
}
