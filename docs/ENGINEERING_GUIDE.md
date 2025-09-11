# Engineering Guide

A practical overview for routes, contracts, data, and observability.

---

## Repo Layout (working areas)

- `src/features/daily-program/pages/UniverseLesson.tsx`
- `src/features/daily-program/pages/ScenarioRunner.tsx`
- `src/lib/supabaseClient.ts`
- (Legacy pages under `src/pages/*` are being retired)

---

## Routes

### Universe

- **Path**: `/universe`
- **Component**: `UniverseLesson.tsx`
- **Flow**:
  - (Optional) Generate a fresh “Universe” via Supabase Edge Function `generate-content` with a **sanitized context**
  - Display JSON for now (UI polish later)

### Scenario

- **Path**: `/scenario/:scenarioId`
- **Component**: `ScenarioRunner.tsx`
- **Flow**:
  - Compute scenario from route or query params with safe fallbacks
  - Build **sanitizedContext** (dedup, ensure `interests` array)
  - Call `generate-content` with:
    ```ts
    const sanitizedContext: Context = {
      ...computedContext,
      interests: computedContext.interests ?? [],
    };

    const payload = {
      subject: computedScenario.subject,
      ...sanitizedContext,
      // optionals:
      // scenarioId: computedScenario.id,
      // scenarioTitle: computedScenario
