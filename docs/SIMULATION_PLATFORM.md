# Simulation Platform (Universe)

## Principles
Experiential scenarios, safe-to-fail, meaningful debrief.

## DSL Summary
- Graph of nodes: {text|event|decision}
- Localized content per node (en, da, ...)
- Options with effects (resources/flags/score)
- Objectives + subjectMix (for analytics mapping)

See `src/features/simulator/dsl/schema.ts` for the canonical schema,
and `src/features/simulator/engine/engine.ts` for the pure engine.
