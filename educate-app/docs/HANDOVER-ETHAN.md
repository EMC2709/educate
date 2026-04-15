# Educate — Handover to Ethan

## Current State (15 April 2026)

- **GitHub**: `EMC2709/educate` — fully synced, all commits from both of us merged
- **Past papers scrape**: 14,747 / 26,231 (56%) complete — needs ~$3 more API credits to finish
- **Database**: Neon (PostgreSQL) with profiles, questions, past_papers, game_sessions, assignments, classes tables
- **Auth**: Clerk — test accounts exist (Test Teacher + Test Student)
- **Live URL**: `educate-app-zeta.vercel.app` (Paul's Vercel)

---

## 1. Vercel Setup

Your Vercel project needs to use the **same env vars** as Paul's so you share one database, one Clerk auth, and one set of API keys.

### Required env vars for your Vercel project

Go to **Vercel Dashboard > Your educate project > Settings > Environment Variables** and set these:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | *(get from Paul — this is the Neon connection string with all 14,747 scraped papers)* |
| `ANTHROPIC_API_KEY` | *(your own key from console.anthropic.com — needs credits)* |
| `CLERK_SECRET_KEY` | *(get from Paul — same Clerk app)* |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | *(get from Paul — same Clerk app)* |
| `GOOGLE_DRIVE_API_KEY` | *(get from Paul — for past papers Drive access)* |

**Important**: If you use a different `DATABASE_URL`, you'll get a blank database with no papers, no profiles, and Test Teacher will show as "Student".

### Connect GitHub for auto-deploy

1. Vercel Dashboard > Your project > Settings > Git
2. Connect to `EMC2709/educate`
3. Set **Root Directory** to `educate-app`
4. Framework: Next.js (auto-detected)
5. Every push to `master` will auto-deploy

---

## 2. Finish the Past Papers Scrape

The scrape stopped at 56% because Anthropic API credits ran out.

### Top up credits
1. Go to **console.anthropic.com** > Billing > Add credits
2. Add $3-5 (enough to finish the remaining ~11,500 papers)
3. Make sure the API key in your `.env.local` matches this workspace

### Run the scrape
```bash
cd educate-app
npx tsx scripts/process-past-papers.ts --concurrency 3
```

- It automatically skips papers already processed (papers with questions > 0)
- Papers with 0 questions (mark schemes, data sheets, etc.) get re-examined
- Takes a few hours to complete
- Uses 3-tier extraction: pdf-parse > Google Drive OCR > Claude Vision

### Check progress
```bash
npx tsx scripts/check-progress.ts
```

### Local `.env.local` for running scripts
Create `educate-app/.env.local` with:
```
DATABASE_URL="postgresql://..."
ANTHROPIC_API_KEY="sk-ant-api03-..."
GOOGLE_DRIVE_API_KEY="AIza..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

---

## 3. Test Accounts

| Account | Role | Org |
|---------|------|-----|
| Test Teacher | `teacher` | Linked to test org |
| Test Student | `student` | Independent |

These exist in the **shared Neon database**. If you use a different DB, you'll need to recreate them.

---

## 4. Key Architecture

```
educate/
  educate-app/           # Next.js 16 app (App Router)
    src/
      app/               # Pages & API routes
        api/             # 19 API routes (chat, check, generate, profile, etc.)
        teacher/         # Teacher dashboard (role-gated)
        student/         # School student dashboard
        admin/           # Super admin panel
      components/        # React components
      lib/               # DB, auth, XP, rate limiting
    scripts/             # Past papers scraper, seed scripts
```

### Role routing (src/app/page.tsx)
- `teacher` / `school_admin` / `super_admin` → redirects to `/teacher`
- `student` with `org_id` → redirects to `/student`
- `student` without `org_id` → shows independent student dashboard
- Not signed in → guest view with exam board cards

### Tech stack
- **Framework**: Next.js 16 (App Router, Server Components)
- **Auth**: Clerk
- **DB**: Neon (serverless PostgreSQL)
- **AI**: Anthropic Claude (Haiku for paper extraction, Sonnet for chat)
- **Hosting**: Vercel

---

## 5. Security Audit Findings (Priority)

A full security audit was completed. Key items to address:

### Critical
1. **Middleware only protects 3/19 API routes** — rewrite `src/middleware.ts` to protect all `/api/` by default
2. **`/api/check` has no rate limiting** — add auth + rate limit in the handler
3. **Google OAuth callback has no CSRF verification** — add signed state token to `src/app/api/classroom/callback/route.ts`

### High
4. Teacher/admin layouts use client-side role checks (bypassable) — convert to server-side `redirect()`
5. Game session PATCH has no player ownership check (any user can overwrite any game)
6. Mermaid SVG + KaTeX output injected without sanitization — add DOMPurify
7. Update deps: `npm install next@16.2.3 @anthropic-ai/sdk@0.88.0 && npm audit fix`

### Medium
8. No CSP / security headers in `next.config.ts`
9. Rate limiter is in-memory (resets on serverless cold start) — needs Redis
10. Privacy policy says Supabase but app uses Neon — update the legal text

Full report available in the Claude Code session history.

---

## 6. Build & Deploy

```bash
# Install deps
cd educate-app && npm install

# Run dev server
npm run dev

# Build (check for errors)
npm run build

# Manual deploy to Vercel
npx vercel --prod

# Run tests
npm test

# Run lint
npm run lint
```

---

## 7. Useful Commands

```bash
# Check past papers progress
npx tsx scripts/check-progress.ts

# Seed test users (if using fresh DB)
npx tsx scripts/seed-test-users.ts

# Process past papers (resume from where it stopped)
npx tsx scripts/process-past-papers.ts --concurrency 3

# Process limited batch (for testing)
npx tsx scripts/process-past-papers.ts --limit 20 --concurrency 2
```

---

## Contact

Any questions, check the GitHub issues or ping Paul.
