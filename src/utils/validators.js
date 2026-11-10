// Reusable, framework-agnostic validation helpers.
export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value) {
  if (!value) return false;
  // Allows digits, spaces, dashes, parentheses, and a leading +
  return /^[+]?[\d\s()-]{7,20}$/.test(value.trim());
}

// Allows only relative paths and http(s) URLs — rejects "javascript:", "data:",
// "vbscript:", and any other scheme that could execute code when navigated to.
export function isSafeUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return true; // empty is valid (no link yet)
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  return /^https?:\/\//i.test(trimmed);
}

