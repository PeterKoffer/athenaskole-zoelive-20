# Assistant Brief & Daily Boot

This file tells the assistant (me) how to start every day and how we collaborate.

---

## Daily Boot Checklist

1. **Pull latest** on `New-core-map`.
2. **Skim the codebase quickly** (focus: `src/features/daily-program/*`, routes, Edge function usage).
3. **Read this brief + PRODUCT_SPEC + ENGINEERING_GUIDE**.
4. **Run** `npm run dev`, verify `/universe` and `/scenario/:id`.
5. **Check blockers** (type errors, ESLint, runtime errors).
6. **List concrete next steps** (visible wins first).
7. **Produce edits as full-file replacements** ready to paste in GitHub.
8. **Log** decisions & open questions in `docs/DEVLOG.md` (optional).

---

## Standing Rules (working agreement)

1. **Always confirm branch**: we work on **New-core-map** by default.
2. **Edits are full-file replacements**: I will always deliver a **single code block with the entire file**. You copy/paste into GitHub Web Editor unless we agree otherwise.
3. **No chatter inside code**: Explanations go **outside** the code block. Code blocks contain **only code**.
4. **Give explicit instructions**: I will say *what to do*, *where to do it*, and *how* (Terminal vs GitHub UI). I’ll break things into steps.
5. **Calendar**: I can’t access your Mac calendar directly. If you want reminders, we’ll track them in `docs/DEVLOG.md` or a lightweight task doc.
6. **Tooling in play**: OpenAI, Supabase, GitHub (web & dashboard), Lovable.dev, Grok, Qwem, MPX.com, Docker Desktop, Terminal, Cursor.
7. **Design to the app structure**: All suggestions honor the current architecture and future features we plan to bring from `main`.
8. **Performance first**: Reduce latency; pre-generate at day start; stream results; aggressive caching; serve fallbacks instantly.
9. **Provider swap**: Keep AI usage abstract so we can switch providers post-launch for cost/perf.
10. **Fallback content**: Maintain **≥ 500 school days** of ultra-fast fallback lessons so learners never hit duplicates unless in planned review.
11. **Two modes**: **Universe** (narrative) and **Training Ground** (drills) drive all UX and code paths.
12. **I read the rules/docs every morning** so I don’t ask you to repeat requirements.
13. **Add to the rules**: If we spot gaps, we add them here so a fresh assistant can pick up the project any day.
14. **Proactive ideas**: I’ll bring small, realistic improvements or relevant trends (AI tutors/simulations) that fit our constraints.

---

## Hand-off Protocol for Code Changes

- You say “replace **this** file”.
- I reply with a single **full-file code block**.
- You paste into GitHub Web Editor on **New-core-map** and commit.

That’s it.
