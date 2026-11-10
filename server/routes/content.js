import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { defaultContent } from "../../src/data/defaultContent.js";
import { validateContent } from "../../src/admin/utils/validateContent.js";

const router = Router();
const KNOWN_KEYS = new Set(Object.keys(defaultContent));

function typesMatch(a, b) {
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  return typeof a === typeof b;
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function readAllContent() {
  const rows = db.prepare("SELECT section_key, value FROM content_sections").all();
  const content = {};
  for (const row of rows) content[row.section_key] = JSON.parse(row.value);
  // Fill in any default sections missing from the DB (e.g. added in a later release).
  for (const key of KNOWN_KEYS) {
    if (!(key in content)) {
      content[key] = structuredClone(defaultContent[key]);
    } else if (isPlainObject(defaultContent[key]) && isPlainObject(content[key])) {
      // Backfill new top-level fields added to a section's default shape after it was
      // first saved, and drop stale fields that no longer exist in the current shape
      // (e.g. a field renamed/removed from applicationSettings in a later release).
      const merged = { ...defaultContent[key] };
      for (const field of Object.keys(defaultContent[key])) {
        if (field in content[key]) merged[field] = content[key][field];
      }
      content[key] = merged;
    }
  }
  return content;
}


function writeSection(key, value) {
  db.prepare(
    `INSERT INTO content_sections (section_key, value, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(section_key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).run(key, JSON.stringify(value));
}

router.get("/", (_req, res) => {
  res.json(readAllContent());
});

router.get("/:sectionKey", (req, res) => {
  const { sectionKey } = req.params;
  if (!KNOWN_KEYS.has(sectionKey)) {
    return res.status(404).json({ message: "Unknown content section." });
  }
  res.json({ value: readAllContent()[sectionKey] });
});

router.put("/:sectionKey", requireAuth, (req, res) => {
  const { sectionKey } = req.params;
  if (!KNOWN_KEYS.has(sectionKey)) {
    return res.status(404).json({ message: "Unknown content section." });
  }

  const { value } = req.body || {};
  if (value === undefined) {
    return res.status(400).json({ message: "Request body must include a 'value' field." });
  }
  if (!typesMatch(value, defaultContent[sectionKey])) {
    return res.status(400).json({ message: "Invalid content shape for this section." });
  }

  const issues = validateContent(value);
  if (issues.length > 0) {
    return res.status(422).json({ message: "Content failed validation.", issues });
  }

  writeSection(sectionKey, value);
  res.json(readAllContent());
});

router.post("/:sectionKey/reset", requireAuth, (req, res) => {
  const { sectionKey } = req.params;
  if (!KNOWN_KEYS.has(sectionKey)) {
    return res.status(404).json({ message: "Unknown content section." });
  }
  writeSection(sectionKey, defaultContent[sectionKey]);
  res.json(readAllContent());
});

router.post("/reset-all", requireAuth, (_req, res) => {
  for (const key of KNOWN_KEYS) writeSection(key, defaultContent[key]);
  res.json(readAllContent());
});

export default router;
