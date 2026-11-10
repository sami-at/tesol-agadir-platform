// Centralized, environment-configurable rate limit settings. Sensible
// defaults are used when the corresponding env var is unset or invalid.
function intFromEnv(name, fallback) {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const loginRateLimit = {
  windowMs: intFromEnv("LOGIN_RATE_LIMIT_WINDOW_MINUTES", 15) * 60 * 1000,
  limit: intFromEnv("LOGIN_RATE_LIMIT_MAX", 10),
};

export const submissionRateLimit = {
  windowMs: intFromEnv("SUBMISSION_RATE_LIMIT_WINDOW_MINUTES", 10) * 60 * 1000,
  limit: intFromEnv("SUBMISSION_RATE_LIMIT_MAX", 5),
};
