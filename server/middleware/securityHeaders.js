// Minimal, dependency-free security headers (avoids pulling in helmet for a
// handful of headers). Applied to every response.
//
// CSP notes: the app has no inline <script>/<style> and no eval-like code
// (verified — zero inline style attributes, zero eval/new Function usage), so
// this policy avoids 'unsafe-inline' and 'unsafe-eval' entirely. It allows:
//   - style-src/font-src for the Google Fonts stylesheet actually used in
//     index.html (fonts.googleapis.com / fonts.gstatic.com).
//   - img-src https: because admin-managed content (faculty/testimonial
//     photos, hero/campus images) can legitimately be any https:// URL, not
//     just same-origin (there is no file upload feature — only URL strings).
// If new external resources (analytics, maps, video embeds, etc.) are added
// later, this policy will need matching additions or it will silently block
// them — check the browser console for CSP violation reports after any such
// change.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", CSP);
  next();
}

