# Educate: GCSE Revision Platform

AI-assisted GCSE revision for UK students: question practice, flashcards, mastery pathways, an AI tutor and AI marking across AQA, Edexcel, OCR and WJEC (26 subjects). It also has teacher, school and parent features. Guests can practise from the built-in question bank without signing in.

**Live:** https://educate-virid.vercel.app (custom domain https://educatethemasses.online, pending DNS)

## Stack
Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Clerk (auth) · Neon Postgres · Anthropic Claude · Vercel

## Getting started
```bash
cd educate-app
npm ci
cp .env.example .env.local     # fill in values (or: vercel env pull .env.local)
npm run dev                    # http://localhost:3000
```
Required env vars: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ANTHROPIC_API_KEY`. See `.env.example` for all of them and where to get each.

### Database
For a fresh Neon database, apply `db/schema.sql` (idempotent). The question bank ships in `src/data/`, so the DB only holds users, progress, classes, flashcards and the scraped past papers.

### Scripts
```bash
npm run build                  # production build (note: TS errors are ignored by next.config.ts)
npx tsc --noEmit -p .          # real type check
npm test                       # vitest
npx tsx scripts/seed-test-users.ts          # test teacher/student (needs Clerk + DB)
npx tsx scripts/process-past-papers.ts      # past-paper scraper (needs Google Drive + Anthropic)
```

## Roles
`student` (default), `teacher`, `school_admin`, `super_admin`, stored in `profiles.role`. The first super_admin is granted with a manual SQL update in the Neon console. See `CLAUDE.md`.

## Deployment
Vercel project `educate`, deployed with `vercel deploy --prod` from `educate-app/` (not Git-linked). Database: Neon project `educate` (London).

## More
- `CLAUDE.md`: full architecture, conventions, deployment details and the prioritised TODO list
- `docs/HANDOVER-ETHAN.md`: April 2026 handover (historical; partly stale)
