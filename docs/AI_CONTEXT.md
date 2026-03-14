# STUDIOFLOW — AI Context
> **Read this file before writing ANY code.** Updated after every session.
> Last updated: 2026-03-14

## Current Phase
Phase 10: Pre-Launch Polish (UI premium, testing, deployment prep)

## Recent Changes (2026-03-14)
- Migrated payment integration from Stripe to Square (full codebase swap)
- Created ALTER TABLE migration (stripe → square columns) — ✅ CEO ran it
- Created support_tickets table migration — ✅ CEO ran it
- Deleted all demo/sample data (seed.sql, SampleDataLoader, DEMO_APPOINTMENTS)
- Generated Studioflow logo (teal/indigo gradient)
- Built super-admin panel (/admin, /admin/tickets)
- Built in-app SupportWidget (floating help button)
- Created Terms of Service page (/terms)
- Created EmptyState shared component
- Created env validation utility (validateEnv.ts)
- Created GitHub Actions CI workflow
- Updated CEO_SETUP_GUIDE.md with Square instructions

## Known Issues
- None — last build: 40 routes, zero errors
- Tests: 31 unit/component tests passing

## Environment
- Dev server: `pnpm dev` (http://localhost:3000)
- Build: `pnpm build`
- Tests: `pnpm test`
- E2E: `pnpm test:e2e`

## Credentials Status
| Service | Status | Notes |
|---|---|---|
| Supabase | Connected | URL + Anon Key in .env.local |
| Square | Scaffold + DB ready | Needs SQUARE_ACCESS_TOKEN |
| Gemini | Optional | Needs GEMINI_API_KEY |
| Resend | Scaffold only | Needs RESEND_API_KEY |
| Google APIs | Scaffold only | Needs OAuth client credentials |
| FCM | Scaffold only | Needs Firebase server key |
| Sentry | Scaffold only | Needs SENTRY_DSN |
| Tawk.to | Scaffold only | Needs property ID |

## Key Design Decisions
- **No demo data** — app starts with clean slate, users create own data
- **Mobile-first** — all UIs must work at 390px first
- **Minimal animations** — luxury, premium feel, not flashy
- **Square** (not Stripe) — both target clients already use Square
- **Solo users** — no team features needed for launch
- **Free tier only** — no billing/subscription system

## Architecture Reminders
- Every DB query MUST be scoped to `org_id`
- Every API route validates with Zod
- Dark/light mode required on all components
- Respect `prefers-reduced-motion`
- Never use `any` type
- Super-admin at `/admin` (protected route)
