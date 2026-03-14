# Studioflow

> **CRM for Creative Professionals** — built for tattoo artists, photographers, and creative studios.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/license-private-gray)

---

## Overview

Studioflow is a full-featured CRM (Customer Relationship Management) platform designed specifically for non-technical creative professionals. It provides contact management, deal pipelines, invoicing, email marketing, social media management, AI-powered features, client portal, and a scheduling calendar — all in a polished dark-mode interface.

### Key Stats

| Metric | Count |
|---|---|
| Pages | 30+ |
| Components | 70+ |
| Custom Hooks | 20 |
| API Routes | 8 |
| Database Migrations | 8 |
| Zustand Stores | 3 |
| Tests | 96 (unit + component) |

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Customizable KPI cards, revenue/pipeline charts, activity feed, quick actions |
| **Contacts** | Full CRUD, tags, search, CSV import/export, bulk operations |
| **Companies** | Company management with linked contacts |
| **Pipeline** | Kanban board with drag-and-drop, deal tracking, value roll-ups |
| **Tasks** | Task management with priorities, due dates, My Tasks + Team Kanban |
| **Email Hub** | Inbox, composer, template selector, preview panel, status tracking |
| **Calendar** | Month/week/day views, appointment forms, availability manager |
| **Social Media** | Multi-platform post composer, content calendar, AI captions |
| **Campaigns** | Email campaign builder with contact enrollment, UTM tracking |
| **Forms** | Embeddable form builder, auto-lead creation from submissions |
| **Invoices** | Invoice generation, product/service catalog, Square-ready payments |
| **Automations** | Visual rule builder (IF->THEN), pre-built templates, execution logs |
| **AI** | Email writer, caption generator, lead scoring, smart suggestions (Gemini) |
| **Reports** | Sales, pipeline, activity, and contact growth reports with charts |
| **Settings** | Org config, profile, integrations, notification preferences |
| **Client Portal** | Branded portal with login, appointments, invoices, messages, gallery |
| **PWA** | Installable app with service worker, offline fallback page |
| **Admin Panel** | Super-admin dashboard, support ticket management |
| **Support** | In-app support widget, ticket submission system |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| Language | TypeScript 5.x |
| CSS | Vanilla CSS with CSS Variables (dark/light) |
| State | Zustand (client) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | Google Gemini API |
| Charts | Recharts |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
src/
  app/              # Next.js App Router pages
    (auth)/          # Login, signup, forgot-password
    (app)/           # Authenticated CRM (18 pages)
    (admin)/         # Super-admin panel (2 pages)
    (portal)/        # Client portal (6 pages)
    (public)/        # Public forms
    api/v1/          # REST API routes (9 endpoints)
  components/        # UI components (68+ files)
  hooks/             # Custom React hooks (20 files)
  stores/            # Zustand stores (3 files)
  types/             # TypeScript type definitions
  lib/               # Supabase, Gemini, Square, utilities
supabase/
  migrations/        # 8 versioned SQL migrations
public/
  manifest.json      # PWA manifest
  sw.js              # Service worker
  offline.html       # Offline fallback
tests/               # Unit, component, and E2E tests (96)
docs/                # Project documentation
```

---

## Documentation

| Document | Description |
|---|---|
| [STUDIOFLOW.md](docs/STUDIOFLOW.md) | Master project document — architecture, design system, conventions |
| [PROGRESS.md](docs/PROGRESS.md) | Phase-by-phase progress tracker with change log |
| [PHASE5_PLAN.md](docs/PHASE5_PLAN.md) | Phase 5 implementation plan |
| [PHASE6_7_IMPLEMENTATION_PLAN.md](docs/PHASE6_7_IMPLEMENTATION_PLAN.md) | Phase 6-7 implementation plan |
| [PHASE8_WALKTHROUGH.md](docs/PHASE8_WALKTHROUGH.md) | Phase 8 implementation walkthrough |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `GEMINI_API_KEY` | Google Gemini API key (optional, for AI features) |
| `SQUARE_ACCESS_TOKEN` | Square access token (optional, for payments) |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square webhook signature key |
| `RESEND_API_KEY` | Resend API key (optional, for email sending) |
| `SQUARE_ENVIRONMENT` | Square environment: `sandbox` or `production` |
| `SENTRY_DSN` | Sentry DSN (optional, for error tracking) |
| `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` | Tawk.to property ID (optional, for live chat) |
| `FIREBASE_SERVER_KEY` | Firebase server key (optional, for push notifications) |

---

## Testing

```bash
pnpm test          # Run unit + component tests (96 passing)
pnpm test:e2e      # Run Playwright E2E tests
```

---

## Repository

```
https://github.com/gojugrappler-hash/Studioflow
```

---

## Build

```bash
pnpm build
# Compiled successfully — 40 routes, zero errors
# 96 tests passing
```
