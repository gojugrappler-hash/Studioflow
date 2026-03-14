# Phase 5: Social Media & Marketing

Build the social media management, campaign tracking, and lead capture system for Studioflow. This phase adds multi-platform post scheduling with a content calendar, email campaigns, and an embeddable form builder — all following established Phases 2-4 patterns.

## User Review Required

> [!IMPORTANT]
> **Social platform OAuth requires real API keys** (Instagram, Facebook, TikTok, X, LinkedIn, Pinterest). This plan builds the full UI and data layer with a **"connection-ready"** architecture — the social account management and post composer are fully functional for manual scheduling/tracking, and the actual API publishing will activate when platform OAuth credentials are added later.

> [!WARNING]
> **Scope note**: Landing Pages (AI page generator) are listed in Phase 5 but depend heavily on Phase 6's Gemini AI integration. This plan builds the **database + basic page editor** now, with AI generation deferred to Phase 6. Similarly, the AI caption generator UI will be built but will use placeholder logic until Gemini is connected.

---

## Proposed Changes

### Database Layer

#### [NEW] [20260313_005_phase5_schema.sql](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/supabase/migrations/20260313_005_phase5_schema.sql)

| Table | Purpose | Key Columns |
|---|---|---|
| `social_accounts` | Connected platform accounts | `platform` (instagram/facebook/tiktok/x/linkedin/pinterest), `account_name`, `access_token` (encrypted), `is_connected` |
| `social_posts` | Scheduled/published posts | `social_account_id`, `content`, `media_urls` JSONB, `scheduled_for`, `published_at`, `status` (draft/scheduled/published/failed), `platform_post_id` |
| `campaigns` | Email/marketing campaigns | `name`, `type` (email/social/mixed), `status` (draft/active/paused/completed), `start_date`, `end_date`, `budget`, `utm_source/medium/campaign` |
| `campaign_contacts` | Contacts enrolled in campaigns | `campaign_id`, `contact_id`, `status` (enrolled/sent/opened/clicked/converted/unsubscribed) |
| `forms` | Embeddable lead capture forms | `name`, `slug`, `fields` JSONB, `redirect_url`, `is_active`, `submission_count` |
| `form_submissions` | Submitted form data | `form_id`, `data` JSONB, `contact_id` (auto-created), `ip_address`, `source_url` |

All tables: `org_id` FK, soft delete, RLS org-isolation.

---

### TypeScript Types

#### [MODIFY] [database.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/types/database.ts)

Add: `SocialPlatform`, `PostStatus`, `CampaignType`, `CampaignStatus`, `CampaignContactStatus`, `SocialAccount`, `SocialPost`, `Campaign`, `CampaignContact`, `Form`, `FormField`, `FormSubmission`.

---

### Hooks

#### [NEW] [useSocialAccounts.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/hooks/useSocialAccounts.ts)

`fetchAccounts()`, `connectAccount(platform, data)`, `disconnectAccount(id)` — manages linked social platform accounts.

#### [NEW] [useSocialPosts.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/hooks/useSocialPosts.ts)

`fetchPosts(filters?)`, `createPost(data)`, `updatePost()`, `deletePost()`, `schedulePost(id, datetime)`, `publishPost(id)` — post CRUD with scheduling.

#### [NEW] [useCampaigns.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/hooks/useCampaigns.ts)

`fetchCampaigns()`, `fetchCampaign(id)` (with enrolled contacts), `createCampaign()`, `updateCampaign()`, `enrollContacts()`, `removeCampaignContact()`.

#### [NEW] [useForms.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/hooks/useForms.ts)

`fetchForms()`, `fetchForm(id)` (with submissions), `createForm()`, `updateForm()`, `deleteForm()`, `fetchSubmissions(formId)`.

---

### Components

#### [NEW] `src/components/social/` directory

| Component | Description |
|---|---|
| `PlatformBadge.tsx` | Platform icon + color-coded pill (Instagram pink, TikTok cyan, etc.) per §4.6 colors |
| `AccountCard.tsx` | Connected account card with platform icon, account name, connected/disconnected status, disconnect button |
| `PostComposer.tsx` | Multi-platform post creator: platform selector, content textarea with char count, media upload area, schedule datetime picker, AI caption button (stub) |
| `ContentCalendar.tsx` | Monthly calendar grid with posts shown as colored dots per platform; click day to view/add posts. View toggle: Month / Week / List |
| `PostCard.tsx` | Scheduled/published post card: platform badge, content preview, scheduled time, status |

#### [NEW] `src/components/campaigns/` directory

| Component | Description |
|---|---|
| `CampaignCard.tsx` | Campaign card: name, type badge, date range, enrolled count, status, progress bar |
| `CampaignDetail.tsx` | Full campaign view: stats (sent/opened/clicked), enrolled contacts list, UTM info |
| `CampaignForm.tsx` | Slide-over: name, type, dates, budget, UTM fields, contact enrollment |

#### [NEW] `src/components/forms/` directory

| Component | Description |
|---|---|
| `FormCard.tsx` | Form card: name, field count, submission count, active toggle, embed code copy |
| `FormBuilder.tsx` | Drag-and-drop field builder: add text/email/phone/select/textarea fields, reorder, set required, set labels |
| `FormPreview.tsx` | Live preview of the form as it would appear embedded |

---

### Pages

#### [MODIFY] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/social/page.tsx)

Replace placeholder → full social media hub: tabs (Calendar / Posts / Accounts), PostComposer trigger, ContentCalendar, PostCard list, AccountCard grid.

#### [MODIFY] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(app)/campaigns/page.tsx)

Replace placeholder → campaigns dashboard: tabs (Campaigns / Forms), CampaignCard list, FormCard grid with builder.

#### [NEW] [page.tsx](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/(public)/f/[slug]/page.tsx)

Public form submission route — renders form by slug, handles submission, creates contact in Supabase (no auth required).

#### [NEW] [route.ts](file:///c:/Users/Campk/.gemini/antigravity/brain/8327bd9e-8479-46fd-82ab-44d98ebc7311/studioflow/src/app/api/v1/forms/submit/route.ts)

POST endpoint for form submissions: validates data, creates `form_submissions` record, optionally auto-creates a contact.

---

## Verification Plan

### Automated Tests
1. `pnpm build` — must pass with zero errors and compile all new routes

### Browser Verification
1. `/social` — calendar renders, tabs work, account cards show empty state
2. `/campaigns` — campaigns + forms tabs work, empty states render
3. Post composer slide-over opens with platform selector and content fields
4. Form builder allows adding/reordering fields
5. Screenshots for walkthrough
