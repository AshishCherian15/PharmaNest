# Pharma Nest Major Project Roadmap

## Phase 1: Foundation (Completed in current pass)
- Role-based authentication system with session cookies.
- Login and registration APIs.
- Protected routing for admin and customer modules.
- Customer module skeleton with overview, orders, prescriptions, and profile.
- Landing and auth frontend cleanup and responsive updates.

## Phase 2: Data Layer and Persistence
- Add PostgreSQL via Prisma (users, roles, products, carts, prescriptions, orders, payments, audit logs).
- Replace in-memory auth store with database-backed accounts.
- Add password salting and hashing via argon2/bcrypt.
- Add refresh-session strategy and session revocation table.

## Phase 3: Core Commerce Flows
- Customer cart and checkout with GST-aware invoice computation.
- Address management and delivery slot booking.
- Prescription upload flow and pharmacist verification workflow.
- Product search with category, brand, and stock filters.

## Phase 4: Admin Operations
- Inventory management with batch, expiry, and reorder automation.
- Supplier and purchase-order lifecycle management.
- Sales and POS module with receipt generation.
- Role-based permissions: Owner, Admin, Pharmacist, Staff.

## Phase 5: Integrations
- Payment gateway (Razorpay/Stripe).
- SMS/WhatsApp and email notifications.
- Shipping/tracking integrations.
- Optional telehealth/pharmacist chat support.

## Phase 6: Reliability and Security
- End-to-end tests (Playwright), unit tests (Vitest/Jest), API tests.
- Rate-limiting and brute-force protection on auth endpoints.
- Security headers, CSRF strategy, audit logging, and observability.
- CI/CD with staging and production deployment.

## Phase 7: Scale and Product Analytics
- Caching strategy (Redis) for hot product/catalog data.
- Background jobs for reminders and reorder triggers.
- KPI dashboards: conversion, retention, prescription turnaround, order SLA.
- Multi-tenant support for chain pharmacies.
