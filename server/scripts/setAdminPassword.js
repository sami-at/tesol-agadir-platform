#!/usr/bin/env node
// Production admin credential management CLI. Run this directly on the
// server (never exposed via HTTP) to create the first admin account or to
// change an existing admin's password. Safe to run multiple times.
//
// Usage:
//   node server/scripts/setAdminPassword.js <username> <password>
//
// Never pass real passwords as visible shell arguments on a shared machine;
// prefer running this interactively on the production host.
import bcrypt from "bcryptjs";
import { db } from "../db.js";

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node server/scripts/setAdminPassword.js <username> <password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const trimmedUsername = username.trim();
const passwordHash = bcrypt.hashSync(password, 12);

const existing = db.prepare("SELECT id FROM admin_users WHERE username = ?").get(trimmedUsername);

if (existing) {
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(passwordHash, existing.id);
  console.log(`[admin] Password updated for existing account "${trimmedUsername}".`);
} else {
  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(
    trimmedUsername,
    passwordHash,
  );
  console.log(`[admin] Created new admin account "${trimmedUsername}".`);
}

// Password value is intentionally never logged.
db.close();
