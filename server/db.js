import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, "data", "tesol.db");
const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Migrate the pre-2026-09 applications schema (full_name/education/term/statement_of_purpose)
// to the new field set. Old rows are preserved untouched under a renamed legacy table.
const applicationsCols = db.prepare("PRAGMA table_info(applications)").all();
if (applicationsCols.some((c) => c.name === "full_name")) {
  db.exec("ALTER TABLE applications RENAME TO applications_legacy_20260908;");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS content_sections (
    section_key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    gender TEXT,
    phone TEXT,
    city TEXT,
    degree_info TEXT,
    teaching_background TEXT,
    questions TEXT,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'not_contacted',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Add the applications.status column for pre-existing databases created before it existed.
const applicationsColsAfterCreate = db.prepare("PRAGMA table_info(applications)").all();
if (!applicationsColsAfterCreate.some((c) => c.name === "status")) {
  db.exec("ALTER TABLE applications ADD COLUMN status TEXT NOT NULL DEFAULT 'not_contacted';");
}