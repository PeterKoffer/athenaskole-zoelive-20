# Assistant Brief

updated: 2025-09-11
branch: New-core-map

## Daglig boot (læses først)
- Læs `docs/RULES.md`.
- Bekræft at aktiv branch = `New-core-map`.
- Åbn `docs/DEVLOG.md` (øverste sektion) og noter blokere/opgaver.
- Kør app lokalt (se “Dev kommandoer”) og sanity-check `/universe`.

## Redigerings-protokol
- Lever ALTID hele filer til copy/paste (ingen diff). Ingen inline-kommentarer i kodeblokke.

## Nuværende fokus
- UniverseLesson: “Generate New Universe” via Supabase Edge Function `generate-content`.
- ScenarioRunner: route `/scenario/:scenarioId` render (midlertidigt JSON).
- Dedupe payloads via `sanitizedContext` (ingen duplikerede keys).

## Vigtige routes
- `/universe` → `UniverseLesson`
- `/scenario/:scenarioId` → `ScenarioRunner`

## Backend
- Supabase Edge Function: `generate-content`

## Dev kommandoer
- Start: `npm run dev`
- Typecheck: `npm run typecheck`

## Principper (performance & skala)
- Forbered præ-generering ved dagstart.
- Provider-agnostisk LLM-lag (nemt at skifte udbyder).
- Fallback-indhold ≥ 500 skoledage (ingen gentagelser per elev).

## Åbne spørgsmål
- Skal “senest genererede universe” gemmes på profil?
