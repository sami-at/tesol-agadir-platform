import { Router } from "express";
import rateLimit from "express-rate-limit";
import { db } from "../db.js";
import { isRequired, isValidEmail, isValidPhone } from "../../src/utils/validators.js";
import { submissionRateLimit } from "../lib/rateLimits.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const limiter = rateLimit({
  ...submissionRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});

// Keep in sync with src/admin/applicationStatuses.js.
export const APPLICATION_STATUSES = [
  "not_contacted",
  "contacted",
  "waiting_response",
  "responded",
  "accepted",
  "rejected",
];

// Admin-only: list submitted applications, most recent first.
router.get("/", requireAuth, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, first_name AS firstName, last_name AS lastName, email, gender, phone, city,
              degree_info AS degreeInfo, teaching_background AS teachingBackground, questions,
              status, created_at AS createdAt
       FROM applications
       ORDER BY created_at DESC`,
    )
    .all();
  res.json(rows);
});

// Admin-only: update a single application's status.
router.patch("/:id/status", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid application id." });
  if (!APPLICATION_STATUSES.includes(status)) {
    return res.status(422).json({ message: "Invalid status value." });
  }
  const info = db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
  if (info.changes === 0) return res.status(404).json({ message: "Application not found." });
  res.json({ success: true });
});

// Admin-only: delete a single application.
router.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid application id." });
  const info = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ message: "Application not found." });
  res.json({ success: true });
});

// Admin-only: bulk delete — body is either { ids: [1, 2, 3] } or { all: true }.
router.delete("/", requireAuth, (req, res) => {
  const { ids, all } = req.body || {};

  if (all === true) {
    const info = db.prepare("DELETE FROM applications").run();
    return res.json({ success: true, deleted: info.changes });
  }

  const numericIds = Array.isArray(ids) ? ids.map(Number).filter(Number.isInteger) : [];
  if (numericIds.length === 0) {
    return res.status(400).json({ message: "Provide a non-empty 'ids' array or 'all: true'." });
  }
  const placeholders = numericIds.map(() => "?").join(", ");
  const info = db.prepare(`DELETE FROM applications WHERE id IN (${placeholders})`).run(...numericIds);
  res.json({ success: true, deleted: info.changes });
});

router.post("/", limiter, (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    phone,
    city,
    degreeInfo,
    teachingBackground,
    questions,
  } = req.body || {};

  if (!isRequired(email) || !isValidEmail(email)) {
    return res.status(422).json({ message: "A valid email address is required." });
  }
  if (!isRequired(gender)) return res.status(422).json({ message: "Gender is required." });
  if (!isRequired(phone) || !isValidPhone(phone)) {
    return res.status(422).json({ message: "A valid phone number is required." });
  }
  if (!isRequired(city)) return res.status(422).json({ message: "City of residence is required." });

  db.prepare(
    `INSERT INTO applications
       (first_name, last_name, email, gender, phone, city, degree_info, teaching_background, questions, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    typeof firstName === "string" ? firstName.trim() : "",
    typeof lastName === "string" ? lastName.trim() : "",
    String(email).trim(),
    String(gender).trim(),
    String(phone).trim(),
    String(city).trim(),
    typeof degreeInfo === "string" ? degreeInfo.trim() : "",
    typeof teachingBackground === "string" ? teachingBackground.trim() : "",
    typeof questions === "string" ? questions.trim() : "",
    req.ip,
  );

  res.status(201).json({ success: true });
});

export default router;
