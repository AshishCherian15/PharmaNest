# Supabase Deployment

Use this checklist when deploying PharmaNest to Vercel with Supabase Postgres.

## 1. Create Supabase Project

- Create a new Supabase project.
- Copy the pooled connection string for `DATABASE_URL`.
- Copy the direct connection string for `DIRECT_URL`.

## 2. Set Vercel Environment Variables

Add these variables in the Vercel project settings:

- `DATABASE_URL` - Supabase pooled PostgreSQL connection string.
- `DIRECT_URL` - Supabase direct PostgreSQL connection string.
- `PRISMA_SCHEMA_PATH` - `prisma/schema.postgres.prisma`
- `AUTH_SECRET` - Strong random secret.
- `AUTH_DEFAULT_PASSWORD` - Demo account password used by the bootstrap seed.

## 3. Apply the Prisma Schema

From a local environment that can reach Supabase, run:

```bash
npm run db:push:postgres
npm run db:generate:postgres
```

If you already have data in the local SQLite database, migrate it into Supabase separately before switching production traffic.

## 4. Deploy on Vercel

- Connect the GitHub repository to Vercel.
- Ensure the build command remains `next build`.
- Confirm the production environment variables are set before the first deploy.

## 5. Validate the App

- Sign in with the seeded admin/customer accounts.
- Verify catalog browsing, checkout, prescriptions, and dashboard pages.
- Confirm the database records are landing in Supabase and not in a local file database.

## 6. Run Deployment Verification

Run environment validation:

```bash
npm run verify:deploy
```

Run environment plus health validation:

```bash
HEALTHCHECK_URL=https://<your-domain>/api/health npm run verify:health
```

For final promotion checks, follow [docs/release-checklist.md](docs/release-checklist.md).