import { postJson } from "./apiClient";

const CONTACT_ENDPOINT = "/api/contact";

/**
 * Submits a general contact message.
 * @param {object} contactData
 * @returns {Promise<{success: boolean}>}
 */
export async function submitContactMessage(contactData) {
  return postJson(CONTACT_ENDPOINT, contactData);
}
