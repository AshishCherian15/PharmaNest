# PharmaNest

PharmaNest is a Next.js pharmacy platform for customers, pharmacists, and internal staff. It includes a storefront, prescription workflows, order tracking, inventory and supplier management, and an admin dashboard backed by Prisma and a local SQLite database for development.

## What It Includes

- Customer storefront with catalog browsing, product detail pages, cart, checkout, and order history.
- Authentication flows for login and registration.
- Prescription request and eligibility flows for customers.
- Staff dashboard for inventory, orders, prescriptions, reports, sales, suppliers, and users.
- Admin API routes for managing catalog, orders, users, suppliers, purchase orders, and reports.
- Shared UI components, themed landing pages, and product image handling.

## Tech Stack

- Next.js 15 with React 19
- TypeScript
- Tailwind CSS
- Prisma with SQLite for local development
- Vitest for tests
- Genkit tooling for AI-related development workflows

## Getting Started

1. Install dependencies.
2. Set up environment variables in `.env`.
3. Initialize the database if needed.
4. Run the development server.

Example:

```bash
npm install
npm run db:push
npm run dev
```

The app runs on port `9002` by default.

## Environment Variables

The local setup expects:

- `DATABASE_URL` for the Prisma database connection.
- `AUTH_SECRET` for session and auth signing.
- `AUTH_DEFAULT_PASSWORD` for demo or seeded accounts.

See `.env.example` for the current defaults used in development.

## Available Scripts

- `npm run dev` - Start the development server.
- `npm run dev:clean` - Clear the Next.js build cache and start dev.
- `npm run build` - Build the production app.
- `npm run start` - Start the production server.
- `npm run test` - Run Vitest once.
- `npm run lint` - Run linting.
- `npm run typecheck` - Run TypeScript checks.
- `npm run db:generate` - Generate Prisma client code.
- `npm run db:push` - Push schema changes to the database.
- `npm run db:studio` - Open Prisma Studio.

## Project Structure

- `src/app` - Pages, layouts, routes, and API endpoints.
- `src/components` - Shared UI and feature components.
- `src/lib` - Server utilities, data access, validation, and domain logic.
- `prisma` - Prisma schema and local development database.
- `docs` - Planning, audit, and roadmap documentation.

## Notes

- The root landing page introduces the platform and links into login and registration.
- The repository includes local development artifacts such as the SQLite database path under `prisma/`.
- Some generated or machine-specific files are ignored through `.gitignore`.
