import { isValidEmail, isValidPhone, isSafeUrl } from "../../utils/validators.js";

const CRITICAL_KEYS = new Set(["name", "title", "label", "heading", "academyName", "level", "position"]);
const URL_KEYS = new Set(["syllabusUrl", "heroImage", "campusImage", "photo"]);

/**
 * Walks an arbitrary content value and returns a list of human-readable
 * validation issues. Deliberately lenient: it never blocks unrelated,
 * unchanged placeholder values (e.g. "TBD" dates, the seeded placeholder
 * phone number containing literal "X" digits) from being saved.
 */
export function validateContent(value, path = []) {
  const issues = [];

  if (Array.isArray(value)) {
    value.forEach((item, index) => issues.push(...validateContent(item, [...path, index])));
    return issues;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, fieldValue]) => {
      if (key === "id") return;

      if (typeof fieldValue === "string") {
        const location = path.length ? path.join(" > ") : "top level";

        if (CRITICAL_KEYS.has(key) && !fieldValue.trim()) {
          issues.push(`${key} is required (${location}).`);
        }
        if (key === "email" && fieldValue.trim() && !isValidEmail(fieldValue)) {
          issues.push(`"${fieldValue}" is not a valid email address.`);
        }
        if (
          (key === "phone" || key === "whatsapp") &&
          fieldValue.trim() &&
          !fieldValue.includes("X") &&
          !isValidPhone(fieldValue)
        ) {
          issues.push(`"${fieldValue}" is not a valid phone number.`);
        }
        if (URL_KEYS.has(key) && !isSafeUrl(fieldValue)) {
          issues.push(`"${fieldValue}" (${key}) must be a relative path or an http(s) URL.`);
        }
      } else {
        issues.push(...validateContent(fieldValue, [...path, key]));
      }
    });
  }

  return issues;
}
