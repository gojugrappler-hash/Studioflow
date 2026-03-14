# Phase 7: Polish & Launch — Task Checklist

## 1. Install New Dependencies
- [x] `recharts`, `react-grid-layout`, `driver.js`, `canvas-confetti`

## 2. Dashboard (replace placeholder)
- [x] `KPICard.tsx` — animated count-up stat cards
- [x] `RevenueChart.tsx` — glassmorphic area chart (Recharts)
- [x] `PipelineChart.tsx` — bar chart by stage
- [x] `ActivityFeed.tsx` — recent activity timeline
- [x] `UpcomingTasks.tsx` — next due tasks widget
- [x] `QuickActions.tsx` — quick-create shortcuts
- [x] Replace `(app)/dashboard/page.tsx` with full widget grid

## 3. Reports Page (replace placeholder)
- [x] `ReportCard.tsx` — report summary card
- [x] `SalesReport.tsx` — revenue line chart
- [x] `PipelineReport.tsx` — deals comparison bar chart
- [x] `ActivityReport.tsx` — activities by type
- [x] Replace `(app)/reports/page.tsx`

## 4. Settings Page (replace placeholder)
- [x] `GeneralSettings.tsx` — org name, slug, timezone
- [x] `ProfileSettings.tsx` — user profile + password
- [x] `IntegrationSettings.tsx` — connected services
- [x] `NotificationSettings.tsx` — toggle preferences
- [x] Replace `(app)/settings/page.tsx` with tabbed UI

## 5. Toast Notification System
- [x] `Toast.tsx` + `toastStore.ts`
- [x] Wired into app layout

## 6. Onboarding
- [x] `OnboardingWizard.tsx`
- [x] `ProductTour.tsx` (Driver.js)
- [x] `SampleDataLoader.tsx`

## 7. Compliance & Legal
- [x] `(app)/privacy/page.tsx`
- [x] `CookieConsent.tsx` — wired into layout

## 8. Verification
- [x] `pnpm build` succeeds ✅ (28 routes)
- [x] Browser smoke test — Dashboard, Reports, Settings ✅
