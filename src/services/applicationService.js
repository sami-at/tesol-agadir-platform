import { postJson, apiRequest } from "./apiClient";

const APPLICATION_ENDPOINT = "/api/applications";

/**
 * Submits a TESOL certification application.
 * @param {object} applicationData
 * @returns {Promise<{success: boolean}>}
 */
export async function submitApplication(applicationData) {
  return postJson(APPLICATION_ENDPOINT, applicationData);
}

/** Admin-only: fetches all submitted applications, most recent first. */
export async function fetchApplications() {
  return apiRequest(APPLICATION_ENDPOINT);
}

/** Admin-only: updates a single application's status. */
export async function updateApplicationStatus(id, status) {
  return apiRequest(`${APPLICATION_ENDPOINT}/${id}/status`, { method: "PATCH", body: { status } });
}

/** Admin-only: deletes a single application. */
export async function deleteApplication(id) {
  return apiRequest(`${APPLICATION_ENDPOINT}/${id}`, { method: "DELETE" });
}

/** Admin-only: deletes multiple applications by id, or every application if `all` is true. */
export async function deleteApplications({ ids, all } = {}) {
  return apiRequest(APPLICATION_ENDPOINT, { method: "DELETE", body: all ? { all: true } : { ids } });
}

