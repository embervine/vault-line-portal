# VAULTLINE — Neon PostgreSQL + Vercel

This project is converted from SQLite to PostgreSQL. The old test SQLite account is NOT migrated.

1. Create a Neon PostgreSQL project and copy its **pooled** connection string. Keep it private.
2. In Vercel, import your private GitHub repository and add `DATABASE_URL` under Project Settings → Environment Variables. Set `NODE_ENV=production`.
3. Before first login, initialize the tables and admin user from a local terminal (with Node.js 22+):
   - `npm install`
   - Set `DATABASE_URL` in a local `.env` file (never commit `.env`).
   - Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` (password at least 12 characters).
   - Run `npm run setup` ONCE. It creates tables and the first administrator.
4. Push the project to GitHub and deploy on Vercel. Test admin login, creating a customer, adjustments, logout and customer login.
5. If deploying before setup, API calls will fail until the tables are initialized.

**Security:** Never upload `.env`, connection strings, SQLite files, or customer credentials to GitHub. Existing SQLite data is not copied. For real funds, accounting, or regulated financial services, this sample needs additional security and compliance review.

**Testing:** Syntax checks can be run without a live database. Full end-to-end testing requires your Neon connection and Vercel deployment.
