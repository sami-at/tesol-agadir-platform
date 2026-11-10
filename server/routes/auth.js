import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { db } from "../db.js";
import { createSession, destroySession, getSession, SESSION_COOKIE_NAME } from "../lib/session.js";
import { loginRateLimit } from "../lib/rateLimits.js";

const router = Router();
const isProd = process.env.NODE_ENV === "production";

const loginLimiter = rateLimit({
  ...loginRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

function setSessionCookie(res, sessionId, expiresAt) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    signed: true,
    expires: new Date(expiresAt),
    path: "/",
  });
}

router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username.trim());
  const isValid = Boolean(user) && bcrypt.compareSync(password, user.password_hash);

  // Deliberately generic message — never reveal whether the username exists.
  if (!isValid) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const { id, expiresAt } = createSession(user.id);
  setSessionCookie(res, id, expiresAt);
  res.json({ username: user.username });
});

router.post("/logout", (req, res) => {
  const sessionId = req.signedCookies?.[SESSION_COOKIE_NAME];
  destroySession(sessionId);
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

router.get("/session", (req, res) => {
  const sessionId = req.signedCookies?.[SESSION_COOKIE_NAME];
  const session = getSession(sessionId);
  if (!session) return res.json({ authenticated: false });
  res.json({ authenticated: true, username: session.username });
});

export default router;
