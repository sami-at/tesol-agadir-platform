import { apiRequest } from "./apiClient";

// Real persistence layer for site content, backed by the Express + SQLite
// API in server/. Every function keeps the same shape it had as a mock, so
// ContentContext and every component using useContent() needed no changes.
const CONTENT_ENDPOINT = "/api/content";

/** Fetches the full content object (all 21 sections, backend-persisted). */
export async function getContent() {
  return apiRequest(CONTENT_ENDPOINT);
}

/** Fetches a single top-level section's value. */
export async function getSection(sectionKey) {
  const { value } = await apiRequest(`${CONTENT_ENDPOINT}/${sectionKey}`);
  return value;
}

/** Persists a full replacement value for a single top-level content section. */
export async function updateSection(sectionKey, value) {
  return apiRequest(`${CONTENT_ENDPOINT}/${sectionKey}`, { method: "PUT", body: { value } });
}

/** Resets a single section back to its factory default. */
export async function resetSection(sectionKey) {
  return apiRequest(`${CONTENT_ENDPOINT}/${sectionKey}/reset`, { method: "POST" });
}

/** Resets all content back to factory defaults. */
export async function resetAllContent() {
  return apiRequest(`${CONTENT_ENDPOINT}/reset-all`, { method: "POST" });
}
