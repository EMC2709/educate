@AGENTS.md

# Educate: GCSE Revision Platform

> Last reviewed: 15 Nov 2026. This file is the source of truth for AI coding sessions. Keep it current.
> For the 11-15 Nov session state (Drive PDFs, review findings, AI marking, Sonnet 5.5 move, school AI switch, paper clean-up, platform details, next steps), see `docs/HANDOVER-PAUL-2026-11-12.md`.
> **Never put secret values (keys, connection strings, passwords) in this file or any committed file.**

## What this project is
An AI-assisted GCSE revision web app for UK students, with teacher, school and parent features.
- Covers the 4 UK exam boards (AQA, Edexcel, OCR, WJEC) and 26 GCSE subjects.
- Has about 1,580 curated questions **built into the code** (`src/data/`), so guest quizzes need no DB and no AI.
- Signed-in features: AI tutor chat, AI answer marking, AI question, study-tool and revision-note generation, XP, levels, coins and banners, achievements, streaks, friends and leaderboards, multiplayer games, personal and shared flashcard decks, mastery pathways, diagnosis, timetable and exam countdown, progress tracking.
- School features: organisations, classes with join codes, assignments with progress, Google Classroom sync, and a parent read-only link.

## Actual stack (ignore older docs that say Auth.js or Supabase)
- **Next.js 16.2.1** (App Router, Turbopack, React 19.2). See AGENTS.md: APIs differ from older Next. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.
  - `params` and `searchParams` are Promises; unwrap them with `use()` or `await`.
  - Middleware lives in **`src/proxy.ts`** (the Next 16 "proxy" convention, which replaces `middleware.ts`).
- **Auth: Clerk** (`@clerk/nextjs` v7). Sign-in UI is at `/login`. Roles are NOT stored in Clerk; they live in the DB (`profiles.role`).
- **DB: Neon serverless Postgres** via `@neondatabase/serverless`.
  - It uses tagged-template SQL (`sql\`...\``) from `src/lib/db.ts`, which is a lazy proxy that throws if `DATABASE_URL` is missing.
  - There is no ORM and no migration framework.
  - `src/lib/supabase.ts` and `supabase-schema-game.sql` are legacy; don't use them.
- **AI: Anthropic.** It uses `@anthropic-ai/sdk` (`src/lib/anthropic.ts`) and the Vercel AI SDK (`ai` and `@ai-sdk/anthropic`) for streaming chat. Calls are server-side only.
- **Styling:** Tailwind CSS v4.
- **Content rendering:** KaTeX (maths) and Mermaid (diagrams) via `components/ui/MessageContent`.
- **PDFs:** `pdfjs-dist`, `@napi-rs/canvas`, `pdf-parse` (past-paper rendering). `googleapis` handles Drive and Classroom.
  - pdfjs loads its worker by a runtime path that Vercel's file tracing can't see. `next.config.ts` ships `pdf.worker.mjs` via `outputFileTracingIncludes` for `/api/paper-page` and `/api/paper-pagecount`, and `src/lib/pdf-render.ts` preloads it into `globalThis.pdfjsWorker`. Any new route that renders PDFs needs the same include, or it will 500 in production only.
- **Validation:** Zod v4.
- **Tests:** Vitest + jsdom.

### Current Anthropic model IDs (updated Nov 2026; the old IDs were retired and returned 404)
| Use | Model | Files |
|---|---|---|
| Answer marking, question generation, revision notes | `claude-haiku-4-5-20251001` | `api/check`, `api/generate`, `api/revision-notes` |
| Tutor chat, topic chat, study tools | `claude-sonnet-5-5` (`TUTOR_MODEL` in `lib/anthropic.ts`) | `api/chat`, `api/topic-chat`, `api/generate-study-tools` |
| Marking a whole past paper against its mark scheme | `claude-opus-5-5` | `lib/ai-paper-marking.ts` (called by `POST api/mark-scheme`) |
| Past-paper import: vision fallback / text extraction (maintenance script, not the app) | `claude-sonnet-5-5` (max_tokens 16,000, effort `low`) / `claude-haiku-4-5` | `scripts/process-past-papers.ts` (moved off Sonnet 4.5 on 15 Nov; not yet run on a real paper) |
| Prototype only (reference, not deployed) | Haiku 4.5 for flashcards, questions, marking; Sonnet 5.5 for chat | `../educate-v4.jsx` (moved off retired Sonnet 4 on 15 Nov) |

No file in the repo uses a retired model ID (checked 15 Nov 2026).

**Tutor chat, topic chat and study tools moved to `claude-sonnet-5-5` on 13 Nov 2026** (Sonnet 4.5 retires on 30 Nov 2026). Rules for that model:
- It thinks before answering, and the thinking counts towards `max_tokens`. Keep the limits well above the reply length (chat 4,000, topic chat 3,000, study tools 8,000) or replies get cut off or come back empty.
- All three run at `effort: 'low'`, the recommended level for chat. Change depth with effort; `thinking: {type: "disabled"}`, forced `tool_choice` and non-default `temperature` all return a 400.
- `api/chat` sends `sendReasoning: false`, so thinking never reaches the browser and is never sent back. Keep it that way: replaying thinking blocks after the system prompt changes (the student switches subject) can be rejected.
- Read replies by block type, never `content[0]`. `askTutorModel()` in `lib/anthropic.ts` does this for the two non-streaming routes and handles a declined (`refusal`) or cut-off reply.
- Each route logs token counts as `[chat] usage`, `[topic-chat] usage` or `[generate-study-tools] usage`.
- The three Haiku 4.5 routes are unchanged. Haiku 4.5 was not on the deprecation list when checked on 13 Nov 2026; `claude-haiku-5-5` is its successor when that changes.
- The `ANTHROPIC_API_KEY` in the local `.env.local` is invalid (401 on 13 Nov), so AI routes can only be tested on the deployed site until it is replaced.

To list the models available to the key: `GET https://api.anthropic.com/v1/models`.
`/api/check` falls back to deterministic marking if the AI call fails, so a broken model ID fails **silently**. Check the logs.

## Repo layout
```
educate/                         (git repo root; GitHub: EMC2709/educate, branch master)
  CLAUDE.md                      -> imports this file
  educate-app/                   <- THE APP (Vercel root)
    src/
      proxy.ts                   Clerk middleware + DB role checks for /admin, /api/admin, /teacher
      app/
        page.tsx                 Home: server auth() picks the landing page (signed out) or HomeDashboard (signed in; routes by role, see Roles)
        login/                   Clerk sign-in
        [board]/[subject]/...    Guest-friendly flow: topics -> quiz, papers, paper
        practice/, practice/diagnosis, mastery/..., notes, revision-notes, checklist,
        timetable, exams, timer, reference, quotes, progress, achievements, marketplace,
        games/(tic-tac-toe|battleships|relay|friends|leaderboard), my-flashcards,
        shared-flashcards, profile, onboarding, export, offline, privacy, terms
        student/...              School student dashboard (students with org_id)
        teacher/...              Teacher dashboard, classes, assignments
        admin/                   Super-admin panel
        parent/[token]           Parent read-only view
        api/                     ~50 route handlers (below)
      components/                layout, home, subjects, topics, quiz, flashcards, combined-science, ui
      context/                   ChatContext, ThemeContext, TimerContext
      data/                      question-bank/, subtopic-bank/, mcq-bank/, past-paper-bank/, quotes/,
                                 exam-boards.ts, subject-topics.ts, topic-map.ts, past-papers-index.ts ...
      lib/                       db, roles, anthropic, prompts, xp, streak, achievements, banners,
                                 spaced-repetition, rate-limit (in-memory), drive, pdf-render, past-paper-match, progress ...
      types/index.ts
    db/schema.sql                Consolidated DB schema (see Database)
    scripts/                     One-off maintenance scripts (past-paper scraper, migrations, seeds, audits)
    docs/HANDOVER-PAUL-2026-11-12.md  11-13 Nov 2026 session handover (what was done, platforms, open review items)
    docs/HANDOVER-ETHAN.md       April 2026 handover (partly stale: shared DB/Clerk refs, old URL)
    docs/help/                   Student and parent help guide: Educate-Help-Guide.pdf, built by build_help_guide.py (reportlab). Update the script and rebuild when button names change.
  educate-v4.jsx                 Original single-file prototype (reference only)
  *.md, *.pptx                   Market research, case study, pitch deck (not code)
```

### Key API routes (`src/app/api/*/route.ts`)
- **AI:**
  - `chat` (streaming tutor, needs auth)
  - `check` (marking; AI only when signed in, otherwise deterministic)
  - `generate`, `generate-study-tools`, `topic-chat`, `topic-summary`, `revision-notes`
- **Content:** `questions`, `past-papers` (list, `?resolve=1` lookup by subject/sitting/paper/tier, `?available=1` stored-paper codes), `mark-scheme` (GET: official AQA mark scheme for a stored paper as JSON, `format=pdf` or `page=N` PNG; POST: AI marking of a student's answers against it), `paper-pdf` (auth-only PDF stream), `paper-page` (auth-only PNG of one page), `paper-pagecount`, `download-paper` (official board-URL proxy only — not Drive)
  - All of these except `download-paper` require sign-in and must send `Cache-Control: private` (never `public` / `s-maxage`, or the CDN serves signed-in content to anyone).
  - `past-papers?id=`, `paper-pdf`, `paper-page`, `paper-pagecount` and `mark-scheme` GET call `canOpenPaper(userId, paperId)` (`src/lib/paper-access.ts`) after confirming the paper exists, and return `paperLimitResponse()` (403, `code: 'paper_limit'`) when it says no. A new route that serves a stored paper's content must do the same. `api/questions` (quizzes and `/practice`) is not limited.
  - `paper-pdf` and `mark-scheme` are the only routes allowed in an iframe (`X-Frame-Options: SAMEORIGIN` overrides in `next.config.ts`; everything else is `DENY`). Both also need the pdfjs worker in `outputFileTracingIncludes` if they render pages.
- **Gamification:** `award-xp`, `save-result`, `achievements`, `leaderboard`, `marketplace`, `marketplace/equip`, `friends`, `game`, `quiz-history`
- **Flashcards:** `flashcards/**`, `shared-flashcards/**` (including `clone`)
- **Users:** `profile`, `user-subjects`, `parent-link`, `parent/[token]`
- **School:**
  - `organisations`, `classes/**` (join, join-code, members, performance)
  - `assignments/**` (progress, unread)
  - `classroom/{auth,callback,courses,sync}` (Google OAuth)
- **Admin:** `admin/roles` (PATCH; super_admin only), `admin/organisations` (PATCH `{ orgId, licenceEndsOn }`: a school's licence; super_admin only), `admin/enquiries` (GET list, PATCH `{ id, handled }`; super_admin only)
- **Sales:** `school-enquiries` (POST; **public on purpose**, no sign-in: Zod-validated, 5 per hour per IP, hidden `website` honeypot field). The form is at `/schools`, linked from the landing page; enquiries are stored in `school_enquiries` and listed on `/admin`. Nothing is emailed, so check `/admin`.

## Roles and permissions
- `profiles.role` is one of `student` (default), `teacher`, `school_admin`, `super_admin`. Read it via `src/lib/roles.ts` (`getUserRole`, `requireRole`, `getUserOrg`).
- Home routing:
  - teacher, school_admin and super_admin go to `/teacher`
  - a student with `org_id` goes to `/student`
  - a student without an org gets the independent dashboard
  - a guest gets the landing page (`components/landing/`, since 15 Nov); its "Start revising, no account needed" button goes to the exam-board picker at `/boards`
  - `/` decides on the server (`auth()` in `src/app/page.tsx`); the signed-in routing above runs client-side in `components/home/HomeDashboard.tsx`. Clerk's session token lives about a minute, so a returning user's first request can look signed out: `SignedInRefresh` on the landing page calls `router.refresh()` once Clerk has renewed it. Don't remove it.
- `src/proxy.ts` only guards `/admin*`, `/api/admin*` (super_admin) and `/teacher*` (teacher+). **Every other API route must do its own `auth()` and role check.**
- **Granting super_admin, the only sanctioned way:**
  1. The user signs up and loads any signed-in page, which creates their `profiles` row.
  2. Take their Clerk user ID (`user_...`) from the Clerk dashboard.
  3. In the Neon SQL editor (project `educate`), run:
     `UPDATE profiles SET role = 'super_admin', updated_at = now() WHERE user_id = 'user_...';`
  4. After that, super_admins assign other roles via `/admin` (`PATCH /api/admin/roles`).
  5. `scripts/make-admin.mjs` does the same locally with `DATABASE_URL`.
- **School licences (15 Nov 2026): free vs paid.** `organisations.licence_ends_on` (DATE, inclusive, UK time; NULL = none). Students and teachers in a school whose licence is today or later get the **school tier**; everyone else, including students in an unlicensed school, gets the **free tier**; super_admins always get the school tier (`getAccessTier` in `src/lib/school-licence.ts`).
  - The numbers live in `src/lib/plan-limits.ts` (no DB code, so the landing page imports them): free = 5 tutor, 1 study, 5 answer marking, 1 question set, 0 whole-paper marking a day and `FREE_PAPER_LIMIT` = 2 stored past papers for good (`paper_opens` table); school = 40 / 10 / 60 / 10 / 2 a day and every paper.
  - Only a super_admin sets a licence, on `/admin` (date picker per school, "Save licence" / "Remove licence"). Any teacher can create a school, so never grant the school tier for being in an org. Schools pay by invoice; there is no card payment.
  - **NEVER add a route that lets a teacher or school_admin set their own school's licence.**
- **NEVER add a route that lets a user change their own role.** The old `/api/debug-role` (any signed-in user could POST to become super_admin) was deleted on 11 Nov 2026. Don't restore it.

## Database
- The schema is in **`db/schema.sql`** (20 tables, idempotent `IF NOT EXISTS`).
  - It was reconstructed from `scripts/schema-past-papers.sql`, `scripts/migrate-*.ts` and inline `CREATE/ALTER` statements in API routes.
  - Tables: profiles, organisations, classes, class_members, assignments, assignment_progress, past_papers, questions, quiz_results, user_subjects, user_flashcard_decks, user_flashcards, revision_notes, user_banners, friendships, game_sessions, teacher_google_tokens, ai_usage (daily AI allowance; added 15 Nov, see Conventions), paper_opens (the free papers each student without a licence has opened; added 15 Nov), school_enquiries (licence enquiries from `/schools`; added 15 Nov). `organisations.licence_ends_on` was added the same day (see Roles).
- Some routes still run `CREATE TABLE/ALTER TABLE IF NOT EXISTS` at request time (flashcards, friends, marketplace, save-result, parent-link, game, revision-notes, user-subjects). That's a known smell.
- **When you add a column or table, add it to `db/schema.sql` too.**
- **The local `.env.local` (April 2026) does NOT point at production.** Its `DATABASE_URL` is an old database (`ep-weathered-tree…`); production is `ep-little-rice…` (Neon project `shy-paper-14167641`). On 14 Nov a cleanup ran against the old one by mistake and was undone. For any script that reads or writes live data, `vercel env pull <scratch>/prod.env --environment=production --yes`, pass that file explicitly, print only the endpoint id, and delete the file afterwards. `scripts/cleanup-mark-schemes-v3.mjs` requires `--env` for this reason.
- Apply the schema with any Postgres client, or with a Node script using `@neondatabase/serverless` (HTTP, which works where port 5432 is blocked). Use `DATABASE_URL_UNPOOLED` for DDL when possible.

## Commands (run in `educate-app/`)
```bash
npm ci                 # install
npm run dev            # http://localhost:3000 (.claude/launch.json uses 3100)
npm run build          # next build (TypeScript errors are IGNORED, see below)
npm test               # vitest (10 files, 71 tests, passing on 15 Nov; includes past-paper-match.test.ts, question-text.test.ts, ai-quota.test.ts, paper-access.test.ts, api/school-enquiries/route.test.ts and app/page.test.tsx)
npx tsc --noEmit -p .  # real type check: currently 56 errors
vercel env pull .env.local   # pull dev env vars (needs Vercel CLI login + linked project)
```
**Caveat:** `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so the build passes despite 56 TS errors. Don't rely on `npm run build` as a type check; run `tsc --noEmit`. The errors are mostly TS7053/TS2339 from untyped Neon query results in API routes and `lib/xp.ts`.

## Environment variables (names only; see `.env.example`)
- **Set in Vercel (`educate`):**
  - `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED`, plus the other Neon/Postgres vars added by the Vercel–Neon integration
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - `ANTHROPIC_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (Production = https://educatethemasses.online)
  - `GOOGLE_CREDENTIALS_JSON` (Production only, sensitive; set 13 Nov 2026). It is the JSON key of service account `educate-pdf-reader@educate-492818.iam.gserviceaccount.com` (Google Cloud project `educate-492818`, Paul's account, no billing, no IAM roles). Required for `/api/paper-pdf`, `/api/paper-page` and `/api/paper-pagecount`.
    - `getDrive()` in `src/lib/drive.ts` detects `type: "service_account"` (or `client_email` + `private_key`) and does **not** need `GOOGLE_TOKEN_JSON`.
    - User-OAuth fallback still accepts `GOOGLE_CREDENTIALS_JSON` + `GOOGLE_TOKEN_JSON` (from `scripts/auth-drive.ts`).
    - Local copy of the key: `C:\Users\LAPTOP80\.secrets\educate-drive-sa.json` (outside git). Never print or commit it.
- **Not set yet:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Classroom OAuth).
- `GOOGLE_DRIVE_API_KEY`, mentioned in the old handover, is **not read by the app**.
- Drive folder `1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9` (PAPERS; owned by stuart.fosker@gmail.com; Paul is editor as paulmc18@gmail.com) is shared with that service account as **Viewer** and is otherwise Restricted. Do **not** set "anyone with the link". How to revoke or rotate: `docs/HANDOVER-PAUL-2026-11-12.md`.

## Deployment (Paul's own copy, set up 11 Nov 2026)
- **Vercel:**
  - Project `educate`, team "Paul McWilliam's projects".
  - Framework Next.js, Node 22.x, function region `lhr1`. Deploy from inside `educate-app/`; the project Root Directory setting is `.`. If you ever link GitHub, change it to `educate-app`.
- **Live:** https://educate-virid.vercel.app
- **Custom domain:**
  - `educatethemasses.online` (registered at GoDaddy, 11 Nov 2026) is the primary; `www.` redirects to the apex with a 308.
  - **Live since 15 Nov 2026** (HTTPS via Let's Encrypt, issued by Vercel). GoDaddy DNS records:
    - A `@` -> `216.150.1.1` and `216.150.16.1` (GoDaddy's parking A records `3.33.130.190` / `15.197.148.33` were deleted; if they come back, Vercel flags the domain as misconfigured and most visitors get a parking page)
    - CNAME `www` -> `7696e975a7890719.vercel-dns-016.com`
- **Neon:** project `educate` (`shy-paper-14167641`), AWS eu-west-2 (London), free plan (1 GB per branch). It was provisioned through the Vercel Marketplace integration, so manage it via Vercel; the Neon API can't create projects in that org.
- **How it's deployed:** with `vercel deploy --prod --yes` from the local clone on Paul's laptop (`C:\Users\LAPTOP80\Projects\educate\educate-app`, linked via `.vercel/`, which is gitignored). The project is **not GitHub-linked**, so pushing to GitHub does NOT deploy. `.vercelignore` excludes env files, `node_modules`, `.next` and `.claude`.
  - **Check the link first:** `.vercel/project.json` must say `"projectName":"educate"`. This clone was linked to a stale April project called `educate-app` until 12 Nov; that project was deleted on 15 Nov. Re-link with `vercel link --yes --project educate` if needed. Never create a new project called `educate-app`.
- As of 15 Nov, the live site is deployment `dpl_5o8RWLxJyYAxycbEwZ8G2dZNTsZc` (15 Nov, built from `5e95cf5`, the terms update for free accounts and school licences, on top of the privacy policy update, the `/schools` enquiry form, school licences and the free tier), so the live app code matches `master`. The live database has `organisations.ai_disabled` (added 13 Nov), 2,046 non-papers hidden (14 Nov), the `ai_usage` table (created 15 Nov; a signed-in AI-marked answer on the live site was counted there), `organisations.licence_ends_on` plus the `paper_opens` table, and the `school_enquiries` table (all created 15 Nov, before their deploys). The production database had no organisations then, so every user except a super_admin is on the free tier until a school is licensed. Paul's own production account was not a super_admin on 15 Nov (`/admin` redirected to onboarding): grant it with the Neon SQL under Roles before using the licence screen. Do not force-push. After any code change: commit, push, **and** deploy.
- `educate-app-zeta.vercel.app` is the stale `educate-app` project on **Paul's** account (not Ethan's): April code with its own `ANTHROPIC_API_KEY`, dev Clerk keys and the old database. It still called the retired `claude-3-5-haiku-20241022` and `claude-sonnet-4-20250514` (Anthropic sent a retirement notice about a failed request on 11 Nov). It was redeployed on 15 Nov 09:14 UTC, paused, then **deleted on 15 Nov** (`vercel project rm`; the URL now returns 404). Its own Anthropic key may still be valid at Anthropic: the retirement email named key "Educate-api-key" (ends `IgAA`). Revoke it in the Anthropic Console only after checking that the live `educate` project uses a different key, or AI on the live site stops. `educate-swart.vercel.app` (linked from GitHub) is dead.
- **Two Neon worlds:** Paul's project `shy-paper-14167641` is what educate-virid uses. Ethan's production papers live on `shiny-tooth-08089128` (via Ethan's Vercel `DATABASE_URL`), **not** in Neon org `org-curly-sound-07355255` (project `cool-snow-33977978` has no papers). Port 5432 often times out; use `@neondatabase/serverless` over HTTPS. Do not rotate the source DB password or copy PII.

## Conventions
- TypeScript everywhere; path alias `@/` -> `src/`.
- Server-only secrets: never read `ANTHROPIC_API_KEY` or `CLERK_SECRET_KEY` in client components.
- API routes:
  - Start with `const { userId } = await auth()` and return 401 if it's missing.
  - Check the role with `getUserRole`.
  - Validate the body with Zod.
  - Rate-limit AI routes with `lib/rate-limit.ts`.
  - **Every route that calls a model must ask `isAiDisabledFor(userId)` (`src/lib/ai-access.ts`) first.** That is the school "AI off" switch (`organisations.ai_disabled`, changed by teachers through `PATCH /api/organisations`). Refuse with `AI_DISABLED_MESSAGE` and a 403, or carry on without AI where a non-AI path exists (as `api/check` and `api/generate` do). Never rely on the browser's `educate-ai-disabled` value; it is only a mirror for the UI.
  - **Every route that calls a model must then take a use from the student's daily AI allowance with `takeAiUse(userId, bucket)` (`src/lib/ai-quota.ts`), after validating the request and just before the call.** The allowance lives in the `ai_usage` table (one row per user, UK day and bucket; atomic, so parallel requests can't overshoot). Over the limit, return 429 with the result's `message` (tier-aware: a free student is told what a school licence gives) and `code: 'ai_daily_limit'`, or fall back to the non-AI path (`api/check`, `api/generate`). Give the use back with `refundAiUse` when the model call fails (not possible for the streaming `api/chat`). The limits (`AI_DAILY_LIMITS` in `lib/plan-limits.ts`) are per tier (see School licences under Roles) and are starting values. If the database can't be reached (or the table is missing) the request is allowed and `[ai-quota]` is logged, so check the logs after a deploy. The in-memory `rateLimit` stays as burst protection. A licence raises the limits; it never skips the check.
- SQL: always use the `sql` tagged template (parameterised). Never string-concatenate user input. Compose optional filters with nested `sql\`\`` fragments, as in `api/past-papers`.
- Guest-first: static banks in `src/data/` must keep working without a DB or AI. Use AI and the DB only as an enhancement or fallback.
- AI output is rendered through `MessageContent` (KaTeX and Mermaid). Sanitise any new HTML/SVG injection.
- Keep commits small. Don't commit `.env*`, `.vercel/` or secrets.

## Known issues and TODO (prioritised)
1. **Security: dependencies.** `npm audit` shows 37 vulns (3 critical, 21 high, 7 moderate, 6 low). They include the **Clerk "middleware-based route protection bypass"** (`@clerk/nextjs` 7.0.0–7.2.3; installed 7.0.7) and several `next` advisories (installed 16.2.1; fixed in 16.4.6).
   - Upgrade `@clerk/nextjs` and `next` first, then run `npm audit fix` and re-test.
   - `xlsx` has no upstream fix; consider replacing it.
2. **Security: keep `/api/debug-role` out.** Also audit any new route for self-promotion. These findings from the April 2026 audit have not been re-verified since, so treat them as open:
   - `/api/check` has no auth requirement for its non-AI path.
   - Google OAuth callback `classroom/callback` uses the raw `userId` as `state`, with no signed or CSRF check (confirmed Nov 2026).
   - Teacher/admin layouts rely partly on client-side checks.
   - `game` PATCH has no ownership check.
   - Mermaid and KaTeX output isn't sanitised (DOMPurify).
   - The in-memory rate limiter resets on cold start.
3. **Clerk production is live (15 Nov 2026).** Clerk app "Educate" (`app_3C2cHAKmXkKnEEEnBeKlC1s9qfy`, Paul's personal workspace) has a production instance on `educatethemasses.online` (Frontend API `clerk.educatethemasses.online`, 5 CNAMEs at GoDaddy, all verified).
   - Vercel **Production** uses `pk_live`/`sk_live`; Preview and Development still use the dev instance's `pk_test`/`sk_test` (`better-duckling-95.clerk.accounts.dev`). Production keys only work on `educatethemasses.online`, so **sign-in on educate-virid.vercel.app no longer works**; send people to the custom domain.
   - Clerk only shows a new secret key once, when it is created (Production → API keys → Add new key). Unused keys `educate_pmc` and `default` can be deleted.
   - Google sign-in uses Paul's OAuth client "Educate - Clerk production" (client id `994040853439-lr8b…`) in its own Google Cloud project **`educate-auth`** ("Educate Auth", created 15 Nov 2026): consent screen app name Educate, External, published, home/privacy/terms on `educatethemasses.online`, redirect `https://clerk.educatethemasses.online/v1/oauth_callback`. The client id and secret are set in Clerk Production → SSO connections → Google (custom credentials). Google's account chooser shows "to continue to educatethemasses.online" (checked 15 Nov). Do not use project `educate-492818` for sign-in: its consent screen belongs to The Solar Campus.
   - The production instance started empty: the dev-instance users (including the test accounts) do not exist there. Their old `profiles` rows (dev `user_…` ids) are orphaned; a user who signs up again gets a new id and a new profile.
4. **Past papers are in Paul's DB** (copied 12 Nov 2026 from Ethan's production Neon; verified equal): 26,231 papers, 584,732 questions, 0 orphans, 496 MB. Do not re-copy. Watch the 1 GB free limit.
   - Practice matching was broken (year-only, no subject) and is **fixed and live** (`71590c2`, `src/lib/past-paper-match.ts`). It uses exam-code footers in question text because `year` / `paper_number` / tier are mostly null. Retest: AQA Maths Paper 1 Higher 2023 loads 37 Maths questions, 84 marks — not Combined Science. Details and caveats (enlarged paper chosen, OCR fallback, no GCSE_Edexcel rows) are in the 12 Nov handover.
5. **Drive PDFs are live** (13 Nov 2026) for signed-in users: `GET /api/paper-pdf?id=<paperUuid>` streams the original, `/api/paper-page` renders page PNGs, and the PDF Figures panel falls back to page images when `navigator.pdfViewerEnabled === false` (Android Chrome, or Chrome set to download PDFs). Follow-ups from the 13 Nov code review, all still open (details in the handover):
   - `api/past-papers` and `api/questions` still return the raw `drive_file_id` to the client; return a `has_pdf` boolean instead.
   - `downloadPdfBuffer` buffers whole files with no size cap (the largest PDF is 116 MB; 967 of 26,795 are over 4.5 MB). 5 MB and 9 MB papers were tested and work; nothing larger was tried. Add a size check, stream, and share one cache.
   - `paper-page`, `paper-pagecount`, `past-papers` and `questions` return raw `err.message`, and don't validate that `id` is a UUID.
   - `/api/download-paper` has no auth and follows redirects (SSRF risk via an allowlisted host).
   - The same-subject fallback in `past-paper-match.ts` can pick a different tier or year (shown with a "closest available paper" notice).
   - Not tested on a real phone. Google Classroom OAuth vars are still unset.
   - **13 Nov whole-app review** (security, practice flows, UI/UX): fixes are live in `ae16f2d` and `8a0fe2f`. The full open list, with measurements, is in the handover. The ones that shape new work:
     - **Mark schemes come from AQA, not the DB.** Only 712 of 584,732 questions have a `mark_scheme` (none GCSE AQA) and `has_image` is false on every row. `GET /api/mark-scheme?id=<paper>` works out the official AQA mark scheme from the paper's own footer code (`src/lib/aqa-mark-scheme.ts`, `src/lib/official-pdf.ts`). The answers view shows it in a side panel (`components/papers/MarkSchemePanel.tsx`). AQA's file store only has June 2022/2023 and Nov 2021/2022.
     - **AI marking** (13 Nov): `POST /api/mark-scheme { id, answers }` extracts the mark scheme's text (`extractPdfText` in `pdf-render.ts`) and has Claude mark the student's typed and multiple-choice answers (`src/lib/ai-paper-marking.ts`: structured JSON output, mark scheme in a cached system block, marks clamped server-side). Signed-in only, 6 runs per student per 15 minutes, `maxDuration` 300. Token use is logged as `[ai-marking] usage`. The mark scheme is about 16,800 tokens; a warm full-paper run costs roughly $0.08 and a cold one about $0.16. Drawings are not marked. Only papers with a mark scheme can be marked.
     - **The papers page offers only stored papers** (`/api/past-papers?available=1` → canonical codes; `isPaperStored` in `past-paper-match.ts`). Languages match by skill letter, single written papers by `W`. OCR never matches exactly (no footer codes) and there are no Edexcel papers.
     - **11+** is stored as exam type `11Plus_Practice` (187 usable papers) and is reachable only through `/practice`. The content is rough.
     - **Scraped text is cleaned on the way out, never in the DB** (14 Nov): `cleanPaperQuestions` in `src/lib/question-text.ts` (used by `api/past-papers?id=` and `api/questions`) strips page furniture, recovers AQA "0 1 . 3" numbers and cuts or drops mark-scheme text. Matching reads footer codes from the raw text, so don't rewrite stored rows.
     - **Mark-scheme PDFs scraped as papers are hidden with `processed = false`** (the v1/v2 convention). `scripts/cleanup-mark-schemes-v3.mjs` hid 1,548 more on 14 Nov (AQA mark schemes by the "MARK SCHEME – GCSE …" page header, AQA "answers and commentaries" resources by marking language with no page furniture or footer code, others by title); it also hid 498 AQA examiner reports (no furniture or footer code, at least 30% of rows read "Students who…" style commentary), 2,046 in all; the ids are in `scripts/cleanup-mark-schemes-v3.ids.json` for undo. About 40 other AQA non-papers (specifications, grade-outcome tables, NEA guides) are still visible; the rule leaves them because a few real papers also lack furniture. OCR sample assessment materials bundle paper + mark scheme in one PDF and stay visible; their mark-scheme rows are filtered by `cleanPaperQuestions`. `process-past-papers.ts` skips `processed = false` papers and keeps them hidden on `--force`; `GET /api/past-papers?id=` returns 404 for them.
     - The deterministic marker in `src/lib/mark-scheme.ts` over-awards; streaks are never recorded from quizzes; most subtopics in the topic picker have no questions.
     - Security still open: teachers can add any user to a class by raw id, `api/friends` leaks account existence, class join codes are weak.
   - Rules that came out of it: every route that spends AI money or writes to the DB needs `auth()` and `rateLimit`; never trust scores, XP or player ids from the client; never return Clerk user ids of other users.
6. **New teachers must create a school** (organisation) at `/teacher` before they can create classes. Consider a smoother onboarding.
7. **Privacy policy (`src/app/privacy/page.tsx`), updated 15 Nov:** it now lists Neon (London), Vercel, Clerk and Anthropic, and covers the `/schools` enquiry form (what is collected, why, and that enquiries are kept up to 12 months after last contact, or while a licence runs). Nothing deletes old enquiries automatically: delete them by hand in Neon when they pass 12 months. Still open: its contact address `privacy@educate.app` is not on Educate's domain (check it reaches someone), and it says nothing about the school AI-off switch, AI usage counts (`ai_usage`) or the free papers record (`paper_opens`).
8. **There are 56 hidden TypeScript errors** (`ignoreBuildErrors: true`). Fix them, then remove the flag.
9. **Stale docs:** `docs/HANDOVER-ETHAN.md` refers to the shared DB/Clerk, the old URL and `GOOGLE_DRIVE_API_KEY`. The GitHub repo description links the dead URL.
10. **Content gaps:** some mastery pathways show "coming soon" (`app/mastery`). Request-time DDL in routes should move into `db/schema.sql`.
11. **School "AI off" switch follow-ups** (13 Nov):
    - The switch on the teacher dashboard and a teacher's `PATCH /api/organisations` have not been tested; that needs a teacher signed in with a school set up. Enforcement was tested by setting the column directly.
    - Any teacher can switch AI off for their whole school. Restrict it to `school_admin` if that is wrong.
    - If the database cannot be reached, the check lets AI through.
12. **Subjects saved only in the browser.** Timer, exams, mastery, checklist, timetable and export read `educate-user-subjects` from `localStorage` and may show nothing for a student who has not picked subjects on that device. The notes page was fixed on 13 Nov (falls back to all subjects, then `/api/user-subjects`); the others were not.
13. **The local `.env.local` is an April copy and is wrong twice over:** its `DATABASE_URL` is an old database (see Database) and its `ANTHROPIC_API_KEY` returns 401. Replace it with `vercel env pull` before any local testing of AI or data.
14. **School licence follow-ups** (15 Nov): the teacher dashboard doesn't show the school's licence status yet; enquiries from `/schools` are not emailed to anyone (no email provider yet); the terms page (section 6, updated 15 Nov) promises that a licence's agreed allowance won't be cut while it runs and that nothing is deleted when a licence ends, so keep both true; a trust or local authority is one licence per school for now (no group level).

## Feature status (Paul's deployment, verified 13 Nov 2026 unless a line says otherwise)
- **Working:**
  - **Tutor chat, topic chat, study tools and the notes page's "Generate with AI" on Claude Sonnet 5.5** (checked 13 Nov as Test Student; conversations longer than two turns and a declined question were not tried)
  - **School "AI off" switch enforced on the server** (checked 13 Nov as Test Student with a temporary school, since removed: five AI routes refuse, answer marking carries on without AI, the chat panel makes no call)
  - home, `/login` (not `/sign-in`, which is 404)
  - **Landing page at `/` for signed-out visitors** (live 15 Nov): sample question marks on the spot, buttons go to `/boards` and `/login`; a signed-in visitor with an expired session token is handed to the dashboard (checked in Chrome on the live site)
  - guest quiz (`/AQA/Mathematics/quiz`)
  - Clerk sign-in (production instance on educatethemasses.online since 15 Nov; Google button reaches Google's account chooser. A full sign-up on production not yet done)
  - profile/onboarding
  - AI tutor chat (streaming) and AI marking
  - teacher dashboard ("Set up your school")
  - **Past papers from the DB:** list API and practice matching (AQA Maths Paper 1 Higher and Foundation 2023 retested as Test Student)
  - **Original paper PDFs** (signed-in only): PDF stream, page images, the "Paper pages" thumbnail strip and the PDF Figures panel, checked 13 Nov as Test Student on AQA Maths Paper 1 Higher 2023 (56-page enlarged paper). Signed out, every paper route returns 401.
  - The official mark scheme beside the answers and the "stored papers only" papers page (AQA, checked 13 Nov)
  - `/practice` (random questions from stored papers, including 11+), answer saving and the finish confirmation on the paper page, topic tick-boxes, online-game API create/read/update (all checked 13 Nov as Test Student).
- **Unconfigured:** Google Classroom.
- **Sign-in now required:** online games (`/api/game`) and the global leaderboard. Guests get a 401 with a "sign in" message.
- **Not yet exercised on the new deployment:** marketplace, flashcards CRUD, assignments, parent link, a full two-player online game, the "AI off" switch on the teacher dashboard, and anything on a real phone.

## Test accounts (exist only in the Clerk DEV instance; they must sign up again on production, and the teacher role must be set again in `profiles`)
- Test Teacher: `testteacher@yopmail.com` (role teacher)
- Test Student: `teststudent11@yopmail.com` (role student, no org)
- Passwords are NOT stored here. yopmail inboxes are public, so don't use these accounts for anything sensitive.
- `scripts/seed-test-users.ts` reuses existing Clerk users and upserts their profiles. Its console.log / header comments that print `Test1234!` are **stale and wrong** — use the password actually passed to `findOrCreateUser` in that script.
- Claude will not type these passwords or email codes into the live site; Paul signs in himself (new-device codes arrive in the public yopmail inbox), then Claude tests in that browser tab.
