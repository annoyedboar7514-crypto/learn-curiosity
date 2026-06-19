@AGENTS.md

# Learn Curiosity

A K–6 mentorship platform that combines Socratic AI dialogue, archetype-based stories, and a parent dashboard to nurture curiosity-driven learning in children aged 5–12.

## What this app does

- **Socratic AI dialogue** — an AI mentor that asks questions rather than giving answers, guiding children to think through problems themselves.
- **Archetype-based stories** — narrative content organized around universal character archetypes (the Explorer, the Inventor, etc.) that children pick as their "guide."
- **Quiz system** — short, low-stakes knowledge checks embedded in story sessions.
- **Parent dashboard** — parents review session summaries, curiosity scores, and topic interests surfaced by the AI.
- **Safety layer** — content filtering and guardrails specific to a K–6 audience (no adult content, no personally identifying questions, age-appropriate language only).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Runtime | Node.js (Edge-compatible where possible) |

## Folder map

```
app/                   Next.js App Router pages and layouts
  dashboard/           Parent dashboard routes
lib/
  content/             Story content, archetype definitions, copy
  mentor/              Socratic dialogue logic, prompt templates, AI client
  quiz/                Quiz generation, scoring, result types
  safety/              Content filtering, age-gating, guardrail utilities
docs/                  Design notes, research, content guidelines
```

## Key conventions

- All AI calls go through `lib/mentor/` — never call the model directly from a route or component.
- All text shown to children must pass through a `lib/safety/` filter before rendering.
- Parent-facing routes live under `app/dashboard/`; child-facing routes live directly under `app/`.
- Content (story text, archetype data) is authored in `lib/content/` and imported by routes — no hardcoded strings in components.

## Running locally

```bash
npm run dev   # starts Next.js dev server on http://localhost:3000
npm run build # production build
npm run lint  # ESLint
```
