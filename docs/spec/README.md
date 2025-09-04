# Product Spec — ZoeLive (Core Overview)

## Goals
- AI-powered K–HS school platform with adaptive tutoring (NELIE), two learning modes:
  - **Daily Program (Universe)**: cross-subject, story-driven day/week missions.
  - **Training Ground**: targeted practice per subject/skill.
- Curriculum-based generation (initial mapping from StudyPug, but source-agnostic).
- Multilingual UX (EN → DA first), age-appropriate safety.

## Global Adaptation Parameters (MUST always be considered)
- Subject
- Student Grade (K–10 + HS)
- (National) Curriculum for that subject
- School Leader perspective (teaching philosophy)
- Lesson duration (per day, per class) from Teacher Dashboard
- Subject weights (AI content prefs) from Teacher Dashboard
- Calendar keywords
- Calendar duration/window
- Student abilities/level/reactions
- Student learning style
- Student interests

## The 12 Subjects
1. Native language  2. Mathematics  3. Language lab  4. Science  
5. History & Religion  6. Geography  7. Computer & Technology  
8. Creative arts  9. Music discovery  10. Physical education  
11. Mental Wellness  12. Life Essentials

## Two Modes
- **Daily Program / Universe**: scenario/simulation that blends multiple subjects.
- **Training Ground**: focused drills and remediation per subject/outcome.

See more detail in:
- `docs/spec/NELIE.md` (tutor orchestration & voice)
- `docs/spec/Simulation.md` (scenario DSL, engine, debrief)
- `docs/spec/CurriculumIndex.md` (neutral curriculum schema + mapping)
- `docs/spec/i18n.md` (i18n keys, fallbacks, content rules)
