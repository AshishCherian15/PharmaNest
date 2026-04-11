# Release Checklist

Use this checklist before promoting a release to production.

## Pre-Release

- Ensure CI is green on the target commit.
- Confirm Vercel environment variables are configured:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `PRISMA_SCHEMA_PATH=prisma/schema.postgres.prisma`
  - `AUTH_SECRET`
  - `AUTH_DEFAULT_PASSWORD`
- Run local validation:

```bash
npm run typecheck
npm run build
npm run verify:deploy
```

## Database

- Apply schema to Supabase PostgreSQL:

```bash
npm run db:push:postgres
npm run db:generate:postgres
```

- Verify expected seed data and table counts.

## Post-Deploy

- Verify health endpoint returns success:
  - `GET /api/health`
- Validate key paths:
  - Login
  - Catalog
  - Checkout
  - Customer orders
  - Dashboard inventory and sales
- Verify new records persist in Supabase.
