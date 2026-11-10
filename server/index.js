import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";
import { seedContent, seedAdminUser } from "./seed.js";
import { pruneExpiredSessions } from "./lib/session.js";
import { verifyOrigin } from "./middleware/verifyOrigin.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import applicationRoutes from "./routes/applications.js";
import contactRoutes from "./routes/contact.js";
import { notFoundHandler, errorHandler } from "./errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";

if (!process.env.SESSION_SECRET) {
  console.error("[server] SESSION_SECRET is not set. Set it in .env before starting the server.");
  process.exit(1);
}

// Safe/idempotent: never overwrites existing content or an existing admin account.
seedContent();
seedAdminUser();
pruneExpiredSessions();
const pruneInterval = setInterval(pruneExpiredSessions, 60 * 60 * 1000).unref();

const app = express();
app.disable("x-powered-by");

// Required for correct client IPs (and therefore correct rate limiting) when
// running behind a reverse proxy / load balancer in production.
if (process.env.TRUST_PROXY) app.set("trust proxy", process.env.TRUST_PROXY);

app.use(securityHeaders);
// Origin check runs before body parsing so we never spend CPU parsing a
// JSON body for a request that will be rejected anyway (CSRF defense).
app.use("/api", verifyOrigin);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.SESSION_SECRET));

// Unauthenticated, minimal health check for uptime monitoring / load balancers.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", notFoundHandler);

// In production, this same process also serves the built frontend so the
// whole app runs from a single origin/process (simplifies cookies + CORS).
const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use(errorHandler);

const server = app.listen(PORT, HOST, () => {
  console.log(`[server] listening on http://${HOST}:${PORT}`);
});

function shutdown() {
  clearInterval(pruneInterval);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  // Force-exit if connections don't close promptly.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
