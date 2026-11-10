// Thin, shared HTTP layer used by every service (content, auth, forms). This
// is the one place that talks to fetch() — the API boundary for the app.
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

async function parseResponse(response) {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.issues = data?.issues;
    throw error;
  }

  return data;
}

/** Low-level JSON request helper. Always sends cookies so the admin session works. */
export async function apiRequest(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: "include",
      headers: DEFAULT_HEADERS,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection and try again.");
  }
  return parseResponse(response);
}

/** Convenience helper for public form submissions (contact/application). */
export async function postJson(endpoint, payload) {
  return apiRequest(endpoint, { method: "POST", body: payload });
}
