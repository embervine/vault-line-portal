# Vaultline Funds Portal

A complete customer funds-tracking portal with admin and customer dashboards. **Important:** “Funds” is an account-unit label in this version. Entries are non-monetary, have no cash value, and cannot be deposited, withdrawn, transferred, or cashed out. This is not a banking service or wallet.

## Features

- Separate admin and customer roles
- Admin creates accounts and sets initial credentials
- Customers can see only their own funds units and transaction histories
- Admin can search customers, add or deduct funds units, and record a mandatory reason
- Atomic updates prevent negative balances; permanent transaction audit trail
- Admin can reset customer passwords; users can change their own passwords
- Mobile-friendly premium dashboard and responsive login page
- bcrypt password hashing, random hashed session tokens, secure HTTP-only cookies, rate-limited login, restrictive security headers
- Persistent SQLite database: local storage is retained after restarts

## Quick start (Windows, Mac, Linux)

1. Install **Node.js 22 or newer** from https://nodejs.org/.
2. Extract the ZIP and open a terminal in the `point-portal` folder.
3. Run `npm install`.
4. Run `npm run setup` **once**. The command prints your unique admin username and password; store them securely.
5. Run `npm start`.
6. Open **http://localhost:3000** in your browser. Log in as admin and create customer accounts.

Optional: copy `.env.example` to `.env` and edit `PORT`, `DATA_DIR`, or custom setup credentials `ADMIN_USERNAME` and `ADMIN_PASSWORD` (12+ characters) before setup. Never upload `.env` or `data/` publicly.

## Hosting so customers can log in from anywhere

This project runs on any Linux or Windows server supporting Node.js 22+. Install it on a VPS, set `NODE_ENV=production`, point a domain at it, use HTTPS via a reverse proxy such as Caddy or Nginx, and run `npm start` with a process manager. Run `npm run setup` once on the server first.

**Important:** The SQLite database lives under `DATA_DIR` and **must be on persistent storage**. Many free or serverless hosting platforms wipe their local disk on restart/deploy; do not deploy to those without a persistent volume. Back up `DATA_DIR` regularly and restrict access to it. For large installations or horizontally scaled hosting, migrate to a managed SQL database and session store.

### Example production reverse proxy

With a real domain pointing to your server, Caddy can automatically provide HTTPS:

```
portal.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

Set `NODE_ENV=production`; HTTPS is required for secure cookies. If the app is behind a trusted proxy, configure `TRUST_PROXY=true`. Change example domain to yours.

## Notes

- This is a runnable starter application, not a hosted portal. You must install and deploy it before customers can access it.
- The frontend uses the VAULTLINE brand; change `VAULTLINE` in `public/index.html` to your business name.
- Keep admin credentials confidential. Customers must be given their credentials through a private channel.
- For a public high-volume rollout, arrange an external security review, backups, monitoring, and a managed database.


## IMPORTANT: If the page appears as plain text
This release fixes stale browser CSS caching. Stop the server (Ctrl+C), replace the old project files with this version, then restart `npm start`. Open http://localhost:3000 and press Ctrl+Shift+R for a hard refresh. If the problem persists, visit http://localhost:3000/style.css?v=20261015-fixed — it should show CSS text. Make sure you extracted the entire ZIP, not just index.html.


## Website Settings (administrator only)
Sign in as administrator, choose **Website Settings** from the sidebar, edit the text fields, then click **Save website text**. Changes are stored in the existing SQLite database and appear to visitors when they reload the page. The `{name}` placeholder in greetings inserts the signed-in account name. Customer users cannot access the editor or change text. Keep your existing `data/portal.sqlite` file when upgrading so accounts, transactions and saved wording remain intact.
