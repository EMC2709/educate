# Educate — handover for Claude Code (12–13 Nov 2026)

> First written 12 Nov 2026 (evening); **updated 13 Nov 2026, 07:40 Europe/London** after the PDF work was finished in Claude Code on Paul's Windows laptop.
> Lasting architecture, conventions and the standing TODO list live in [`CLAUDE.md`](../CLAUDE.md) (updated the same day). Read both.
> **Never put secret values (API keys, connection strings, passwords, OAuth tokens, service-account JSON) in this file, in `CLAUDE.md`, in git, or in chat.**

This is Paul's own copy of the UK GCSE revision app (GitHub `EMC2709/educate`). The original live app is `educate-app-zeta.vercel.app` on Ethan's (EMC2709) Vercel and Neon. Paul's copy is live at **https://educate-virid.vercel.app**.

---

## Where things stand (13 Nov)

All of the 12 Nov "start here" steps are **done and verified live**:

- Past papers are in Paul's DB, and practice matching is by subject, sitting, paper and tier.
- **Original PDFs work for signed-in students.** A Google service account reads the private PAPERS folder server-side. `/api/paper-pdf` streams the PDF, and `/api/paper-page` renders page images.
- The PDF Figures side panel shows the PDF. On browsers with no inline PDF viewer (Android Chrome, or Chrome with "Download PDFs" on) it shows page images instead.
- The "Paper pages" thumbnail strip in the paper sheet works again.
- Signed-out requests to every paper route return **401**. Auth-gated responses are no longer cacheable by the CDN.

A whole-app review on 13 Nov fixed a batch of security and practice bugs; see [13 Nov — whole-app review](#13-nov--whole-app-review-security-practice-flows-uiux). The biggest remaining product gap is that **past papers are not marked**: the database holds almost no mark schemes.

**Suggested next steps:**

0. Decide how past papers get marked, and stop offering years the database does not have (items 1 and 2 in the review's open list).
1. GoDaddy DNS for `educatethemasses.online` (records below). Only do this when Paul says so.
2. Dependency security upgrades (`@clerk/nextjs`, `next`). See [Standing product debt](#standing-product-debt-still-open).
3. The leftover review findings in [Open items from the 13 Nov review](#open-items-from-the-13-nov-code-review). They are all medium or low.
4. `super_admin` for Paul: he signs up with his own account, then run the SQL in [Clerk](#clerk).

---

## Git

- Repo: [EMC2709/educate](https://github.com/EMC2709/educate), branch `master`. **Do not force-push.**
- **Deploy machine is now Paul's Windows laptop.**
  - Clone: `C:\Users\LAPTOP80\Projects\educate`. Vercel CLI signed in as `paulmc18-4680`.
  - `educate-app/.vercel/` is gitignored and is linked to the **`educate`** project (`prj_u7ixZfKMTW7uA98SFTUbmGlDhrcd`).
  - Until 12 Nov it was linked to an old April project called **`educate-app`** (`prj_TZsh…`, last deployed 210 days ago). Check `.vercel/project.json` says `"projectName":"educate"` before any deploy.
  - The old Grok Bot clone `/workspace/educate-deploy` is no longer needed.
- **The Vercel project is not GitHub-linked:** `git push` does **not** deploy. Deploy with `vercel deploy --prod --yes` from `educate-app/`.
- `master` and what's live are in sync as of 13 Nov 07:30:

  | Commit | What it does | Live on educate-virid? |
  |---|---|---|
  | `71590c2` | Practice paper matching by subject + sitting + paper + tier | Yes |
  | `5d15b5c` | Same-origin PDF stream (`/api/paper-pdf`), service-account support in `getDrive()` | Yes (12 Nov 18:08) |
  | `c4a8e3f` | `/api/paper-pdf` may be framed same-origin; auth-gated APIs `Cache-Control: private`; PDF iframe only mounts when the panel opens | Yes |
  | `9ca3673` | pdfjs worker shipped (`outputFileTracingIncludes`) and preloaded — fixes 500s on `paper-page` / `paper-pagecount` | Yes |
  | `5bb361e` | PDF panel shows page images when `navigator.pdfViewerEnabled === false` | Yes |
  | `ae16f2d` | Security fixes from the whole-app review (game, XP, leaderboard, AI routes, download-paper) | Yes |
  | `8a0fe2f` | Practice fixes (answers saved, honest results, `/practice`, phone layout) | Yes — current deployment `dpl_FXT9BcBVjoZ1gundWnR7mECPWzQE` (13 Nov) |

- **Local leftovers on the laptop (not in git):**
  - `stash@{0}` holds a RuFlo template that had overwritten `educate-app/CLAUDE.md`. It is safe to drop.
  - A dozen zero-byte junk files from a mangled shell command sit in the repo root and `educate-app/` (`{`, `s`, `14`, `$null`, …). Delete them by hand if you like; they are untracked.

---

## Platforms — current state

### Vercel (Paul)

- Team "Paul McWilliam's projects", project **`educate`**.
  - Next.js, Node 22.x, region `lhr1`.
  - Root Directory `.`, because deploys run from `educate-app/`. If the project is ever GitHub-linked, set it to `educate-app`.
- Live: https://educate-virid.vercel.app
- **Env vars (Production):**
  - `DATABASE_URL`, `DATABASE_URL_UNPOOLED` and the other Neon vars
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - `ANTHROPIC_API_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - **`GOOGLE_CREDENTIALS_JSON`** — added 13 Nov, encrypted and marked *sensitive*, Production only. It holds the service-account JSON.
- **Not set:**
  - `GOOGLE_TOKEN_JSON` — not needed with a service account
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Classroom OAuth, optional
  - `GOOGLE_DRIVE_API_KEY` — not read by the app
- Changing an env var needs a **redeploy** to take effect.
- The old project `educate-app` also has `GOOGLE_*` vars of unknown origin. Don't copy them, and don't deploy to it.

### Neon (two different databases — do not confuse them)

**A. Paul's database (the one educate-virid uses).**

- Project `educate`, id `shy-paper-14167641`, AWS eu-west-2 (London), free 1 GB plan, managed through Vercel's Neon integration.
- Content copied 12 Nov 2026 from Ethan's production DB, verified equal:
  - 26,231 `past_papers` and 584,732 `questions`
  - 0 orphans
  - 496 MB in total
  - No PII tables were copied.
- **Do not re-copy, truncate or rotate passwords.**

**B. Ethan's production database (the source of the papers).** This is Neon project `shiny-tooth-08089128`, reached via `DATABASE_URL` on Ethan's Vercel project for `educate-app-zeta`.

- Do not reset or rotate its password.
- Do not copy PII from it.
- Do not point educate-virid at it.

**Querying:** use `@neondatabase/serverless` over HTTPS, because port 5432 is often blocked.

- To get a URL, run `vercel env pull --environment=production <file>` into a scratch folder.
- Never print it, and delete the file afterwards.
- Run Node scripts from inside `educate-app/`, so `@neondatabase/serverless` resolves.

### Google Drive

- Folder **[PAPERS](https://drive.google.com/drive/folders/1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9)** (`1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9`). Every `past_papers.drive_file_id` points into it.
- Owner `stuart.fosker@gmail.com`. Paul (`paulmc18@gmail.com`) is an editor.
- **Shared 13 Nov with `educate-pdf-reader@educate-492818.iam.gserviceaccount.com` as Viewer**, with no notification. General access is still **Restricted**. Never set "anyone with the link".
- The service account can see 26,795 PDFs. Their sizes:
  - median 0.46 MB, 90th percentile 2.45 MB, 99th percentile 9.84 MB, largest 116 MB
  - 967 are over 4.5 MB, 323 of them GCSE papers
  - 5 MB and 9 MB papers stream fine through `/api/paper-pdf`; nothing above 9 MB has been tried
- **Claude's Google Drive connector** (in the Claude app) is connected to a different Google account: it gets "not found" on PAPERS. Make sharing changes in Drive in Chrome as Paul.

### Google Cloud

- Project **`educate`** (`educate-492818`), owned by `paulmc18@gmail.com`, no organisation.
  - It already existed (created Jul 2026) and was reused.
  - The Drive API was already enabled.
  - **Billing was not touched.**
- Service account **`educate-pdf-reader@educate-492818.iam.gserviceaccount.com`**:
  - It has **no project IAM roles**, and sees only what is shared with it.
  - One JSON key, created 13 Nov, key id starting `8bd8cf9a0d70`.
  - The key file is stored outside git at `C:\Users\LAPTOP80\.secrets\educate-drive-sa.json`, and the same JSON is in Vercel.
- **To revoke access:** delete the key under Cloud Console → IAM → Service accounts → `educate-pdf-reader` → Keys, or remove the service account from the PAPERS share.
  - If the key is rotated, update `GOOGLE_CREDENTIALS_JSON` with `vercel env add GOOGLE_CREDENTIALS_JSON production --sensitive < keyfile` (remove the old value first) and redeploy.
- **Cloud Console pitfall:** typing `/` anywhere in the console opens its search box and leaves the current form. Avoid slashes in descriptions.

### Clerk

- Sign-in is at **`/login`** (`/sign-in` is a 404). It is still the original app's **development instance** (`pk_test`): there is a "Development mode" badge, and new-device sign-ins email a 6-digit code.
- **Test Teacher:** `testteacher@yopmail.com`, role `teacher`.
- **Test Student:** `teststudent11@yopmail.com`, role `student`, no org.
- **Passwords:**
  - They are not in this file.
  - The Test Student password is the third argument to `findOrCreateUser` for the student in `scripts/seed-test-users.ts` (around line 126). Ignore the stale `Test1234!` in that script's comments.
  - New-device codes go to the public yopmail inbox (yopmail.com, inbox `teststudent11`).
  - Claude will not type these passwords or codes on the live site, so Paul has to sign in himself.
- Roles live in `profiles.role`. To make Paul `super_admin`:
  1. He signs in with Google as himself.
  2. Find his `user_...` id.
  3. Run `UPDATE profiles SET role = 'super_admin', updated_at = now() WHERE user_id = 'user_...';` in Paul's Neon.
- **Never restore `/api/debug-role`.**

### GoDaddy (waiting on Paul)

- `educatethemasses.online` is attached and verified in Vercel. **DNS is still pending.** Only add:
  - A `@` → `216.150.1.1` and `216.150.16.1`
  - CNAME `www` → `7696e975a7890719.vercel-dns-016.com`

### Anthropic

- Marking, generation and revision notes use `claude-haiku-4-5-20251001`.
- Tutor, topic chat and study tools use `claude-sonnet-4-5-20250929`.
- `/api/check` falls back silently if the AI call fails, so check the logs.

---

## What was done

### 11 Nov — Paul's copy stood up

- Removed `/api/debug-role`.
- Added `db/schema.sql` and updated the Anthropic model IDs.
- Deployed to Vercel project `educate`.
- Seeded the test users.

### 12 Nov — past-paper content and matching

- **Content:** copied read-only from Ethan's production DB into Paul's Neon, then verified (counts above).
- **Matching bug:**
  - Symptom: AQA Maths Paper 1 Higher 2023 served Combined Science.
  - Cause: the papers page picked by year only, with no subject.
  - Fix: commit `71590c2` (`src/lib/past-paper-match.ts`). It matches on the exam-code footer in the question text (e.g. `IB/M/Jun23/8300/1H`) and never crosses subjects. If there is no exact match, it falls back by year column, then to the same subject with an on-screen notice.
- **Useful paper id:** AQA Maths 2023 Paper 1 Higher is `697178d1-067b-42c6-a51f-812b31176f94`.
  - It has 37 questions and 84 marks.
  - It is the **enlarged (modified) print** version, and its PDF has 56 pages.
  - The standard version (`f96480cb…`) has only 26 question rows.
- **Limits:**
  - OCR, WJEC, Eduqas and some AQA subjects have no footer codes, so they use the same-subject fallback.
  - There are no `GCSE_Edexcel` rows.
- **PDF stream code:** commit `5d15b5c`. `/api/paper-pdf?id=<paperUuid>` checks Clerk auth, accepts UUIDs only, and looks up the Drive id server-side.

### 12–13 Nov — PDFs made live (Claude Code)

1. Pulled `master`, which was a fast-forward. Found and fixed the stale `.vercel` link (see [Git](#git)).
2. Set up Google Cloud: service account, Viewer share and key (see [Google Cloud](#google-cloud)). Before deploying, checked that the key can list the PAPERS folder.
3. Added `GOOGLE_CREDENTIALS_JSON`, then deployed `5d15b5c`. Signed-out `/api/paper-pdf` → 401.
4. **Independent code review** (a Fable reviewer on `b345bec..2419dd7`). Each claim was checked against the code before anything was fixed. Fixed in `c4a8e3f`:
   - `next.config.ts` sent `X-Frame-Options: DENY` on every route, which **blocked the PDF iframe**. `/api/paper-pdf` now gets `SAMEORIGIN` + `frame-ancestors 'self'` instead.
   - `paper-page`, `paper-pagecount`, `past-papers` and `questions` sent `Cache-Control: public` / `s-maxage`. The CDN could then serve a signed-in response to signed-out visitors. All four now send **`private`**.
   - The PDF iframe mounted, and downloaded the whole PDF, even with the panel closed. It now mounts only when the panel opens.
5. **Signed-in test as Test Student** (Paul signed in) found that `paper-page` and `paper-pagecount` had **always 500'd in production**, with `Cannot find module …/pdfjs-dist/legacy/build/pdf.worker.mjs`. Vercel's file tracing never shipped the worker. Fixed in `9ca3673`:
   - `outputFileTracingIncludes` now ships the worker with both routes.
   - `pdf-render.ts` preloads it into `globalThis.pdfjsWorker`.
6. **Page-image fallback** (`5bb361e`): Chrome with "Download PDFs" on (as on Paul's laptop), and Android Chrome, show only an "Open" placeholder for PDFs in an iframe. When `navigator.pdfViewerEnabled === false`, the panel now lists lazily loaded page images instead.

**Verified live, signed in as Test Student** (Paul's Chrome, which has the PDF viewer off):

- The papers card reads "On Educate: 37 questions · 84 marks".
- The practice intro shows 37 questions, 84 marks and 1hr 30min, and the questions are real Maths.
- `/api/paper-pdf` returns 200 `application/pdf` (1.16 MB, about 4 s), `private`, `SAMEORIGIN`.
  - The 5 MB and 9 MB papers stream in full.
- `paper-pagecount` returns 56, and page images render, including page 1 of the 9 MB Geography paper.
- The panel shows page 1 of 8300/1H (19 May 2023).
  - On opening, 10 of 56 images loaded and the PDF did not download.
- Signed out, every paper route returns 401.
- Tests: 31/31 pass. `tsc` still shows the pre-existing 56 errors, with none new.

**Not tested:**

- A real phone.
- PDFs over 9 MB. The largest is 116 MB, and the whole file is buffered in memory.

---

## 13 Nov — whole-app review (security, practice flows, UI/UX)

Four independent Fable reviewers read the whole app (two on security, one on student practice flows, one on UI/UX), and a live sweep tested 192 board / subject / paper / year combinations as Test Student. Every finding was checked against the code or the database before it was fixed.

**Fixed and live** (commits `ae16f2d` security, `8a0fe2f` practice; deployment `dpl_FXT9BcBVjoZ1gundWnR7mECPWzQE`):

- **Security**
  - `/api/game` had no sign-in on any method and returned children's names and Clerk ids. It now needs sign-in, takes the player from the session, limits a started game to its two players and never returns Clerk ids.
  - `/api/award-xp` and `/api/save-result` trusted any score from the client (one request could give unlimited XP or coins). Values are now bounded and rate limited.
  - The global leaderboard needs sign-in and hides other players' ids.
  - `POST /api/revision-notes` and the AI fallback in `/api/generate` could be called by anyone, spending the Anthropic key. Both now need sign-in and are rate limited. `topic-chat`, `chat`, `check` and `generate-study-tools` got size caps and rate limits.
  - `/api/download-paper` only serves PDFs from this origin, re-checks the allowlist after redirects and times out after 8 s. Other pages open on the exam board's own site.
- **Practice paper page**
  - Answers are saved as the student types and restored after a refresh; the browser warns before leaving mid-paper.
  - Finishing with blank questions asks first, and the answers view has "Back to my answers".
  - The answers view no longer shows empty "model answer" boxes. It says there is no stored mark scheme and links the official one when the paper is an exact match.
  - A substituted paper is labelled as a different paper, not as the year the student picked.
  - Multi-part questions "(a) (b) (c)" were shown as multiple choice with no way to type. Detection is now uppercase A–D only, and any question can be switched to a text box.
  - Phone layout: narrower gutters, sticky top bar, PDF panel sizing, page images on touch devices.
- **Elsewhere**
  - `/practice` never loaded a question (it read the wrong response shape). It works now and offers 11+.
  - Topic tick-boxes toggled twice per tap, so nothing was selected.
  - Diagnosis "Start Revision" linked to a 404.
  - A failed marking request in the quiz was counted as a wrong answer.

**What the data can and cannot do** (measured in Paul's database on 13 Nov):

- **Mark schemes:** only 712 of 584,732 questions have one, and none of them are GCSE AQA. Past-paper practice is therefore self-checking against the official mark scheme; nothing is marked automatically.
- **Figures:** `has_image` is false on every row. The paper page now guesses from the question wording.
- **Matching** (192 combinations, years 2023 and 2019):
  - AQA: 45 exact, 59 served a different paper of the same subject, 8 nothing.
  - OCR: all 22 served a different paper (no footer codes).
  - Edexcel: all 58 nothing — there are no Edexcel papers, so students get the built-in sample questions.
- **AQA sittings stored:** mostly June 2020–2024. 2019 and earlier exist only for Mathematics, Chemistry, Physics, Combined Science and Statistics. English Language has one usable paper.
- **Languages:** French, Spanish and German paper codes use letters (`8658/LH` for Listening Higher), so "Paper 1/2/3" never matches exactly.
- **11+:** 380 papers and 3,183 questions under exam type `11Plus_Practice`; 187 papers are usable and 93 have ten or more questions. They are reachable through `/practice` now, but the content is rough: fragments, and some rows are text from answer booklets.

**Still open, most important first:**

*Practice*
1. **Past papers are not marked.** Options: link each paper to its mark-scheme PDF (the 7,378 unprocessed `past_papers` rows are mark schemes and transcripts) and show it beside the answers, or mark with AI.
2. **The papers page offers years the database does not have**, which serves a different paper. Offer only sittings that exist.
3. Map language papers to their letter codes (Listening, Reading, Writing).
4. No Edexcel papers.
5. The deterministic marker over-awards (`src/lib/mark-scheme.ts`): typing just the last number of the model answer scores 80% or more on 620 of 653 questions worth 3+ marks. It is used for guests and when the AI call fails.
6. 482 of 658 subtopics in the topic picker have no questions, so the quiz silently serves whole-subject questions. Mastery uses a generic template for 416 of 538 topics.
7. Streaks and the daily goal never move from quizzes (`recordActivity()` is only called from flashcards and the timer; `api/achievements` hard-codes `streak: 0`).
8. Diagnosis labels question *i* with topic *i*, so the "weak topics" are mostly wrong.
9. Finishing a past paper saves no result and awards no XP.
10. 11+ content quality (above). `src/data/exam-levels.ts` defines levels but nothing imports it.
11. Paper totals are inflated because null marks count as 1 (84 shown for an 80-mark paper).

*UI*
12. The phone-layout changes were not checked on a real phone. Still open from the review: the drawing canvas is tiny on phones, the floating tutor button overlaps the mobile nav, small low-contrast text in places, "Practice" used as a verb, and a failed quiz load appears as a question.

*Security*
13. A teacher can add any user to their class by raw user id (`classes/[id]/members`), then see that child's name, email and activity. `assignments/[id]/progress` has no class-membership check. Needs the teacher role, which is admin-granted today.
14. `api/friends`: `ILIKE` wildcards, an account-exists oracle by email, and it creates the target's profile.
15. Class join codes are 6 characters from `Math.random` with no attempt limit.
16. Classroom OAuth callback trusts `state` as the user id (dormant: Google OAuth is not configured).
17. Raw `err.message` is returned at about 30 sites; `drive_file_id` still reaches the client; `parent/[token]` runs `ALTER TABLE` on every request; `public/sw.js` caches signed-in pages; no CSP except on `/api/paper-pdf`.
18. The rate limiter is in-memory per server instance, so limits are approximate.
19. Unverified: `parent/[token]` and `classes/performance` select `score_correct` / `score_total`, but `db/schema.sql` defines `score` / `total`. They may return 500.

**Deliberate behaviour changes:** guests can no longer play online games or see the global leaderboard; both need sign-in now.

---

## Open items from the 13 Nov code review

Each was checked against the code, and none is urgent:

- **Medium — raw Drive file ids still reach the client.** `api/past-papers` and `api/questions` return `drive_file_id`, and the paper page uses it to decide whether to show the PDF button.
  - Nothing accepts a raw id, so this can't be exploited while the folder stays Restricted.
  - Fix: return a `has_pdf` boolean instead.
- **Medium — memory.** `downloadPdfBuffer` buffers the whole file with no size cap.
  - `paper-pdf` and `paper-page` keep separate 8-entry caches, and `paper-pagecount` doesn't cache at all.
  - Fix: check Drive `size` first and refuse anything over about 25 MB, stream the response, and share one cache in `drive.ts`.
- **Medium — the same-subject fallback** in `past-paper-match.ts` can pick a different tier or year (it shows a "closest available paper" notice).
  - Also, when tier is null, the footer pattern matches `/1F`, `/1H` and `/11`–`/19` alike.
- **Low — raw error text returned to the client.** `paper-page`, `paper-pagecount`, `past-papers` and `questions` return `err.message`.
  - A non-UUID `id`, or a NaN `limit`/`offset`, makes Postgres errors show as a 500.
  - Fix: reuse `UUID_RE` from `paper-pdf` and return generic errors.
- **Low — `/api/download-paper`** has no auth and fetches with `redirect: 'follow'`. An open redirect on an allowlisted exam-board host could become SSRF.
  - Fix: add `auth()` and `redirect: 'manual'`.

---

## Constraints (do not violate)

- Never print or commit secrets, connection strings, the service-account JSON or the test-account password.
- Never restore `/api/debug-role` or any route that lets a user change their own role.
- Do not force-push. Change GoDaddy DNS only as listed above, and only when Paul is ready.
- Do not spend money or enable Google Cloud / Vercel / Neon billing without asking Paul first.
- Do not copy PII tables. Do not reset or rotate any database password.
- Do not point the live app at Ethan's database. Do not deploy to the old `educate-app` Vercel project.
- Never set PAPERS to "anyone with the link".
- Use UK English in user-visible strings.

---

## Standing product debt (still open)

1. Dependency vulnerabilities:
   - `@clerk/nextjs` has a middleware bypass in 7.0.0–7.2.3; 7.0.7 is installed.
   - `next` is at 16.2.1; the fixes are in 16.4.6.
   - After upgrading those, run `npm audit fix`.
2. April 2026 audit items, still open:
   - Classroom OAuth `state`
   - the unauthenticated non-AI path in `/api/check`
   - client-side teacher layout checks
   - `game` PATCH ownership
   - unsanitised Mermaid/KaTeX
   - the in-memory rate limiter
3. A Clerk production instance, once DNS is live.
4. The privacy policy still says Supabase. It should say Neon (EU/London), Clerk, Anthropic, Vercel and Google Drive.
5. 56 TypeScript errors are hidden by `ignoreBuildErrors: true`.
6. Teacher onboarding: teachers must create a school before they can create classes.
7. Mastery pathways show "coming soon".
8. Request-time DDL in routes should move into `db/schema.sql`.
9. Optional: fix the GitHub repo homepage URL (it points to the dead `educate-swart`).

---

## How to retest

Sign in as Test Student at https://educate-virid.vercel.app/login. A new device needs the yopmail code.

1. Go to `/AQA/Mathematics/papers` and choose Paper 1, Higher, 2023. The card should read **On Educate: 37 questions · 84 marks**.
2. Choose Practice, then Start Paper. Check the "Paper pages · 56 pages" strip appears and the questions are Maths.
3. Open **PDF Figures**.
   - A browser with a PDF viewer shows the PDF.
   - With the viewer off (`chrome://settings/content/pdfDocuments` → Download), or on Android, it shows page images.
   - It should never show a Google "You need access" page.
4. Signed out, `/api/paper-pdf?id=697178d1-067b-42c6-a51f-812b31176f94` must return **401**. So must `paper-page`, `paper-pagecount`, `past-papers` and `questions`.
5. Foundation 2023 should load 40 questions, 80 marks, and still be Maths.
