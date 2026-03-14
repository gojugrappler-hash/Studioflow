# Phase 7: Polish & Launch — Implementation Plan

The final phase replaces all remaining placeholder pages with production-ready UIs, adds a global toast system, onboarding flow, and compliance essentials.

## User Review Required

> [!IMPORTANT]
> **Scope decision**: The PROGRESS.md lists Testing (Vitest, Playwright, pgTAP) and Deployment (Vercel, Sentry, Analytics) under Phase 7. These require infrastructure setup and environment configuration beyond code generation. **This plan focuses on the UI/UX completions and defers deployment/testing infra to a separate session.**

> [!NOTE]
> `recharts`, `react-grid-layout`, `driver.js`, and `canvas-confetti` will be installed as new dependencies.

---

## Proposed Changes

### New Dependencies

```bash
pnpm add recharts react-grid-layout canvas-confetti driver.js
pnpm add -D @types/react-grid-layout
```

---

### Dashboard (replace placeholder)

#### [NEW] Components in `src/components/dashboard/`

| Component | Description |
|---|---|
| `KPICard.tsx` | Glassmorphic stat card with animated count-up numbers (font-mono), trend arrow, sparkline |
| `RevenueChart.tsx` | Area chart (Recharts) showing revenue over last 12 months, glassmorphic container |
| `PipelineChart.tsx` | Horizontal bar chart of deals by pipeline stage with value totals |
| `ActivityFeed.tsx` | Recent 10 activities with icons, timestamps, and entity links |
| `UpcomingTasks.tsx` | Next 5 due tasks with priority badges and due date |
| `QuickActions.tsx` | 4–6 icon buttons for fast creation (contact, deal, task, invoice, post) |

#### [MODIFY] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/dashboard/page.tsx)

Replace "Coming Soon" stub with a responsive grid layout: greeting header, KPI row (4 cards), charts row (revenue + pipeline), bottom row (activity feed + upcoming tasks + quick actions).

---

### Reports Page

#### [NEW] Components in `src/components/reports/`

| Component | Description |
|---|---|
| `ReportCard.tsx` | Pre-built report card with title, description, icon, "View Report" action |
| `SalesReport.tsx` | Line chart of revenue over time with date range selector |
| `PipelineReport.tsx` | Stacked bar chart of deals count per stage |
| `ActivityReport.tsx` | Bar chart of activities grouped by type per week |

#### [MODIFY] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/reports/page.tsx)

Replace stub with: header, report cards grid (Sales, Pipeline, Activity, Contacts), expandable chart panels.

---

### Settings Page

#### [NEW] Components in `src/components/settings/`

| Component | Description |
|---|---|
| `GeneralSettings.tsx` | Org name, slug, logo upload URL, industry, timezone |
| `ProfileSettings.tsx` | First/last name, email, avatar URL, password change |
| `IntegrationSettings.tsx` | Cards for each integration (Square, Gemini, etc.) with status + key config |
| `NotificationSettings.tsx` | Toggle switches for email, push, in-app notifications per event type |

#### [MODIFY] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/settings/page.tsx)

Replace stub with tabbed settings page (General, Profile, Integrations, Notifications).

---

### Toast Notification System

#### [NEW] [Toast.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/components/shared/Toast.tsx)

Slide-in toast with success/error/warning/info variants, auto-dismiss (5s), manual close, stacking support.

#### [NEW] [toastStore.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/stores/toastStore.ts)

Zustand store managing toast queue: `addToast(type, message)`, `removeToast(id)`.

Wire `<ToastContainer>` into the app layout.

---

### Onboarding

#### [NEW] Components in `src/components/onboarding/`

| Component | Description |
|---|---|
| `OnboardingWizard.tsx` | Multi-step wizard (Welcome → Org Setup → Import → Connect → Done) with progress bar |
| `ProductTour.tsx` | Driver.js wrapper highlighting sidebar, dashboard KPIs, and key actions |
| `SampleDataLoader.tsx` | Button that inserts demo contacts, deals, and tasks for new orgs |

---

### Compliance & Legal

#### [NEW] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/privacy/page.tsx)

Static privacy policy page with standard CRM data handling terms.

#### [NEW] [CookieConsent.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/components/shared/CookieConsent.tsx)

Bottom banner with Accept/Decline, persists choice to localStorage, renders in root layout.

---

## Verification Plan

### Automated Tests
1. `pnpm build` — must succeed with zero errors

### Manual Verification
1. `/dashboard` — KPI cards render with count-up, charts display, activity feed works
2. `/reports` — report cards grid visible, charts render with empty data states
3. `/settings` — tabbed UI loads, forms render with current values
4. Toast system — trigger success/error toasts via UI actions
5. Cookie consent banner appears on first visit
