# Educate — handover for Claude Code, 12 Nov 2026

> Written 12 Nov 2026, evening, Europe/London, so work can continue in Claude Code tonight.
> Lasting architecture, conventions and the standing TODO list live in [`CLAUDE.md`](../CLAUDE.md) (updated the same day). Read both.
> **Never put secret values (API keys, connection strings, passwords, OAuth tokens, service-account JSON) in this file, in `CLAUDE.md`, in git, or in chat.**

This is Paul's own copy of the UK GCSE revision app (GitHub `EMC2709/educate`). The original live app is `educate-app-zeta.vercel.app` on Ethan's (EMC2709) Vercel and Neon. Paul's copy is live at **https://educate-virid.vercel.app**.

---

## Start here tonight

The database and subject-matching are done and live. The remaining product gap is **original PDFs for signed-in students**. The code for that is on GitHub (`master`) but it is **not deployed**, and **Google credentials are not on Vercel**.

Do this, in order:

1. **Pull latest `master`** from [EMC2709/educate](https://github.com/EMC2709/educate) (`git pull origin master`). The three 12 Nov commits (`71590c2` matching, `5d15b5c` PDF stream, `41d6c91` these docs) were pushed at 17:35 Europe/London. A fresh clone of `master` already has them — no patch is needed.
2. **Create a Google Cloud service account**, enable the Drive API, and download a JSON key. Sign in as **`paulmc18@gmail.com`**, not `emcwiliam27@gmail.com` (a Grok Bot attempt on 12 Nov stopped on Google's MFA page because the console was the wrong account; nothing was created and billing was not enabled). Do not enable billing and do not spend money. If Google demands a billing account, stop and tell Paul.
3. **Share the PAPERS folder** with that service account as **Viewer** (Paul can do this; he is an editor). Do **not** set "anyone with the link" — these are official exam papers.
4. **Add `GOOGLE_CREDENTIALS_JSON`** to Vercel (Production) as the full service-account JSON. You do **not** need `GOOGLE_TOKEN_JSON` for a service account. Then **redeploy** with `vercel deploy --prod` from `educate-app/`. A git push does **not** deploy.
5. **Test** as Test Student: AQA Maths Paper 1 Higher 2023, open **PDF Figures**. The side panel should show the PDF, not a Google "You need access" page. A signed-out request to `/api/paper-pdf?id=…` must return 401.

After that, only if there is time: GoDaddy DNS (records below), then optional items at the bottom.

---

## Git

- Repo: [EMC2709/educate](https://github.com/EMC2709/educate), branch `master`.
- Local clone used for this work: `/workspace/educate-deploy` (on the Grok Bot computer). Vercel project is linked via `educate-app/.vercel/` (gitignored). **The Vercel project is not GitHub-linked:** `git push` does not deploy. Deploy with `vercel deploy --prod` from `educate-app/`, signed in as Paul (`paulmc18-4680` / `paulmc18@gmail.com`). Do **not** use or overwrite `/home/box/.vercel-ethan` (Ethan's isolated CLI).
- **`master` on GitHub is up to date** as of 12 Nov 2026, 17:35 Europe/London (`git push origin master`, `b345bec..41d6c91`). Pull it; do not apply an old patch, and **do not force-push**. Pushing still does **not** deploy educate-virid.

  | Commit | What it does | On GitHub? | On educate-virid? |
  |---|---|---|---|
  | `71590c2` | Practice paper matching by subject + sitting + paper + tier | Yes | **Yes** — deployed 12 Nov 17:04 GMT, id `dpl_AD3SRkCzd1YjaT4BC7KQTws7bxmM` |
  | `5d15b5c` | Same-origin PDF stream (`/api/paper-pdf`), service-account support in `getDrive()`, Drive iframe removed | Yes | **No** — not deployed, needs credentials first |
  | `41d6c91` | This handover, plus `CLAUDE.md` / README updates | Yes | n/a (docs only) |

- Earlier on `origin/master`: `65799e5` (removed `/api/debug-role`, added `db/schema.sql`), `ac3463c` (Anthropic model IDs), `b345bec` (docs).

---

## Platforms — current state and what to change

### Vercel (Paul)

- Team: "Paul McWilliam's projects". Project: `educate`. Framework Next.js, Node 22.x, function region `lhr1`. Root Directory is `.` because deploys are run from `educate-app/`. If the project is ever GitHub-linked, set Root Directory to `educate-app`.
- Live: https://educate-virid.vercel.app
- Currently serving the matching-fix deployment (`dpl_AD3SRkCzd1YjaT4BC7KQTws7bxmM`).
- **Env vars set:** `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED`, other Neon/Postgres vars from the Vercel–Neon integration, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_APP_URL` (intended production URL `https://educatethemasses.online`).
- **Env vars not set (do next):** `GOOGLE_CREDENTIALS_JSON` (service-account JSON for PDF streaming), and later `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Classroom, optional), `GOOGLE_TOKEN_JSON` (only if using user OAuth instead of a service account).
- `GOOGLE_DRIVE_API_KEY` is **not read by the app**. Do not rely on it.
- After adding `GOOGLE_CREDENTIALS_JSON`, you must **redeploy** for the var to take effect.

### Neon (two different databases — do not confuse them)

**A. Paul's database (the one educate-virid uses) — this is the destination.**

- Project name `educate`, id `shy-paper-14167641`, AWS eu-west-2 (London), free 1 GB plan.
- Provisioned via the Vercel Marketplace; manage it through Vercel's Neon integration.
- **Content copy completed 12 Nov 2026 16:28 UTC (Europe/London)** from Ethan's production DB, verified equal:
  - `past_papers`: 26,231
  - `questions`: 584,732
  - orphan questions: 0
  - empty `question_text` (kept as `''`): 212
  - destination size: **496 MB** (comfortable on 1 GB, but watch the limit)
  - Student, teacher and other PII tables were **not** copied. `revision_notes` was empty and was not copied.
- **Do not re-copy, do not truncate, do not rotate passwords.**

**B. Ethan's production database (the source of the papers).**

- Neon project `shiny-tooth-08089128`, reached via the **DATABASE_URL on Ethan's Vercel project** for `educate-app-zeta` (team emc2709). It is **not** visible in the Neon console org "Educate" (`org-curly-sound-07355255`, project `cool-snow-33977978`). That org has no `past_papers` / `questions` tables.
- **Do not reset or rotate** that database password. **Do not copy PII.** Do not point educate-virid at this database.

**How to query from this environment:** port 5432 (`psql` / `pg_dump`) times out (box DNS sends Neon hosts to a black hole on that port). Use `@neondatabase/serverless` over HTTPS, with the pooled `DATABASE_URL`. For DDL prefer `DATABASE_URL_UNPOOLED`. Connection strings live in `educate-app/.env.local` and `/home/box/.secrets/paul-database-url` — never print them.

### Google Drive

- Folder **[PAPERS](https://drive.google.com/drive/folders/1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9)** (`1wTYT4FwqFLTuTcY_nc-UJM7pla5PbvW9`).
- This is the **same folder** every `past_papers.drive_file_id` already points at (all 26,231 rows have a file id).
- Owner: `stuart.fosker@gmail.com`. Paul (`paulmc18@gmail.com`) is a **writer** (editor). Only those two accounts have access. The folder is private — that is why students see "You need access".
- Structure: `England` (GCSE_AQA, GCSE_OCR, GCSE_Eduqas, A-Level boards, KS1–3, 11 Plus, …), `Northern_Ireland`, `Scotland`, `Wales`.
- **What to do:** share this folder with the new service account email as **Viewer**. Inheritance should cover the files. Do **not** click "Request access" from a test session. Do **not** set "anyone with the link".
- Paul's Google Drive connector is already connected in Grok Bot (as of 12 Nov) if you need to inspect or share from there. The `share_file` tool cannot set "anyone with the link"; a Viewer grant to a named service-account email is the right grant.

### Google Cloud (create tonight)

- No `gcloud` CLI and no `scripts/credentials.json` / `scripts/token.json` were on the box when this was written. A Grok Bot attempt to create the service account on 12 Nov **did not complete**: the Cloud Console was signed in as `emcwiliam27@gmail.com` (Ethan), stopped at `https://console.cloud.google.com/enable-mfa`, and created no project, service account, or key. Billing was not enabled. Resume as **`paulmc18@gmail.com`**.
- Preferred setup: a **service account** (no user OAuth refresh tokens to expire).
  1. In [Google Cloud Console](https://console.cloud.google.com/) as `paulmc18@gmail.com`, create a project (e.g. `educate-papers`). **Do not enable billing.**
  2. Enable the **Google Drive API**.
  3. Create a service account (e.g. `educate-pdf-reader`). No special project-wide IAM is required; it will only see files shared with its email.
  4. Create a JSON key. Store it outside git, e.g. `/home/box/.secrets/educate-drive-sa.json`, chmod 600.
  5. Share the PAPERS folder with the key's `client_email` as Viewer.
  6. Set Vercel Production `GOOGLE_CREDENTIALS_JSON` to the file's entire JSON. `getDrive()` treats JSON with `type: "service_account"` (or `client_email` + `private_key`) as a service account and does not need `GOOGLE_TOKEN_JSON`. It also un-escapes literal `\n` in the private key.
- Fallback: user OAuth (`scripts/auth-drive.ts`), which needs a Desktop OAuth client, `GOOGLE_CREDENTIALS_JSON` + `GOOGLE_TOKEN_JSON`. Prefer the service account.

### Clerk

- Sign-in is at **`/login`**. `/sign-in` is a 404.
- This is still the **original app's DEVELOPMENT instance** (`pk_test`). The "Development mode" badge shows; new-device sign-ins email a verification code. A production Clerk instance is a later task (CNAMEs at GoDaddy, `pk_live`/`sk_live`, own Google OAuth, users must be recreated).
- Test Teacher: `testteacher@yopmail.com` (role `teacher`). Test Student: `teststudent11@yopmail.com` (role `student`, no org). Passwords are **not** in this file. They are in the seed script `scripts/seed-test-users.ts` (`findOrCreateUser`) and `/workspace/educate-test-accounts.txt`. **Ignore the script's console.log and comments that say `Test1234!` — that password is stale and wrong.** yopmail inboxes are public.
- Roles live in `profiles.role`, not in Clerk. To grant Paul `super_admin`: he signs up, then `UPDATE profiles SET role = 'super_admin', updated_at = now() WHERE user_id = 'user_...';` in Paul's Neon. **Never restore `/api/debug-role`.**

### GoDaddy (waiting on Paul)

- Domain: `educatethemasses.online`, registered 11 Nov 2026. Attached and verified in Vercel. **DNS is still pending.** Do not change records except to add these:

  - A `@` → `216.150.1.1` and `216.150.16.1`
  - CNAME `www` → `7696e975a7890719.vercel-dns-016.com`

- `www` should then 308 to the apex. After DNS works, set Clerk production CNAMEs if/when moving off the dev instance.

### GitHub

- The 12 Nov commits are on `master` (see [Git](#git)). Repo homepage still mentions a dead URL (`educate-swart`). Optional cleanup.
- Do not force-push. Do not commit env files or secrets.

### Anthropic

- Already updated (commit `ac3463c`), live:
  - Marking / generation / revision notes: `claude-haiku-4-5-20251001`
  - Tutor / topic chat / study tools: `claude-sonnet-4-5-20250929`
- `/api/check` falls back to deterministic marking if the AI call fails, so a bad model ID fails **silently**. Check logs.

---

## What was completed on 11–12 Nov 2026

### 11 Nov — Paul's copy stood up

- Local clone patched: `/api/debug-role` removed, `db/schema.sql` added, Anthropic model IDs updated, docs refreshed.
- Deployed to Vercel project `educate` as https://educate-virid.vercel.app. Clerk, Neon and Anthropic wired. Test Teacher and Test Student seeded (11 Nov 20:05 UTC). Past papers were empty at that point.

### 12 Nov — past-paper content

- After signing in as Ethan on Vercel, the real source `DATABASE_URL` was used **read-only** to copy `past_papers` then `questions` into Paul's Neon over HTTPS (`@neondatabase/serverless`, batched `json_to_recordset`, `ON CONFLICT DO NOTHING`). PII was not copied.
- Verification: counts equal, 0 orphans, 496 MB. Safe note: `/workspace/educate-content-copy-verify.txt`.

### 12 Nov — practice subject-matching bug (fixed and live)

- **Symptom:** Test Student chose AQA Maths Paper 1 Higher 2023 and got Combined Science Trilogy mark-scheme text ("1 iron, steel, tin 1"). The intro said 25 questions / 110 marks (static index) but 14 questions / 15 marks loaded. The API itself was fine (100 AQA papers, including Maths 2023).
- **Cause:** `/[board]/[subject]/papers` fetched `/api/past-papers?examType=GCSE_AQA&limit=100` with **no subject**, then picked a paper **by year only**. The first 2023 row was often Combined Science. Database columns cannot be relied on for matching: of 785 AQA Maths papers, 780 have a null year, and none store a paper number or tier (there is no tier column). Titles are often SHA-like hashes.
- **Fix (commit `71590c2`, live):**
  - New `src/lib/past-paper-match.ts` (+ `past-paper-match.test.ts`, 5 tests, passing).
  - `/api/past-papers?resolve=1&examType&subject&yearLabel&paperNumber&tier&component` looks a paper up. The list `subject` filter accepts mapped UI names as well as DB names.
  - The papers page shows "On Educate: N questions · M marks" for the bound paper and passes its id through sessionStorage.
  - Practice uses the same lookup if no id is passed, and starts in a loading state so sample questions do not flash first. A notice is shown for a same-subject fallback.
  - **Matching order (never across subjects):**
    1. Subject-name aliases (e.g. Combined Science → Combined Science Trilogy; Business Studies → Business; Religious Studies → Religious Studies A; plus OCR A/B suites — see the source file).
    2. Exact match on sitting (2023 = June, "Nov 2023" = November) + paper number + tier, using the exam code in question text, e.g. `IB/M/Jun23/8300/1H`. Combined Science also uses B/C/P for the component. Among matches, the complete paper with the most rows wins.
    3. Year-column match, excluding papers whose footer code disagrees.
    4. Same-subject fallback with an on-screen notice; otherwise the built-in sample questions.
  - Intro question-count and marks now come from the bound DB paper. Duration still comes from the static index (the DB has none).
- **Retest (passed):** AQA Maths Paper 1 Higher 2023 → 37 questions, 84 marks, real Maths ("Work out 0.7 × 0.5", "Sunita is x years old…", simultaneous equations). Foundation 2023 → 40 questions, 80 marks, still Maths. No Combined Science.
- **Useful ids (AQA Maths 2023 P1 Higher, exact match):** `697178d1-067b-42c6-a51f-812b31176f94` (37 rows, 84 marks after clamp, footer `Jun23/8300/1H`). This is the **enlarged (modified) paper**; the standard version `f96480cb…` has only 26 rows so the more complete one was chosen. Older id `af765a74…` (title hash `089f8c92…`) claims 21 questions but has 0 rows and is never served. "Ashley picks three of the discs" is the **2017** paper, not 2023.
- **Limits:** lookup scans question text (~0.4–1.6s, cached 5 minutes). Boards without these footer codes (OCR, WJEC, Eduqas, some AQA subjects such as English Language) fall back to same-subject with a notice. There are **no `GCSE_Edexcel` rows**. Some stored questions are badly parsed (pre-existing).

### 12 Nov — PDF stream (coded, not live)

- Commit `5d15b5c`. Files:
  - `src/lib/drive.ts` — service account **or** OAuth.
  - `src/app/api/paper-pdf/route.ts` — `GET /api/paper-pdf?id=<paperUuid>`: Clerk auth, UUID only, looks up `drive_file_id` from `past_papers` (**never** accepts a raw Drive file id from the client), streams `application/pdf` inline, `Cache-Control: private, max-age=3600`. 401 / 400 / 404 / 502 as appropriate. Node runtime, `maxDuration` 60s. Same small in-memory PDF cache as `paper-page`.
  - `src/app/[board]/[subject]/paper/page.tsx` — side-panel iframe and "Open" link now use `/api/paper-pdf?id=${paperDbId}`. **Nothing in `src/` points at `drive.google.com` any more.** Existing `/api/paper-page` PNG thumbnails are unchanged and will start working once credentials are set.
  - `QuestionCard` "View original paper" now uses `/api/paper-pdf?id=<paper_id>` (the old `/api/download-paper?fileId=` link was already broken; `download-paper` only proxies allowlisted exam-board URLs). `/api/questions` now returns `paper_id`.
- Download Paper / Download Mark Scheme on the papers page still go through `/api/download-paper?url=` to official board sites — leave those alone.
- **Noticed, not changed:** `/api/paper-page` sends PNGs with `Cache-Control: public, max-age=31536000, immutable`, so a CDN could serve page images to signed-out visitors after the first signed-in load. Prefer `private` if they should stay auth-only. `/api/past-papers` has a similar pre-existing `public, s-maxage=300` header.

---

## Constraints (do not violate)

- Never print or commit secrets, connection strings, or the test-account password.
- Never restore `/api/debug-role` or any route that lets a user change their own role.
- Do not force-push. Do not change GoDaddy DNS except the records listed above, and only when Paul is ready.
- Do not spend money or enable Google Cloud / Vercel / Neon billing without telling Paul first and getting a yes.
- Do not copy student/teacher/PII tables. Do not reset or rotate Ethan's (or Paul's) database password.
- Do not overwrite Paul's default Vercel CLI with Ethan's, or vice versa.
- Do not point the live app at Ethan's database.
- UK English for user-visible strings.

---

## Standing product debt (from CLAUDE.md, still open)

1. Dependency vulnerabilities: upgrade `@clerk/nextjs` (middleware bypass in 7.0.0–7.2.3; installed 7.0.7) and `next` (16.2.1; fix in 16.4.6), then `npm audit fix`.
2. Other security items from the April 2026 audit (Classroom OAuth `state`, `/api/check` unauthenticated non-AI path, client-side teacher layout checks, `game` PATCH ownership, unsanitised Mermaid/KaTeX, in-memory rate limiter).
3. Clerk production instance, once DNS is live.
4. Privacy policy still says Supabase; it should say Neon (EU/London), Clerk, Anthropic and Vercel.
5. 56 existing TypeScript errors hidden by `ignoreBuildErrors: true` (not introduced by the 12 Nov commits). Fix them, then remove the flag.
6. Teacher onboarding (must create a school before classes). Mastery "coming soon". Request-time DDL should move into `db/schema.sql`.
7. Optional: GitHub repo description / homepage URL; `super_admin` for Paul after he signs up.

---

## How to test after the PDF deploy

Sign in as Test Student at https://educate-virid.vercel.app/login (not `/sign-in`).

1. Open https://educate-virid.vercel.app/AQA/Mathematics/papers — Paper 1, Higher, 2023. Card should read **On Educate: 37 questions · 84 marks**, with no "closest available paper" notice.
2. Practice: intro 37 questions, 84 marks, 1hr 30min; Maths questions, not Combined Science.
3. **PDF Figures:** the side panel should show the original PDF (streamed from `/api/paper-pdf?id=697178d1-067b-42c6-a51f-812b31176f94`). No Google Drive "You need access".
4. Signed-out `curl` of that PDF URL must be **401**.
5. Foundation 2023 should still be 40 questions / 80 marks and still Maths.
