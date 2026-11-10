import { Router } from "express";
import rateLimit from "express-rate-limit";
import { db } from "../db.js";
import { isRequired, isValidEmail } from "../../src/utils/validators.js";
import { submissionRateLimit } from "../lib/rateLimits.js";

const router = Router();

const limiter = rateLimit({
  ...submissionRateLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});

router.post("/", limiter, (req, res) => {
  const { name, email, message } = req.body || {};

  if (!isRequired(name)) return res.status(422).json({ message: "Name is required." });
  if (!isRequired(email) || !isValidEmail(email)) {
    return res.status(422).json({ message: "A valid email address is required." });
  }
  if (!isRequired(message)) return res.status(422).json({ message: "Message is required." });

  db.prepare(
    "INSERT INTO contact_messages (name, email, message, ip_address) VALUES (?, ?, ?, ?)",
  ).run(String(name).trim(), String(email).trim(), String(message).trim(), req.ip);

  res.status(201).json({ success: true });
});

export default router;
