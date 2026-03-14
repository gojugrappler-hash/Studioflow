# Studioflow — CEO Setup Guide
> **Everything you need to sign up for to make Studioflow fully operational.**
> Think of this like setting up utilities for a new house — each service powers a different part of the app.

---

## Quick Summary

| # | Service | What It Powers | Cost | Time to Set Up | Priority |
|---|---|---|---|---|---|
| 1 | **Supabase** | Database, logins, file storage | Free | 10 min | 🔴 REQUIRED |
| 2 | **Vercel** | Hosting (puts your app on the internet) | Free | 5 min | 🔴 REQUIRED |
| 3 | **Square** | Accepting payments from clients | Free (2.6% + 10¢/sale) | 10 min | 🟡 HIGH |
| 4 | **Resend** | Sending emails to clients | Free (3,000/mo) | 5 min | 🟡 HIGH |
| 5 | **Google Cloud** | Google Drive file storage + Calendar sync | Free | 20 min | 🟡 HIGH |
| 6 | **Google Gemini** | AI features (email writing, captions) | Free | 5 min | 🟢 MEDIUM |
| 7 | **Sentry** | Automatic error alerts (if something breaks) | Free | 5 min | 🟢 MEDIUM |
| 8 | **Tawk.to** | Live chat widget on your site | Free | 5 min | 🟢 LOW |
| 9 | **Firebase** | Push notifications to phones | Free | 15 min | 🟢 LOW |
| 10 | **Custom Domain** | YourStudio.com (instead of random Vercel URL) | ~$12/yr | 10 min | 🟢 LOW |

**Total Monthly Cost: $0** (unless you process payments, then Square takes 2.6% + 10¢ per online transaction)

---

## 1. 🔴 Supabase (Your Database)

### What is it?
Think of Supabase as the **filing cabinet** for your entire business. Every contact, every invoice, every appointment — it all lives here. It also handles user logins.

### How to sign up:
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** (green button)
3. Sign in with your **GitHub account** (if you don't have one, create one at [github.com](https://github.com) first — it's free and takes 2 minutes)
4. Click **"New Project"**
5. Fill in:
   - **Name:** `studioflow`
   - **Database Password:** Pick something strong and **SAVE IT** somewhere safe (you'll need it later)
   - **Region:** Pick the closest one to you (probably `US East`)
6. Click **"Create new project"** and wait ~2 minutes

### What to give the developer:
After your project is created, go to **Settings → API** and copy these two values:
- **Project URL** — looks like `https://xyzxyz.supabase.co`
- **anon/public key** — a long string starting with `eyJ...`

> 💡 **These go into the app as:**
> `NEXT_PUBLIC_SUPABASE_URL=https://xyzxyz.supabase.co`
> `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`

### Free tier limits:
- 500 MB database storage (plenty for thousands of contacts)
- 1 GB file storage
- 50,000 monthly active users
- Unlimited API requests

---

## 2. 🔴 Vercel (Your Hosting)

### What is it?
Vercel is like **renting a storefront** — it puts your app on the internet so anyone with the link can use it.

### How to sign up:
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"**
3. Sign in with your **GitHub account** (same one from Step 1)
4. That's it! You now have a Vercel account

### How to deploy:
Your developer will connect the GitHub repo to Vercel. Once connected:
- Every time code is updated, the app automatically re-deploys
- You get a free URL like `studioflow-abc123.vercel.app`
- Later you can add a custom domain (see Step 10)

### Free tier limits:
- 100 GB bandwidth per month
- Automatic SSL (the padlock icon in browsers)
- Unlimited deployments

---

## 3. 🟡 Square (Payments)

### What is it?
Square lets your **clients pay you** directly through the app. When you send an invoice, they click "Pay Now" and enter their card. Money goes straight to your bank account. If you already use Square at your studio, this connects right to that same account!

### How to sign up:
1. Go to **[squareup.com](https://squareup.com)** (you probably already have an account!)
2. If you don't have one, click **"Get Started"** and follow the prompts
3. Once logged in, go to **[developer.squareup.com](https://developer.squareup.com)**
4. Click **"+"** to create a new application
5. Name it `Studioflow` and click **"Save"**
6. You'll see your **Application ID** on the app dashboard
7. Go to the **"Credentials"** tab:
   - Copy the **Access Token** (use Sandbox first for testing, then switch to Production)
8. Go to the **"Webhooks"** tab:
   - Click **"Add webhook"**
   - URL: `https://your-app-url.com/api/v1/webhooks/square`
   - Events: select `payment.completed` and `refund.created`
   - Copy the **Signature Key**

### What to give the developer:
- **Access Token** — starts with `EAAAl...` (NEVER share this publicly!)
- **Webhook Signature Key** — used to verify incoming notifications

> 💡 **These go into the app as:**
> `SQUARE_ACCESS_TOKEN=EAAAl...`
> `SQUARE_ENVIRONMENT=production`
> `SQUARE_WEBHOOK_SIGNATURE_KEY=your-signature-key`

### Cost:
- No monthly fee
- **2.6% + 10¢ per online transaction** (cheaper than Stripe!)
- Example: Client pays $500 → you pay $13.10 in fees → you keep $486.90
- If you already use Square for in-person payments, those rates stay the same

---

## 4. 🟡 Resend (Email Sending)

### What is it?
Resend is the **mailman** for your app. It sends emails like invoice notifications, appointment reminders, and marketing campaigns *from your business email address*.

### How to sign up:
1. Go to **[resend.com](https://resend.com)**
2. Click **"Get Started"**
3. Sign up with your email
4. Go to **API Keys** → Click **"Create API Key"**
5. Name it `studioflow` and copy the key

### What to give the developer:
- **API Key** — starts with `re_...`

> 💡 **This goes into the app as:**
> `RESEND_API_KEY=re_...`

### Optional but recommended:
To send emails FROM your own domain (like `hello@yourstudio.com` instead of `onboarding@resend.dev`):
1. In Resend, go to **Domains** → **Add Domain**
2. Enter your domain (e.g., `yourstudio.com`)
3. Add the **DNS records** they give you to your domain registrar
4. Wait for verification (usually 5-30 minutes)

### Free tier limits:
- 3,000 emails per month
- 100 emails per day
- 1 custom domain

---

## 5. 🟡 Google Cloud (Drive + Calendar)

### What is it?
This powers two features:
- **Google Drive:** Automatically creates folders for each client, stores contracts/images
- **Google Calendar:** Syncs your appointments between Studioflow and Google Calendar

### How to sign up:
1. Go to **[console.cloud.google.com](https://console.cloud.google.com)**
2. Sign in with a **Google account** (your Gmail works fine)
3. Click **"Select a Project"** → **"New Project"**
4. Name: `Studioflow` → Click **"Create"**
5. Now enable the APIs you need:
   - Search for **"Google Drive API"** → Click **Enable**
   - Search for **"Google Calendar API"** → Click **Enable**
6. Create credentials:
   - Go to **APIs & Services → Credentials**
   - Click **"Create Credentials" → "OAuth Client ID"**
   - You may need to **configure the consent screen** first:
     - User Type: **External**
     - App name: `Studioflow`
     - Support email: your email
     - Authorized domains: your app's domain
   - Application type: **Web application**
   - Name: `Studioflow Web`
   - Authorized redirect URIs: `https://your-app-url.com/api/v1/auth/google/callback`
   - Click **Create** and copy the **Client ID** and **Client Secret**

### What to give the developer:
- **Client ID** — looks like `123456-abcdef.apps.googleusercontent.com`
- **Client Secret** — a shorter string

> 💡 **These go into the app as:**
> `GOOGLE_CLIENT_ID=123456-abcdef.apps.googleusercontent.com`
> `GOOGLE_CLIENT_SECRET=GOCSPX-...`

### Cost:
- Completely free for the APIs we use

---

## 6. 🟢 Google Gemini (AI Features)

### What is it?
Gemini is Google's AI that powers smart features in the app — like **writing email drafts**, **generating social media captions**, and **scoring leads** (guessing which contacts are most likely to buy).

### How to sign up:
1. Go to **[aistudio.google.com](https://aistudio.google.com)**
2. Sign in with your Google account
3. Click **"Get API Key"** (in the left sidebar)
4. Click **"Create API Key"**
5. Select your Google Cloud project (the `Studioflow` one from Step 5, or create a new one)
6. Copy the API key

### What to give the developer:
- **API Key** — a long string

> 💡 **This goes into the app as:**
> `GEMINI_API_KEY=AIza...`

### Free tier limits:
- 15 requests per minute
- 1 million tokens per day (that's a LOT of text — you won't hit this)

---

## 7. 🟢 Sentry (Error Tracking)

### What is it?
Sentry is like a **security camera for bugs**. If something breaks in the app, Sentry automatically catches it and sends you an alert with details about what went wrong. Super helpful for fixing bugs before customers complain.

### How to sign up:
1. Go to **[sentry.io](https://sentry.io)**
2. Click **"Start for Free"**
3. Sign up with GitHub, Google, or email
4. Create a new project:
   - Platform: **Next.js**
   - Project name: `studioflow`
5. Copy the **DSN** (Data Source Name) — it's on the setup page

### What to give the developer:
- **DSN** — looks like `https://abc123@o456.ingest.sentry.io/789`

> �� **This goes into the app as:**
> `SENTRY_DSN=https://abc123@o456.ingest.sentry.io/789`

### Free tier limits:
- 5,000 errors per month
- 10,000 performance transactions per month
- 1 GB of attachments

---

## 8. 🟢 Tawk.to (Live Chat)

### What is it?
Tawk.to adds a **little chat bubble** to the bottom-right corner of your app. Visitors and clients can click it to chat with you in real-time. You can reply from the Tawk.to app on your phone or desktop.

### How to sign up:
1. Go to **[tawk.to](https://www.tawk.to)**
2. Click **"Sign Up Free"**
3. Fill in your info
4. It creates a default "property" (your chat widget)
5. Go to **Administration → Chat Widget**
6. You'll see your **Property ID** and **Widget ID** in the embed code URL:
   `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`

### What to give the developer:
- **Property ID** — a hex string like `64a1b2c3d4e5f6`
- **Widget ID** — usually `1h...` or similar

> 💡 **These go into the app as:**
> `NEXT_PUBLIC_TAWKTO_PROPERTY_ID=64a1b2c3d4e5f6`
> `NEXT_PUBLIC_TAWKTO_WIDGET_ID=1h...`

### Cost:
- Completely free, unlimited agents, unlimited chats

---

## 9. 🟢 Firebase (Push Notifications)

### What is it?
Firebase lets the app **send push notifications** to your phone or desktop — like "New appointment booked!" or "Invoice #42 was paid!" — even when you're not looking at the app.

### How to sign up:
1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
2. Sign in with your Google account
3. Click **"Add project"** → Name: `Studioflow`
4. Disable Google Analytics (not needed) → Click **"Create project"**
5. After creation, go to **Project Settings** (gear icon) → **Cloud Messaging** tab
6. If you see "Cloud Messaging API (Legacy)" — click the three dots → **Enable**
7. Copy the **Server key**

### What to give the developer:
- **Server Key** — a very long string

> 💡 **This goes into the app as:**
> `FIREBASE_SERVER_KEY=AAAA...`

### Cost:
- Completely free for Cloud Messaging (unlimited notifications)

---

## 10. 🟢 Custom Domain (Optional)

### What is it?
Instead of your app living at `studioflow-abc123.vercel.app`, you can use your own domain like `app.yourstudio.com` or `crm.yourstudio.com`.

### How to set up:
1. **Buy a domain** if you don't have one:
   - [Namecheap](https://namecheap.com) — ~$10-12/year
   - [Google Domains](https://domains.google.com) — ~$12/year
   - [GoDaddy](https://godaddy.com) — ~$10-20/year
2. In **Vercel**, go to your project → **Settings → Domains**
3. Type your domain (e.g., `app.yourstudio.com`) → Click **Add**
4. Vercel will give you **DNS records** to add
5. In your domain registrar (Namecheap, etc.), add those records
6. Wait 5-30 minutes for DNS to update
7. ✅ Done! Your app is now at your custom domain with free SSL

---

## Master Checklist

Print this out and check off each one as you go:

```
[ ] 1. Supabase — Created project, copied URL + Anon Key
[ ] 2. Vercel — Signed up, connected to GitHub
[ ] 3. Square — Created dev app, copied Access Token + Webhook Signature Key
[ ] 4. Resend — Created account, copied API Key
[ ] 5. Google Cloud — Enabled Drive + Calendar APIs, created OAuth credentials
[ ] 6. Gemini — Created API key
[ ] 7. Sentry — Created project, copied DSN
[ ] 8. Tawk.to — Created account, copied Property ID + Widget ID
[ ] 9. Firebase — Created project, copied Server Key
[ ] 10. Custom Domain — Bought domain, connected to Vercel
```

---

## All Environment Variables (Give These to Your Developer)

Once you've signed up for everything, your developer needs these values. Copy this template and fill in each one:

```env
# 🔴 REQUIRED
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 🟡 HIGH PRIORITY
SQUARE_ACCESS_TOKEN=EAAAl...
SQUARE_ENVIRONMENT=production
SQUARE_WEBHOOK_SIGNATURE_KEY=your-signature-key
RESEND_API_KEY=re_...
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# 🟢 NICE TO HAVE
GEMINI_API_KEY=AIza...
SENTRY_DSN=https://abc@o123.ingest.sentry.io/456
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=64a1b2c3d4e5f6
NEXT_PUBLIC_TAWKTO_WIDGET_ID=1h...
FIREBASE_SERVER_KEY=AAAA...

# 🟢 AFTER DEPLOYMENT
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

---

> **Questions?** Just ask! None of this is scary — it's all free sign-ups with big "Create Account" buttons. The whole process takes about 60-90 minutes if you do everything in one sitting. ☕
