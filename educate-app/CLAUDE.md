@AGENTS.md

# Educate — GCSE Revision Platform

## What this project is
AI-powered GCSE revision app for UK students. Next.js 16 + Tailwind CSS v4 + TypeScript. Supports all 4 UK exam boards (AQA, Edexcel, OCR, WJEC) across 26 GCSE subjects.

## Tech stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: Anthropic Claude API via `@anthropic-ai/sdk` (server-side only)
- **Math**: KaTeX for LaTeX formula rendering
- **Diagrams**: Mermaid.js for flowcharts/process diagrams
- **Auth**: Auth.js v5 (NextAuth) with Microsoft Entra ID + Google SSO
- **Validation**: Zod for API request validation

## Project structure
```
educate-app/
  src/
    app/                    # Next.js App Router pages
      page.tsx              # Home — exam board selection
      login/page.tsx        # SSO login page
      [board]/page.tsx      # Subject selection
      [board]/[subject]/    # Question type → topics → quiz flow
      api/                  # Server-side API routes
        generate/           # AI question/flashcard generation
        check/              # AI answer marking
        chat/               # AI tutor chat
        auth/               # NextAuth handlers
    components/
      layout/               # Navbar, ChatPanel, UserMenu
      home/                 # BoardCard
      subjects/             # SubjectCard
      topics/               # TopicRow (tree with checkboxes)
      quiz/                 # QuestionCard, AnswerInput, FeedbackPanel
      flashcards/           # FlashcardDeck, FlashcardCard (3D flip)
      ui/                   # Button, Badge, Checkbox, ProgressBar, MessageContent, MermaidDiagram
    data/
      question-bank/        # 26 per-subject .ts files with curated questions
      subtopic-bank/        # 4 subjects (maths, bio, chem, physics) with granular subtopic questions
      exam-boards.ts        # Board configs (AQA, Edexcel, OCR, WJEC)
      subject-topics.ts     # Full topic/subtopic tree for all subjects
      question-types.ts     # Short, mid, long, flashcard configs
      subject-icons.ts      # Emoji icons per subject
    hooks/
      useTopicSelection.ts  # Topic expand/select/toggle state
    context/
      ChatContext.tsx        # AI tutor chat state (shared across pages)
      AuthContext.tsx        # Auth.js SessionProvider wrapper
    lib/
      anthropic.ts          # Server-side Anthropic client
      prompts.ts            # All prompt templates (generate, check, chat)
      shuffle.ts            # Fisher-Yates shuffle
      question-helpers.ts   # Bank lookup helpers
    types/index.ts          # All TypeScript interfaces
    auth.ts                 # Auth.js config (Microsoft + Google providers)
    middleware.ts           # Route protection (API routes require auth)
```

## Key patterns
- **Free tier without login**: Question bank, flashcards, topic selection all work without auth
- **Auth required for AI**: Chat, answer marking, AI generation need sign-in (middleware protects API routes)
- **MessageContent component**: Parses AI responses for `$LaTeX$`, `$$display math$$`, ` ```mermaid ``` ` diagrams, `**bold**`, and `` `code` ``
- **Question bank fallback**: Tries static question bank first (instant), falls back to AI generation if not enough questions
- **Session storage**: Topic selections stored in sessionStorage between topics page and quiz page

## How to run
```bash
cd educate-app
npm install
cp .env.example .env.local  # Then add your API keys
npm run dev                  # http://localhost:3000
```

## Environment variables needed
- `ANTHROPIC_API_KEY` — Required for AI features. Get from console.anthropic.com
- `AUTH_SECRET` — Generate with `npx auth secret`
- `AUTH_MICROSOFT_ENTRA_ID_ID/SECRET` — Optional, for Microsoft SSO
- `AUTH_GOOGLE_ID/SECRET` — Optional, for Google SSO

## What's been built
- Full question bank (500+ questions across 26 subjects)
- AI question generation, answer marking, chat tutor
- KaTeX math rendering + Mermaid diagram rendering in chat
- Flashcard deck with 3D flip animation
- Topic/subtopic multi-select tree
- Mobile-responsive (single column on mobile, chat becomes drawer)
- Microsoft + Google SSO login page (needs OAuth credentials to activate)
- Pitch deck (Educate_Pitch_Deck.pptx)
- Market research (GCSE_REVISION_MARKET_RESEARCH.md)
- Calday Grammar case study (Calday_Case_Study.md)

## What still needs work
- Login page routing: `/login` may conflict with `[board]` dynamic route — needs testing
- SSO: OAuth credentials need registering with Microsoft Azure and Google Cloud Console
- Spaced repetition engine for flashcards
- Smart study planner with exam countdown
- Offline PWA mode
- Teacher dashboard & school licensing
- Parent progress summaries
- Gamification (streaks, XP, leaderboards)
- Past paper integration
- Progress persistence (localStorage or database)

## Important notes
- API key is SERVER-SIDE ONLY (in .env.local, never sent to browser)
- `params` and `searchParams` are Promises in Next.js 16 (use `use()` to unwrap)
- Middleware file convention is deprecated in Next.js 16 — may need migration to "proxy"
- The original monolithic file is `educate-v4.jsx` in the root folder (kept for reference)
