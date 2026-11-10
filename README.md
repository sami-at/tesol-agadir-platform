# American TESOL Academy Agadir — Website & Admin Platform

React (Vite) frontend + Express/SQLite backend for the academy website and its
content-management admin dashboard.

## 1. Requirements

- Node.js 20+ (developed/tested on Node 25)
- npm

## 2. Installation

```bash
npm install
```

## 3. Environment variables

Copy `.env.example` to `.env` and fill in real values. `.env` is gitignored and
must never be committed.

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | no (default `4000`) | Port the Express API/server listens on |
| `HOST` | no (default `0.0.0.0`) | Interface the server binds to |
| `TRUST_PROXY` | no | Set when running behind a reverse proxy/load balancer, so client IPs (and rate limiting) are correct |
| `DATABASE_PATH` | no (default `./server/data/tesol.db`) | Path to the SQLite database file — use an absolute path to a persistent volume in production |
| `LOGIN_RATE_LIMIT_WINDOW_MINUTES` / `LOGIN_RATE_LIMIT_MAX` | no | Tune the login rate limiter |
| `SUBMISSION_RATE_LIMIT_WINDOW_MINUTES` / `SUBMISSION_RATE_LIMIT_MAX` | no | Tune the Apply/Contact rate limiter |
| `SESSION_SECRET` | **yes** | Signs the admin session cookie; the server refuses to start without it. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CLIENT_ORIGIN` | recommended | The exact origin the frontend is served from (CSRF Origin-check). Must match production domain exactly (scheme + host + port) |
| `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` | first boot only | Creates the first admin account. Only consulted while `admin_users` is empty — remove from `.env` after first successful boot |

`NODE_ENV` is deliberately **not** read from `.env` (see note below) — set it
via the command/process manager instead: `NODE_ENV=production npm start`.

> **Why `NODE_ENV` isn't in `.env`:** Vite loads `.env` files into the build
> process itself. If `NODE_ENV` were set there, it can leak into `vite build`
> and force an unminified development-mode bundle. Always set `NODE_ENV`
> at the process level, never via a dotenv file.

## 4. Database initialization

No manual migration step is needed. On every boot, the server:
1. Opens/creates the SQLite file at `DATABASE_PATH` (directory auto-created).
2. Creates any missing tables (`CREATE TABLE IF NOT EXISTS`) — never destructive.
3. Seeds default content for any section not already present (`INSERT OR IGNORE`) — never overwrites saved edits.
4. Creates the first admin account from `ADMIN_BOOTSTRAP_*` only if the `admin_users` table is empty.

All of the above is safe to run on every restart/deploy.

## 5. Development

```bash
npm run dev
```

Runs Vite (frontend, with hot reload) and the Express API concurrently. Vite
proxies `/api/*` to the Express server so the browser sees a single origin.

## 6. Production build

```bash
npm run build
```

Builds the frontend into `dist/`.

## 7. Production start

```bash
NODE_ENV=production npm start
```

This runs a single Express process that serves the API **and** the built
`dist/` frontend (with SPA fallback) from one origin/port — no separate
frontend host or CORS configuration needed. Confirm `dist/` exists (run
`npm run build` first).

## 8. Admin bootstrap & credential rotation

On first boot, set `ADMIN_BOOTSTRAP_USERNAME`/`ADMIN_BOOTSTRAP_PASSWORD` in
`.env`, start the server once, then remove those two variables from `.env`.

To change a password later (or create additional admins), run directly on the
server host (never exposed via HTTP):

```bash
npm run admin:set-password -- <username> <password>
```

Safe to run repeatedly. Updates the existing account's password if the
username exists, otherwise creates a new admin account. Never logs the
password.

## 9. SQLite persistence requirement

The database is a single file (`DATABASE_PATH`, default
`server/data/tesol.db`). **This requires persistent, writable filesystem
storage on the host.** Any hosting platform with an ephemeral/read-only
filesystem (e.g. most serverless/edge function platforms) is **not suitable**
without attaching a persistent volume. Confirm your hosting target provides:
- a persistent disk/volume mounted at (or containing) the database directory,
- write permission for the Node process user on that directory,
- the same volume surviving deploys/restarts (not recreated from an image).

## 10. Backup / restore

The entire database is the one file at `DATABASE_PATH` (plus SQLite's
`-wal`/`-shm` companion files while the server is running).

- **Backup:** stop the server (or use SQLite's `.backup` / `VACUUM INTO`
  for a live copy), then copy `tesol.db` (and `tesol.db-wal`/`tesol.db-shm`
  if present) to your backup location. A simple approach: a scheduled job
  running `sqlite3 tesol.db ".backup 'backup-$(date +%F).db'"`.
- **Restore:** stop the server, replace `tesol.db` with the backup file,
  delete any stale `-wal`/`-shm` files, restart.
- Never commit the database file to git.

## 11. Deployment requirements

Before deploying, confirm:
- A host that provides a persistent volume (see §9) — not a purely
  ephemeral/serverless filesystem.
- Real values set for `SESSION_SECRET` and `CLIENT_ORIGIN` (matching the
  production domain exactly).
- `NODE_ENV=production` set at the process/host level.
- The first admin account created via bootstrap, then bootstrap env vars removed.
- HTTPS termination in front of the app (so `Secure` cookies work) — either
  the platform's built-in TLS or a reverse proxy (nginx, Caddy, etc.).
- If behind a reverse proxy, `TRUST_PROXY` set appropriately.

## 12. Production deployment (Hetzner Cloud)

Live architecture: `Internet → Nginx (reverse proxy, port 80/443) → systemd-managed
Node process (127.0.0.1:4000, non-root user) → SQLite file on local disk`.

- **Server**: Hetzner CX23 (2 vCPU / 4GB RAM / 40GB disk), Ubuntu 26.04 LTS, Helsinki.
- **App user**: `tesol` (non-root, no sudo, owns `/var/www/tesol`).
- **Production directory**: `/var/www/tesol` (source deployed via `rsync` from
  the local dev machine — no git repo exists for this project yet).
- **Node**: v24 LTS (installed via NodeSource).
- **Process manager**: systemd unit `/etc/systemd/system/tesol.service`
  (`Type=simple`, `User=tesol`, `Restart=on-failure`, `NoNewPrivileges`,
  `ProtectSystem=strict`, enabled for boot). `NODE_ENV=production` is set
  directly in the unit file's `Environment=`, not in `.env` (see §3 note).
- **Environment file**: `/var/www/tesol/.env`, mode `600`, owned by `tesol`.
  Never committed, never logged.
- **Database**: `/var/www/tesol/server/data/tesol.db`, directory mode `750`,
  owned by `tesol`. Confirmed to persist across app restarts and process
  crashes (systemd auto-restarts on failure, verified via `kill -9`).
- **Backups**: `/usr/local/bin/backup-tesol-db.sh` runs nightly at 02:00
  server time via `tesol`'s crontab, using `sqlite3 .backup` (safe, WAL-aware
  online backup) into `/var/backups/tesol/` (outside the web root, not
  Nginx-servable), gzipped, 14-day retention. Logs to
  `/var/log/tesol-backup.log`.
  - **Manual backup**: `sudo -u tesol /usr/local/bin/backup-tesol-db.sh`
  - **Restore**: `systemctl stop tesol`, `gunzip` the chosen backup, copy it
    over `/var/www/tesol/server/data/tesol.db` (remove any stale `-wal`/`-shm`
    files first), `systemctl start tesol`.
- **Nginx**: config at `/etc/nginx/sites-available/tesol` (symlinked into
  `sites-enabled`). Proxies all traffic to `127.0.0.1:4000` (the app itself
  serves both the API and the built SPA, so Nginx doesn't need to duplicate
  static-file serving). Blocks direct access to `.env`, `.git`, and
  `*.db`/`*.sqlite`/`*.log`/`*.bak` files as defense-in-depth.
- **Firewall**: `ufw`, default-deny incoming, only `22/tcp`, `80/tcp`,
  `443/tcp` allowed. Port 4000 is bound to `127.0.0.1` only and is not
  reachable from outside the server (verified).
- **HTTPS**: live at `https://tesolagadir.com` via Let's Encrypt
  (`certbot --nginx`). HTTP requests to port 80 are 301-redirected to HTTPS.
  Certificate auto-renews via the `certbot.timer` systemd timer (currently
  valid through 2026-12-07; verify anytime with
  `systemctl list-timers | grep certbot`). `CLIENT_ORIGIN` in `.env` and the
  Nginx `server_name` are both set to the domain. Full admin login → session
  → logout flow has been verified end-to-end over HTTPS.

### Deploying an update

```bash
# from the local project root
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude 'dist' \
  --exclude 'server/data' --exclude '.git' -e "ssh -i ~/.ssh/tesol_hetzner" \
  ./ tesol@<server-ip>:/var/www/tesol/

ssh -i ~/.ssh/tesol_hetzner tesol@<server-ip> \
  "cd /var/www/tesol && npm ci && npm run build && sudo systemctl restart tesol"
```

(`tesol` has no sudo access by design — restarting the service requires
running that last step as `root` instead, e.g. `ssh root@<server-ip>
'systemctl restart tesol'`.)

### Once a domain is purchased

Already done for `tesolagadir.com` — steps below are kept for reference if
the domain ever changes or a second domain/subdomain is added.

1. Point the domain's DNS `A`/`AAAA` records at the server's public IP.
2. Update `CLIENT_ORIGIN` in `/var/www/tesol/.env` to the exact HTTPS origin
   (e.g. `https://example.com`).
3. Update the Nginx `server_name` in `/etc/nginx/sites-available/tesol` to
   the domain.
4. Run `certbot --nginx -d example.com` (installs `certbot`/
   `python3-certbot-nginx` first) to obtain a Let's Encrypt certificate and
   configure the HTTP→HTTPS redirect. Certbot's systemd timer handles renewal
   automatically — verify with `systemctl list-timers | grep certbot`.
5. Restart the app (`systemctl restart tesol`) so the new `CLIENT_ORIGIN`
   takes effect, then re-verify admin login end-to-end.

### Troubleshooting

- App logs: `journalctl -u tesol -f`
- Nginx logs: `journalctl -u nginx -f`, `/var/log/nginx/error.log`
- App status: `systemctl status tesol`
- Disk space: `df -h /`
- Backup log: `/var/log/tesol-backup.log`

---

## Original Vite template notes

This template provides a minimal setup to get React working in Vite with HMR
and some Oxlint rules. See
[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
and [Oxc](https://oxc.rs) for details on the toolchain in use.

