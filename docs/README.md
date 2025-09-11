# AthenaSkole – New-core-map

This branch is the **active development line**. Work happens here first, then we selectively bring in pieces from `main`.

## Quick Start

- Node: 18+ (works on 22 too)
- Install: `npm i`
- Run dev: `npm run dev` → open http://localhost:5173
- Typecheck: `npm run typecheck`
- Lint (staged): via Husky/lint-staged on commit (may be temporarily limited by `.eslintignore`)

## Key Routes (current focus)

- **/universe** → UniverseLesson (generate + view a daily learning universe)
- **/scenario/:scenarioId** → ScenarioRunner (invokes Supabase Edge Function `generate-content` with a sanitized context)
- (Legacy) Some older pages exist under `src/pages/*` – we’re migrating into `src/features/*` with clear ownership.

## Architecture at a Glance

- **Front-end:** Vite + React + Tailwind + shadcn/ui
- **Backend edge:** Supabase Edge Functions (e.g. `generate-content`)
- **Data:** Supabase (profiles, content, logs)
- **AI Abstraction:** current: OpenAI; design goal: provider-agnostic swap (minimize vendor lock-in)

## Two Learning Modes

- **Universe** – storyworld, characters, locations, high engagement; generated at day start or ahead of time to minimize latency.
- **Training Ground** – structured practice, templates & generators, mastery tracking, fast fallback content.

## The NELIE Assistant (in-app tutor)

NELIE is the chat/voice assistant that adapts to learner strengths/weaknesses and guides them through scenarios and practice. It can:
- converse (text/voice), explain, scaffold
- adjust difficulty and modality
- reference the current Universe/Scenario context
- log decisions & outcomes for debrief and analytics

## How We Work (daily)

See `docs/ASSISTANT_BRIEF.md` for the full **Daily Boot Checklist** and **Standing Rules**. In short:
- Always work on **New-core-map** unless we explicitly say otherwise.
- I (the assistant) provide **full file replacements** for edits so you can copy/paste into GitHub.
- We aim for **speed, stability, and zero learner wait** with pre-generation + large fallback pools.

## Where to Read Next

- **Rules & Daily Boot:** `docs/ASSISTANT_BRIEF.md`
- **Product & Pedagogy (NELIE + Simulator):** `docs/PRODUCT_SPEC.md`
- **Engineering (routes, Edge contracts, data & observability):** `docs/ENGINEERING_GUIDE.md`

> Legacy long-form docs from `main` are preserved under `docs/legacy/` for reference. The guide summarises and links to them.

