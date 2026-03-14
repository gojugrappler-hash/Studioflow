# STUDIOFLOW — Master Project Document
> **Living document. Updated with every phase. Single source of truth for all AI agents and developers.**
> Last updated: 2026-03-14 (Phase 10 — Pre-Launch Polish (Complete))

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | Studioflow |
| **Tagline** | CRM for Creative Professionals |
| **Target Users** | Tattoo artists, photographers (expandable to other industries) |
| **North Star** | "Non-technical, non-corporate users must feel at home" |
| **Repo Location** | `c:\Users\Campk\.gemini\antigravity\brain\8327bd9e-8479-46fd-82ab-44d98ebc7311\TCSDEV\studioflow` |

---

## 2. Tech Stack (Locked)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| CSS | Tailwind CSS | v4 |
| Component Library | shadcn/ui (Radix) | latest |
| State (client) | Zustand | latest |
| State (server) | TanStack Query | v5 |
| Database | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth | built-in |
| File Storage | Supabase Storage + Google Drive API | — |
| Email | Resend | free tier |
| Payments | Square (Payments API) | latest |
| Push Notifications | Firebase Cloud Messaging (FCM) | — |
| AI | Google Gemini API | free tier |
| Animations | Framer Motion | latest |
| Charts | Recharts | latest |
| Tables | TanStack Table | latest |
| Rich Text Editor | Tiptap | latest |
| Icons | Lucide Icons | latest |
| Forms | React Hook Form + Zod | latest |
| Testing | Vitest + React Testing Library + Playwright | latest |
| Package Manager | pnpm | latest |
| Hosting | Vercel (free tier) | — |
| Monitoring | Sentry + Vercel Analytics | free tier |
| Live Chat | Tawk.to | free |
| Product Tour | Driver.js | latest |
| Drag & Drop | dnd-kit | latest |
| Dashboard Grid | react-grid-layout | latest |

---

## 3. Architecture Standards

### 3.1 Multi-Tenancy
- Shared database, isolated by `org_id` column on EVERY data table
- Supabase RLS enforces isolation at DB level
- Three-tier RLS: org isolation → role-based → client portal isolation
- **EVERY query must be scoped to `org_id`** — no exceptions

### 3.2 Directory Structure
```
studioflow/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, signup, forgot-password
│   │   ├── (app)/              # Authenticated CRM app
│   │   │   ├── dashboard/
│   │   │   ├── contacts/
│   │   │   ├── companies/
│   │   │   ├── deals/
│   │   │   ├── pipeline/
│   │   │   ├── tasks/
│   │   │   ├── calendar/
│   │   │   ├── email/
│   │   │   ├── social/
│   │   │   ├── campaigns/
│   │   │   ├── invoices/
│   │   │   ├── reports/
│   │   │   ├── automations/
│   │   │   ├── settings/
│   │   │   └── layout.tsx      # App shell (sidebar + top bar)
│   │   ├── (portal)/           # Client portal
│   │   │   └── portal/[orgSlug]/ # Dashboard, Login, Appointments, Invoices, Messages, Gallery
│   │   ├── (public)/           # Landing pages, forms
│   │   │   ├── p/[page-slug]/
│   │   │   └── f/[form-slug]/
│   │   └── api/                # API routes
│   │       └── v1/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # Sidebar, TopBar, BottomNav, CommandPalette
│   │   ├── contacts/
│   │   ├── deals/
│   │   ├── pipeline/
│   │   ├── tasks/
│   │   ├── email/
│   │   ├── social/
│   │   ├── campaigns/
│   │   ├── forms/
│   │   ├── invoices/
│   │   ├── automations/
│   │   ├── dashboard/
│   │   ├── portal/
│   │   └── shared/             # Reusable: ActivityTimeline, TagSelector, etc.
│   ├── lib/
│   │   ├── supabase/           # Client, server, middleware helpers
│   │   ├── square/
│   │   ├── google/             # Drive, Calendar
│   │   ├── resend/
│   │   ├── gemini/
│   │   ├── fcm/
│   │   ├── utils/
│   │   └── constants/
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript interfaces/types
│   └── styles/                 # Global CSS, theme variables
├── supabase/
│   ├── migrations/             # Versioned SQL migrations
│   └── config.toml
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
├── tests/
│   ├── unit/
│   ├── components/
│   └── e2e/
└── docs/                       # Project documents (copied from artifacts)
    ├── STUDIOFLOW.md
    ├── PROGRESS.md
    └── AI_CONTEXT.md
```

### 3.3 File Naming Conventions
- **Components:** PascalCase (`ContactCard.tsx`, `PipelineBoard.tsx`)
- **Hooks:** camelCase prefixed with `use` (`useContacts.ts`, `usePipeline.ts`)
- **Stores:** camelCase suffixed with `Store` (`contactStore.ts`, `uiStore.ts`)
- **Utils:** camelCase (`formatCurrency.ts`, `dateHelpers.ts`)
- **Types:** PascalCase suffixed with type kind (`Contact.ts`, `DealSchema.ts`)
- **API routes:** kebab-case (`route.ts` in `/api/v1/contacts/`)
- **Migrations:** timestamp prefix (`20260313_001_create_contacts.sql`)

### 3.4 Database Conventions
- Table names: `snake_case`, plural (`contacts`, `pipeline_stages`)
- Column names: `snake_case` (`first_name`, `created_at`)
- **Every table MUST have:** `id UUID DEFAULT gen_random_uuid()`, `org_id UUID REFERENCES organizations(id)`, `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`, `deleted_at TIMESTAMPTZ` (soft delete)
- Foreign keys: `{entity}_id` (`contact_id`, `deal_id`)
- JSONB config: `field_config JSONB` on `organizations` only
- Indexes on: `org_id`, foreign keys, `deleted_at`, full-text search columns

### 3.5 API Conventions
- All routes under `/api/v1/`
- REST verbs: GET (list/read), POST (create), PATCH (update), DELETE (soft delete)
- Response format: `{ data: T, error: null }` or `{ data: null, error: { message, code } }`
- Zod validation on all inputs
- Rate limiting via middleware
- Auth required on all routes except: `/api/v1/forms/submit`, `/api/v1/webhooks/incoming`

---

## 4. Design System (Locked)

### 4.1 Colors
```css
/* Dark Mode (Primary) */
--bg-primary: #0a0a0f;
--bg-secondary: #12121a;
--bg-card: #1a1a2e;
--bg-card-hover: #22223a;
--border: #2a2a40;
--text-primary: #e4e4ef;
--text-secondary: #8888a0;
--accent-teal: #2dd4bf;
--accent-indigo: #818cf8;
--accent-blue: #60a5fa;
--success: #34d399;
--warning: #fbbf24;
--error: #f87171;
--info: #818cf8;

/* Light Mode */
--bg-primary: #fafafa;
--bg-secondary: #ffffff;
--bg-card: #ffffff;
--border: #e5e5e5;
--text-primary: #1a1a2e;
--text-secondary: #6b7280;
/* Accent colors remain the same */
```

### 4.2 Typography
- **Primary:** Inter (headings, body, UI)
- **Monospace:** JetBrains Mono (numbers, stats, KPIs, code)
- **Scale:** 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px

### 4.3 Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### 4.4 Border Radius
- Small: 6px (inputs, tags)
- Medium: 8px (cards, modals)
- Large: 12px (panels, drawers)
- Full: 9999px (avatars, badges)

### 4.5 Animation Standards
- **Duration:** 150ms (micro), 200ms (standard), 300ms (transitions), 500ms (celebrations)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
- **Rule:** No animation > 300ms that blocks user interaction
- **Respect:** `prefers-reduced-motion` — disable all non-essential animations

### 4.6 Platform Color Coding
- Instagram: `#E1306C` → `#833AB4` gradient
- TikTok: `#00f2ea`
- Facebook: `#1877F2`
- X/Twitter: `#f5f5f5`
- LinkedIn: `#0A66C2`
- Pinterest: `#E60023`

---

## 5. User Roles (Locked)

| Role | Access Level |
|---|---|
| **Owner/Admin** | Full access, billing, user management, settings |
| **Manager** | All org data, reports, pipeline management |
| **Sales Rep / Member** | Own assigned records only |
| **Read-Only / Viewer** | View only, no edits |
| **Solo Mode** | Single-admin simplified experience |
| **Client (Portal)** | Own appointments, invoices, gallery, messages |

---

## 6. Integration Registry

| Service | Purpose | Auth Method | Status |
|---|---|---|---|
| Supabase | Database, Auth, Storage, Real-time | API Key + JWT | Phase 1 |
| Google Drive | File storage, auto-folders | OAuth 2.0 | Phase 6 |
| Google Calendar | Appointment sync | OAuth 2.0 | Phase 3 |
| Square | Payments, invoicing | Access Token + Webhooks | Phase 4 |
| Resend | Transactional + campaign email | API Key | Phase 3 |
| Firebase (FCM) | Push notifications | Server Key | Phase 3 |
| Gemini API | AI features (email, captions, chatbot) | API Key | Phase 6 |
| Tawk.to | Live chat support | Script embed | Phase 7 |
| Sentry | Error tracking | DSN | Phase 7 |

---

## 7. Protocol: Rules Every AI Must Follow

> [!CAUTION]
> These rules are non-negotiable. Every AI agent working on Studioflow MUST follow these.

### 7.1 Before Writing Code
1. Read this document (`STUDIOFLOW.md`) first
2. Check `PROGRESS.md` for current phase and completed work
3. Check `AI_CONTEXT.md` for recent context
4. Never start a phase that depends on an incomplete phase

### 7.2 While Writing Code
1. **Every component** must support dark/light mode
2. **Every database query** must be scoped to `org_id`
3. **Every API route** must validate input with Zod
4. **Every interactive element** must have keyboard support + ARIA labels
5. **Every animation** must respect `prefers-reduced-motion`
6. **Every file** must follow the naming conventions in §3.3
7. **Never** store secrets in code — use environment variables
8. **Never** use `any` type in TypeScript — define proper types
9. **Never** skip error handling — every async operation needs try/catch
10. **Always** use Supabase RLS — never query without auth context

### 7.3 After Writing Code
1. Update `PROGRESS.md` with what was completed
2. Run `pnpm lint` and fix all errors
3. Run `pnpm test` and ensure no regressions
4. Verify responsive design at 390px, 768px, 1440px

### 7.4 Commit Messages
```
feat(contacts): add inline editing with auto-save
fix(pipeline): fix drag-and-drop not updating stage
style(dashboard): add glassmorphic chart containers
chore(deps): update supabase to 2.x
test(auth): add E2E tests for signup flow
docs(standards): update design tokens
```

---

## 8. Cost Tracker

| Service | Free Tier Limit | Current Usage | Status |
|---|---|---|---|
| Vercel | 100GB bandwidth/mo | — | 🟢 Free |
| Supabase | 500MB DB, 1GB storage | — | 🟢 Free |
| Resend | 3,000 emails/mo | — | 🟢 Free |
| Firebase FCM | Unlimited | — | 🟢 Free |
| Gemini API | 15 RPM, 1M tokens/day | — | 🟢 Free |
| Square | 2.6% + 10¢ per txn | — | 🟢 Pay-per-use |
| Sentry | 5K errors/mo | — | 🟢 Free |
| Tawk.to | Unlimited | — | 🟢 Free |
| **Total Monthly** | | | **$0** |
