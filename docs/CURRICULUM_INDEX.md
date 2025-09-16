# Curriculum Index (Neutral Schema)

## Why
- Normalize different sources (e.g., StudyPug) to a stable internal model:
  - Unit(subjectId, grade, outcomes[])
  - Outcome(id, code?, title, description?)

## Data
- Store under `/data/curriculum/<source>/<country>/<subject>/<grade>.json`
- Validate against `src/domain/curriculum/index.ts` Zod schemas if loaded at runtime.

## Usage
- NELIE/engines query by (subjectId, grade) → select outcomes → generate tasks.
