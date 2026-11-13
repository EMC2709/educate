@AGENTS.md

# Educate: GCSE Revision Platform

> Last reviewed: 13 Nov 2026. This file is the source of truth for AI coding sessions. Keep it current.
> For the 11-13 Nov session state (Drive PDFs now live, review findings, platform details, next steps), see `docs/HANDOVER-PAUL-2026-11-12.md`.
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
| Tutor chat, topic chat, study tools | `claude-sonnet-4-5-20250929` | `api/chat`, `api/topic-chat`, `api/generate-study-tools` |

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
        page.tsx                 Home; routes by role (see Roles)
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
  educate-v4.jsx                 Original single-file prototype (reference only)
  *.md, *.pptx                   Market research, case study, pitch deck (not code)
```

### Key API routes (`src/app/api/*/route.ts`)
- **AI:**
  - `chat` (streaming tutor, needs auth)
  - `check` (marking; AI only when signed in, otherwise deterministic)
  - `generate`, `generate-study-tools`, `topic-chat`, `topic-summary`, `revision-notes`
- **Content:** `questions`, `past-papers` (list, plus `?resolve=1` lookup by subject/sitting/paper/tier), `paper-pdf` (auth-only PDF stream), `paper-page` (auth-only PNG of one page), `paper-pagecount`, `download-paper` (official board-URL proxy only — not Drive)
  - All of these except `download-paper` require sign-in and must send `Cache-Control: private` (never `public` / `s-maxage`, or the CDN serves signed-in content to anyone).
  - `paper-pdf` is the only route allowed in an iframe (`X-Frame-Options: SAMEORIGIN` override in `next.config.ts`; everything else is `DENY`).
- **Gamification:** `award-xp`, `save-result`, `achievements`, `leaderboard`, `marketplace`, `marketplace/equip`, `friends`, `game`, `quiz-history`
- **Flashcards:** `flashcards/**`, `shared-flashcards/**` (including `clone`)
- **Users:** `profile`, `user-subjects`, `parent-link`, `parent/[token]`
- **School:**
  - `organisations`, `classes/**` (join, join-code, members, performance)
  - `assignments/**` (progress, unread)
  - `classroom/{auth,callback,courses,sync}` (Google OAuth)
- **Admin:** `admin/roles` (PATCH; super_admin only)

## Roles and permissions
- `profiles.role` is one of `student` (default), `teacher`, `school_admin`, `super_admin`. Read it via `src/lib/roles.ts` (`getUserRole`, `requireRole`, `getUserOrg`).
- Home routing:
  - teacher, school_admin and super_admin go to `/teacher`
  - a student with `org_id` goes to `/student`
  - a student without an org gets the independent dashboard
  - a guest gets the exam-board picker
- `src/proxy.ts` only guards `/admin*`, `/api/admin*` (super_admin) and `/teacher*` (teacher+). **Every other API route must do its own `auth()` and role check.**
- **Granting super_admin, the only sanctioned way:**
  1. The user signs up and loads any signed-in page, which creates their `profiles` row.
  2. Take their Clerk user ID (`user_...`) from the Clerk dashboard.
  3. In the Neon SQL editor (project `educate`), run:
     `UPDATE profiles SET role = 'super_admin', updated_at = now() WHERE user_id = 'user_...';`
  4. After that, super_admins assign other roles via `/admin` (`PATCH /api/admin/roles`).
  5. `scripts/make-admin.mjs` does the same locally with `DATABASE_URL`.
- **NEVER add a route that lets a user change their own role.** The old `/api/debug-role` (any signed-in user could POST to become super_admin) was deleted on 11 Nov 2026. Don't restore it.

## Database
- The schema is in **`db/schema.sql`** (17 tables, idempotent `IF NOT EXISTS`).
  - It was reconstructed from `scripts/schema-past-papers.sql`, `scripts/migrate-*.ts` and inline `CREATE/ALTER` statements in API routes.
  - Tables: profiles, organisations, classes, class_members, assignments, assignment_progress, past_papers, questions, quiz_results, user_subjects, user_flashcard_decks, user_flashcards, revision_notes, user_banners, friendships, game_sessions, teacher_google_tokens.
- Some routes still run `CREATE TABLE/ALTER TABLE IF NOT EXISTS` at request time (flashcards, friends, marketplace, save-result, parent-link, game, revision-notes, user-subjects). That's a known smell.
- **When you add a column or table, add it to `db/schema.sql` too.**
- Apply the schema with any Postgres client, or with a Node script using `@neondatabase/serverless` (HTTP, which works where port 5432 is blocked). Use `DATABASE_URL_UNPOOLED` for DDL when possible.

## Commands (run in `educate-app/`)
```bash
npm ci                 # install
npm run dev            # http://localhost:3000 (.claude/launch.json uses 3100)
npm run build          # next build (TypeScript errors are IGNORED, see below)
npm test               # vitest (5 files, 31 tests, passing; includes src/lib/past-paper-match.test.ts)
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
  - It's attached and its ownership is verified in Vercel. **DNS is still pending at GoDaddy:**
    - A `@` -> `216.150.1.1` and `216.150.16.1`
    - CNAME `www` -> `7696e975a7890719.vercel-dns-016.com`
- **Neon:** project `educate` (`shy-paper-14167641`), AWS eu-west-2 (London), free plan (1 GB per branch). It was provisioned through the Vercel Marketplace integration, so manage it via Vercel; the Neon API can't create projects in that org.
- **How it's deployed:** with `vercel deploy --prod --yes` from the local clone on Paul's laptop (`C:\Users\LAPTOP80\Projects\educate\educate-app`, linked via `.vercel/`, which is gitignored). The project is **not GitHub-linked**, so pushing to GitHub does NOT deploy. `.vercelignore` excludes env files, `node_modules`, `.next` and `.claude`.
  - **Check the link first:** `.vercel/project.json` must say `"projectName":"educate"`. Paul's account also has a stale April project called `educate-app`; this clone was linked to it until 12 Nov. Re-link with `vercel link --yes --project educate` if needed. Never deploy to `educate-app`.
- As of 13 Nov, GitHub `master` and the live site are in sync at `8a0fe2f` (deployment `dpl_FXT9BcBVjoZ1gundWnR7mECPWzQE`). Do not force-push. After any code change: commit, push, **and** deploy.
- The old deployment `educate-app-zeta.vercel.app` (Ethan's original, different account and DB) is separate. `educate-swart.vercel.app` (linked from GitHub) is dead.
- **Two Neon worlds:** Paul's project `shy-paper-14167641` is what educate-virid uses. Ethan's production papers live on `shiny-tooth-08089128` (via Ethan's Vercel `DATABASE_URL`), **not** in Neon org `org-curly-sound-07355255` (project `cool-snow-33977978` has no papers). Port 5432 often times out; use `@neondatabase/serverless` over HTTPS. Do not rotate the source DB password or copy PII.

## Conventions
- TypeScript everywhere; path alias `@/` -> `src/`.
- Server-only secrets: never read `ANTHROPIC_API_KEY` or `CLERK_SECRET_KEY` in client components.
- API routes:
  - Start with `const { userId } = await auth()` and return 401 if it's missing.
  - Check the role with `getUserRole`.
  - Validate the body with Zod.
  - Rate-limit AI routes with `lib/rate-limit.ts`.
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
3. **Clerk is the original app's DEVELOPMENT instance** (pk_test). The sign-in page shows the "Development mode" badge, Google sign-in uses Clerk's shared OAuth, and new-device sign-ins require an email code. Plan for a Clerk production instance on `educatethemasses.online`:
   - add Clerk's 5 CNAMEs at GoDaddy
   - swap in the pk_live/sk_live keys
   - use Paul's own Google OAuth client
   - recreate users, since a production instance starts empty
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
     - **Past papers are not marked.** Only 712 of 584,732 questions have a mark scheme (none for GCSE AQA), and `has_image` is false on every row. The paper page shows the student's answers and links the official mark scheme for an exact match.
     - **The papers page offers years the database lacks.** AQA mostly has June 2020–2024; OCR never matches exactly; there are no Edexcel papers. A different paper of the same subject is served and labelled as such.
     - **11+** is stored as exam type `11Plus_Practice` (187 usable papers) and is reachable only through `/practice`. The content is rough.
     - The deterministic marker in `src/lib/mark-scheme.ts` over-awards; streaks are never recorded from quizzes; most subtopics in the topic picker have no questions.
     - Security still open: teachers can add any user to a class by raw id, `api/friends` leaks account existence, class join codes are weak.
   - Rules that came out of it: every route that spends AI money or writes to the DB needs `auth()` and `rateLimit`; never trust scores, XP or player ids from the client; never return Clerk user ids of other users.
6. **New teachers must create a school** (organisation) at `/teacher` before they can create classes. Consider a smoother onboarding.
7. **The privacy policy (`src/app/privacy/page.tsx`) says Supabase.** It should say Neon (EU/London), Clerk, Anthropic, Vercel and Google Drive (paper PDFs).
8. **There are 56 hidden TypeScript errors** (`ignoreBuildErrors: true`). Fix them, then remove the flag.
9. **Stale docs:** `docs/HANDOVER-ETHAN.md` refers to the shared DB/Clerk, the old URL and `GOOGLE_DRIVE_API_KEY`. The GitHub repo description links the dead URL.
10. **Content gaps:** some mastery pathways show "coming soon" (`app/mastery`). Request-time DDL in routes should move into `db/schema.sql`.

## Feature status (Paul's deployment, verified 13 Nov 2026)
- **Working:**
  - home, `/login` (not `/sign-in`, which is 404)
  - guest quiz (`/AQA/Mathematics/quiz`)
  - Clerk sign-in (dev instance; new-device email code)
  - profile/onboarding
  - AI tutor chat (streaming) and AI marking
  - teacher dashboard ("Set up your school")
  - **Past papers from the DB:** list API and practice matching (AQA Maths Paper 1 Higher and Foundation 2023 retested as Test Student)
  - **Original paper PDFs** (signed-in only): PDF stream, page images, the "Paper pages" thumbnail strip and the PDF Figures panel, checked 13 Nov as Test Student on AQA Maths Paper 1 Higher 2023 (56-page enlarged paper). Signed out, every paper route returns 401.
- **Unconfigured:** Google Classroom, custom domain DNS (GoDaddy records are listed above, not yet applied).
  - `/practice` (random questions from stored papers, including 11+), answer saving and the finish confirmation on the paper page, topic tick-boxes, online-game API create/read/update (all checked 13 Nov as Test Student).
- **Sign-in now required:** online games (`/api/game`) and the global leaderboard. Guests get a 401 with a "sign in" message.
- **Not yet exercised on the new deployment:** marketplace, flashcards CRUD, assignments, parent link, a full two-player online game.

## Test accounts (existing users in the Clerk dev instance; profile rows seeded in the new DB)
- Test Teacher: `testteacher@yopmail.com` (role teacher)
- Test Student: `teststudent11@yopmail.com` (role student, no org)
- Passwords are NOT stored here. yopmail inboxes are public, so don't use these accounts for anything sensitive.
- `scripts/seed-test-users.ts` reuses existing Clerk users and upserts their profiles. Its console.log / header comments that print `Test1234!` are **stale and wrong** — use the password actually passed to `findOrCreateUser` in that script.
- Claude will not type these passwords or email codes into the live site; Paul signs in himself (new-device codes arrive in the public yopmail inbox), then Claude tests in that browser tab.
