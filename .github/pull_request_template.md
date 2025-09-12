## Summary
<!-- What does this PR change? -->

## Checklist (must consider or justify N/A)
- [ ] Uses `AdaptationParams` (mode, subject, grade, curriculumId).
- [ ] Respects School Leader perspective.
- [ ] Uses Teacher subject weights & lesson durations if relevant.
- [ ] Considers Calendar (keywords/window) where relevant.
- [ ] Adapts to abilities/learning style/interests when applicable.
- [ ] i18n keys only (no hardcoded UI text).
- [ ] Does not break NELIE orchestration assumptions.
- [ ] Simulation content follows DSL (if adding/altering scenarios).
- [ ] ## Hvad gør denne PR?
- [ ] Porter filer fra `main` til `New-core-map` (ikke omvendt)
- [ ] Ingen ændringer direkte på `main`
- [ ] Én Supabase-klient (ingen nye `createClient(` i frontend)
- [ ] Én NELIE-instans (ingen nye `<NELIE />` mounts)
- [ ] Ruter peger på `ScenarioRunner` i New-core

## Test
- [ ] `npm run dev` grønt
- [ ] Smoke: /scenario/:scenarioId og /daily-program

