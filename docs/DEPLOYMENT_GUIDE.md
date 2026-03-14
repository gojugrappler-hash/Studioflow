# Studioflow — Deployment Day Checklist 🚀
> **Work through this together. Each step takes 2-5 minutes. Total time: ~30 minutes.**
> CEO does the clicking, Developer says what to click.

---

## Before You Start — What You Need Open

- [ ] This checklist (print it or have it on a second screen)
- [ ] Your **Supabase** dashboard (already set up ✅)
- [ ] A browser logged into **GitHub** (the CEO's account OR the developer's)

---

## Step 1: Connect GitHub to Vercel (5 min)

> **What this does:** Vercel is the service that puts your app on the internet. We're telling it "grab the code from GitHub and run it."

1. Go to **[vercel.com/signup](https://vercel.com/signup)**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. You'll land on the Vercel dashboard

**✅ Checkpoint:** You see the Vercel dashboard with "No projects yet"

---

## Step 2: Import the Studioflow Repo (3 min)

1. Click **"Add New…" → "Project"**
2. Find **"Studioflow"** in the repo list and click **"Import"**
   - If you don't see it, click "Adjust GitHub App Permissions" and grant access to the repo
3. **Project Name:** Leave as `studioflow`
4. **Framework Preset:** Should auto-detect "Next.js" — if not, select it
5. **Root Directory:** Leave empty (`.`)
6. **⚠️ DON'T CLICK DEPLOY YET** — we need to add environment variables first!

**✅ Checkpoint:** You see the "Configure Project" screen with a "Deploy" button

---

## Step 3: Add Environment Variables (5 min)

> **What this does:** These are the secret keys that connect your app to the database and services.

Still on the "Configure Project" screen, scroll down to **"Environment Variables"** and add each one:

### 🔴 Required (app won't work without these)

| Name | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → **anon / public key** |

### How to add each variable:
1. Type the **Name** in the left box (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. Paste the **Value** in the right box
3. Make sure **all three environments are checked** (Production, Preview, Development)
4. Click **"Add"**
5. Repeat for the next variable

### 🟡 Add these IF the CEO has them ready (skip if not yet)

| Name | Where to find it |
|---|---|
| `SQUARE_ACCESS_TOKEN` | Square Developer → Your App → Credentials → Access Token |
| `SQUARE_ENVIRONMENT` | Type: `production` (or `sandbox` for testing) |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square Developer → Your App → Webhooks → Signature Key |
| `RESEND_API_KEY` | Resend → API Keys → your key |
| `GEMINI_API_KEY` | Google AI Studio → API Keys → your key |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials → OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials → Client Secret |
| `SENTRY_DSN` | Sentry → Project → Settings → Client Keys → DSN |
| `NEXT_PUBLIC_TAWKTO_PROPERTY_ID` | Tawk.to → Admin → Chat Widget → Property ID |
| `NEXT_PUBLIC_TAWKTO_WIDGET_ID` | Tawk.to → Admin → Chat Widget → Widget ID |
| `FIREBASE_SERVER_KEY` | Firebase → Project Settings → Cloud Messaging → Server Key |

> 💡 **It's OK to skip the yellow ones for now.** The app works without them — those features just won't be active yet. You can add them later in Vercel → Settings → Environment Variables.

**✅ Checkpoint:** You see at least 2 environment variables added (the Supabase ones)

---

## Step 4: Deploy! (3 min)

1. Click **"Deploy"** 🎉
2. Wait 1-2 minutes while it builds
3. You'll see a build log scrolling — look for:
   - `✓ Compiled successfully`
   - `40 routes`
4. When it says **"Congratulations!"** — your app is LIVE!

**✅ Checkpoint:** You see a preview of your deployed app with a URL like `studioflow-xxxxx.vercel.app`

---

## Step 5: Test It (5 min)

1. Click the **preview link** to open your app
2. You should see the **login page**
3. Click **"Sign Up"** and create a test account
4. After signup, you should land on the **empty dashboard**
5. Try these quick checks:
   - [ ] Can you see the sidebar nav?
   - [ ] Can you click through to Contacts, Pipeline, Calendar?
   - [ ] Does the "Need Help?" button appear (bottom right)?
   - [ ] Can you access `/admin` in the URL bar?

**✅ Checkpoint:** All pages load, no error screens

---

## Step 6: Set Up Square Webhook URL (2 min)

> **Only do this if Square is configured.**

1. Go to **[developer.squareup.com](https://developer.squareup.com)**
2. Open your **Studioflow** application
3. Go to **Webhooks** tab
4. Edit (or add) the webhook and change the URL to:
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/v1/webhooks/square
   ```
   (Replace `YOUR-VERCEL-URL` with your actual Vercel URL from Step 4)
5. Click **Save**

**✅ Checkpoint:** Webhook URL points to your live app

---

## Step 7: Custom Domain (Optional, 5 min)

> **Skip this if you're fine with the Vercel URL for now.**

1. In **Vercel**, go to your project → **Settings → Domains**
2. Type your domain (e.g., `app.yourstudio.com`) → Click **"Add"**
3. Vercel will show you **DNS records** to add
4. Go to your **domain registrar** (Namecheap, GoDaddy, etc.)
5. Add the DNS records Vercel gave you
6. Wait 5-30 minutes for DNS to propagate
7. Back in Vercel, the domain should show ✅

**✅ Checkpoint:** Your custom domain loads the app with the padlock icon (SSL)

---

## Step 8: Invite Your First User (2 min)

1. Send the URL to your first user (wife or friend)
2. Have them go to the URL and click **"Sign Up"**
3. They'll create their own account and organization
4. They should see an empty, clean dashboard ready to use!

**✅ Checkpoint:** Your user can log in and see their dashboard

---

## After Deployment — Adding More API Keys Later

When the CEO gets more API keys (Square, Resend, Google, etc.):

1. Go to **[vercel.com](https://vercel.com)** → your Studioflow project
2. Click **Settings → Environment Variables**
3. Add the new variable (Name + Value)
4. Click **Save**
5. Go to **Deployments** → click the three dots on the latest → **"Redeploy"**
6. Wait 1-2 minutes
7. The new feature is now active!

> 💡 **You do NOT need the developer for this!** Adding env vars and redeploying is something the CEO can do anytime.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with "Missing env" | Go to Settings → Environment Variables and make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set |
| "Page not found" | Make sure the URL is correct and the build succeeded |
| Login doesn't work | Check that the Supabase URL and key are correct in env vars |
| Square payments not working | Add `SQUARE_ACCESS_TOKEN` + `SQUARE_ENVIRONMENT` in env vars and redeploy |
| Can't receive emails | Add `RESEND_API_KEY` in env vars and redeploy |

---

## Summary

| Step | What | Time | Who Clicks |
|---|---|---|---|
| 1 | Sign up for Vercel with GitHub | 5 min | CEO |
| 2 | Import Studioflow repo | 3 min | CEO |
| 3 | Add Supabase env vars | 5 min | CEO (dev reads values) |
| 4 | Click Deploy | 3 min | CEO |
| 5 | Test signup + pages | 5 min | Both |
| 6 | Set Square webhook URL | 2 min | CEO |
| 7 | Custom domain (optional) | 5 min | CEO |
| 8 | Invite first user | 2 min | CEO |
| **Total** | | **~30 min** | |

---

> **You got this!** ☕ It's literally clicking buttons and pasting values. The hardest part (building the app) is already done.
