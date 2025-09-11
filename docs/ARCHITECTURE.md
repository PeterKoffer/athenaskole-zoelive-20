# Architecture & Structure

## App-lag (high level)
- `features/` per domæne
  - `daily-program/pages/UniverseLesson.tsx`: UI til at generere dagens universe via `generate-content`.
  - `daily-program/pages/ScenarioRunner.tsx`: Kører scenarie, kalder samme edge-funktion med kontekst.
- `services/`: API-klienter og forretningslogik (plan: provider-agnostisk LLM-lag).
- `lib/`: klienter (fx `supabaseClient`).
- `docs/`: regler, brief, log, roadmap.

## Dataflow (Universe)
UniverseLesson → konstruerer `sanitizedContext` → `supabase.functions.invoke("generate-content")` → modtager universe JSON → visning (midlertidigt JSON dump; senere pænt UI).

## Dataflow (Scenario)
ScenarioRunner → beregner scenarie + `sanitizedContext` → `generate-content` → viser output (midlertidigt JSON).

## Provider-agnostisk plan (LLM)
- Interface i `src/services/llm/Provider.ts` (fx `generateContent(payload): Promise<...>`).
- Implementeringer: `OpenAIProvider`, `EdgeFunctionProvider` (Supabase), senere billigere alternativer.
- Valg via env/konfiguration.

## Performance
- Pre-warm/pre-generate ved opstart af skoledag.
- Cache & deduplikering i backend.
- Fallback content (min. 500 dage) klar til øjeblikkelig levering.

## Universes & Training Ground
- Universe: story-ramme, karakterer, lokationer, daglige aktiviteter.
- Training Ground: målrettede opgaver/øvelser, hurtig levering, ingen repetition.

## Routing
- `/universe`, `/scenario/:scenarioId`
- `src/App.tsx` definerer routes.

## Standardmønstre
- `sanitizedContext` før API-kald (ingen duplikerede keys).
- Hele-fil-udskiftning ved ændringer.
