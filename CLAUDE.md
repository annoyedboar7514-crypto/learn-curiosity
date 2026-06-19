@AGENTS.md

# Learn Curiosity

A daily digital mentorship platform for children in grades K–6 (ages 5–12). Each session is 20–30 minutes and follows a consistent five-step loop: a story presents a real dilemma, the child responds before seeing the outcome, the story shows realistic consequences, the AI mentor leads Socratic reflection, then the child asks anything they are curious about. Sessions end with a parent-facing summary.

The source of truth for product decisions is `docs/business-plan-proposal.docx`.

## The Five Pillars

All content — regardless of a child's archetype — is built from five core pillars, each grade-band calibrated (K–2, 3–4, 5–6) and delivered through story rather than direct instruction:

1. **Critical Thinking & Philosophical Reasoning** — asking good questions, identifying assumptions, spotting logical gaps, reasoning through cause and effect.
2. **Resilience, Character & Moral Values** — stories show realistic consequences of choices, building an intuitive (non-lectured) sense of honesty, fairness, courage, and empathy.
3. **Creativity & Vision** — children reframe problems, imagine alternate outcomes, or invent solutions before the story resolves.
4. **Communication & Persuasion** — children explain their reasoning, defend a position, and consider counter-arguments in low-stakes dialogue.
5. **Learning How to Learn** — metacognition and systems thinking; children notice their own thinking and how pieces connect to larger systems.

## The Mentor & Archetype System

On signup every child takes a short visual quiz that sorts their interests into one of six unified archetypes (open to any child regardless of gender):

| Archetype | Story world |
|---|---|
| The Explorer | Exploration, nature, adventure |
| The Astronaut | Space, science, discovery |
| The Detective | Mysteries, puzzles, evidence and reasoning |
| The Inventor / Builder | Engineering, construction, how things work |
| The Artist | Storytelling, imagination, visual and creative expression |
| The Doctor / Healer | Caretaking, biology, helping others |

The archetype sets the story world but also drives pedagogical sequencing: it identifies which pillars that archetype tends to *under-expose* a child to, and quietly increases the weighting of those pillars. Every child still works through all five pillars — the archetype never gates one out.

Each child also selects a **Mentor** character: an encouraging, curious guide who never gives the answer but asks better questions.

## What this platform is not

- Not a tutoring app or school replacement — no grade-level math, reading, or test-prep.
- Not a religious or political platform — secular, non-partisan, no contested current events.
- Not an open-ended AI companion — the mentor stays scoped to the current lesson; it does not simulate friendship or engage in unconstrained chat.

## AI Model

The platform uses **Claude (Anthropic)**. Every session runs under a scoped system prompt that fixes the mentor persona, restricts dialogue to the current lesson and the five pillars, and instructs the mentor to redirect (not ignore) any out-of-scope question. Claude was chosen for its safety-first design, built-in child-safety behavior, and reliable instruction-following within a constrained role. See `docs/business-plan-proposal.docx` §4.2 for full rationale.

## Safety Architecture

- Human-designed curriculum skeleton; AI personalizes delivery only — AI never originates moral authority.
- Age-banded prompts: K–2 sessions are more constrained and choice-driven; 5–6 sessions allow more open-ended Socratic questioning.
- Topic refusal by design: self-harm, violence, sexual content, and off-scope topics are redirected gently, never silently ignored.
- Full parent transparency: every conversation is logged and viewable on the parent dashboard — nothing hidden.
- No advertising profile: archetype/quiz data is used only for content personalization, never for behavioral advertising.
- COPPA compliance designed in from day one: minimal data collection, parental consent flows.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| AI | Claude via Anthropic API |

## Folder map

```
app/                   Next.js App Router pages and layouts
  dashboard/           Parent-facing routes: session logs, weekly reports, child profiles
lib/
  content/             Lesson skeletons, story text, archetype definitions (human-authored)
  mentor/              Mentor personas, Socratic prompt templates, Claude API client
  quiz/                Interest/archetype quiz logic and scoring
  safety/              Age-banded prompt construction, topic refusal, session logging
docs/                  Source-of-truth documents — business plan, curriculum guidelines
```

## Key conventions

- All Claude API calls go through `lib/mentor/` — never call the model directly from a route or component.
- All text shown to children must pass through the age-banded prompt construction in `lib/safety/` before being sent to the model, and session logs must be written via `lib/safety/` too.
- Parent-facing routes live under `app/dashboard/`; child-facing routes live directly under `app/`.
- Story content and lesson logic live in `lib/content/` — no hardcoded strings in components or routes.
- The five-pillar weighting logic per archetype lives in `lib/content/`, consumed by `lib/mentor/` when building session prompts.

## Running locally

```bash
npm run dev    # starts Next.js dev server on http://localhost:3000
npm run build  # production build
npm run lint   # ESLint
```
