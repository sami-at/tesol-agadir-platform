import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { defaultContent } from "../src/data/defaultContent.js";

/** Idempotent: only inserts sections that don't already exist. Never overwrites saved content. */
export function seedContent() {
  const insert = db.prepare(
    "INSERT OR IGNORE INTO content_sections (section_key, value) VALUES (?, ?)",
  );
  const insertMany = db.transaction((entries) => {
    for (const [key, value] of entries) insert.run(key, JSON.stringify(value));
  });
  insertMany(Object.entries(defaultContent));
}

/** Only creates the first admin account when no accounts exist yet. Never overwrites an existing account. */
export function seedAdminUser() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM admin_users").get();
  if (count > 0) return;

  const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!username || !password) {
    console.warn(
      "[seed] No admin account exists yet, and ADMIN_BOOTSTRAP_USERNAME/ADMIN_BOOTSTRAP_PASSWORD " +
        "are not set. Set both in your .env file and restart the server to create the first admin account.",
    );
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(
    username.trim(),
    passwordHash,
  );
  console.log(`[seed] Created initial admin account "${username.trim()}".`);
}
