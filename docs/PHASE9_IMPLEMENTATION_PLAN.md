# Phase 9: Master Plan Hardening & Post-Launch

Following the master plan (`STUDIOFLOW.md`), I audited every section against the actual codebase. Below are the **concrete gaps** that exist between what the master plan specifies and what is currently implemented.

---

## User Review Required

> [!IMPORTANT]
> **Several items below require API credentials or third-party accounts.** I've separated work into "can do now" vs "blocked on credentials" so we can move forward on everything possible.

> [!IMPORTANT]
> **Scope question:** The deferred items list is large. I recommend we tackle the work in this priority order, but let me know if you want to reorder or skip anything:
> 1. **9A** — Testing infrastructure (the master plan mandates this in §7.3)
> 2. **9B** — Missing scaffolds that the master plan directory structure calls for
> 3. **9C** — Credential-gated integrations (only what you have keys for)
> 4. **9D** — Compliance & polish

---

## Proposed Changes

### 9A: Testing Infrastructure

The master plan tech stack (§2) specifies **Vitest + React Testing Library + Playwright**. Currently zero test infrastructure exists — no `tests/` directory, no test config, no test dependencies.

#### [NEW] vitest.config.ts
- Vitest configuration with path aliases matching `tsconfig.json`

#### [MODIFY] [package.json](file:///C:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/package.json)
- Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `happy-dom`, `@playwright/test` as dev dependencies
- Add scripts: `"test": "vitest"`, `"test:e2e": "playwright test"`, `"test:coverage": "vitest --coverage"`

#### [NEW] tests/unit/ (3-5 test files)
- Hook tests for `useContacts`, `useDeals`, `useAuth` (mock Supabase, verify CRUD logic)

#### [NEW] tests/components/ (3-5 test files)
- Component render tests for `ContactCard`, `PipelineBoard`, `DashboardWidgets`

#### [NEW] tests/e2e/ (2-3 test files)
- Auth flow (login → redirect → dashboard)
- Contacts flow (list → create → edit → delete)
- Pipeline flow (view board → create deal → drag between stages)

---

### 9B: Missing Master Plan Items

The master plan directory structure (§3.2) and protocol (§7.1) specify several items that don't yet exist.

#### [NEW] supabase/seed.sql
- Demo organization, users, contacts, companies, deals, tasks
- Enables `supabase db reset` to load a working demo state

#### [NEW] docs/AI_CONTEXT.md
- Per §7.1, AI agents must check this document before writing code
- Will contain: current phase, recent changes, known issues, environment setup

#### [NEW] src/lib/google/ (scaffold)
- `drive.ts` — Google Drive API client stub (OAuth flow, file picker, auto-folder creation)
- `calendar.ts` — Google Calendar sync stub (two-way appointment sync)

#### [NEW] src/lib/resend/ (scaffold)
- `client.ts` — Resend email sending client stub (transactional + campaign)

#### [NEW] src/lib/fcm/ (scaffold)
- `client.ts` — Firebase Cloud Messaging stub (push notification registration + sending)

#### [NEW] Install Tiptap
- Add `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` to dependencies
- Create `src/components/ui/RichTextEditor.tsx` — reusable Tiptap component
- Wire into Email Composer and Campaign Builder where plain textareas exist

---

### 9C: Credential-Gated Integrations (Only If You Have Keys)

These items were deferred because they need API credentials. I'll scaffold the integration code so it's ready to activate once you plug in keys.

| Integration | Env Var Needed | Can Scaffold Now? |
|---|---|---|
| Google Drive | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | ✅ Scaffold code |
| Google Calendar | Same as above | ✅ Scaffold code |
| Resend | `RESEND_API_KEY` | ✅ Scaffold code |
| Square Live | `SQUARE_ACCESS_TOKEN`, `SQUARE_WEBHOOK_SIGNATURE_KEY` | Already scaffolded |
| Firebase (FCM) | `FIREBASE_SERVER_KEY` | ✅ Scaffold code |
| Tawk.to | Account + Script ID | ✅ Embed script |
| Sentry | `SENTRY_DSN` | ✅ Install + config |
| Vercel Analytics | Deployment | ✅ Install package |

---

### 9D: Compliance & Polish

#### [NEW] GDPR Delete + Export
- API route `/api/v1/gdpr/export` — export all user data as JSON
- API route `/api/v1/gdpr/delete` — soft-delete all user data + schedule hard delete
- Settings page section for "Download My Data" and "Delete Account"

#### Responsive Verification
- Per §7.3, verify at 390px, 768px, and 1440px using browser tool

---

## Verification Plan

### Automated Tests
1. `pnpm test` — run Vitest unit + component tests (after 9A is complete)
2. `pnpm test:e2e` — run Playwright E2E tests
3. `pnpm build` — verify zero build errors after all changes
4. `pnpm lint` — verify no lint errors (per master plan §7.3)

### Manual Verification
- Browser smoke test at **390px** (mobile), **768px** (tablet), **1440px** (desktop)
- Verify Tiptap rich text editor renders in Email Composer
- Verify seed.sql loads demo data (requires Supabase CLI — may need user confirmation)
