// Defense-in-depth CSRF mitigation on top of the SameSite=Lax session cookie:
// reject state-changing requests whose Origin/Referer doesn't match the
// configured frontend origin. Safe (read-only) methods are always allowed.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Parses a URL and returns just its origin (scheme + host + port), or null if
// invalid. Using exact origin comparison (rather than string prefix matching)
// avoids a bypass where an attacker-controlled domain that merely *starts
// with* the allowed origin as a substring (e.g. "https://tesol-agadir.com.evil.com")
// would otherwise pass a naive `.startsWith()` check.
function parseOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function verifyOrigin(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const allowedOrigin = process.env.CLIENT_ORIGIN;
  if (!allowedOrigin) return next(); // not configured for this deployment — skip the check

  const allowed = parseOrigin(allowedOrigin);
  const headerValue = req.get("origin") || req.get("referer");
  const requestOrigin = headerValue ? parseOrigin(headerValue) : null;

  if (!allowed || !requestOrigin || requestOrigin !== allowed) {
    return res.status(403).json({ message: "Request origin is not allowed." });
  }
  next();
}

