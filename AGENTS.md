# AGENTS.md

## Formål
Kilde-of-truth for, hvordan NELIE’s agenter arbejder: **Content Agent**, **Simulator Agent**, **Image Agent** og **QA/Validation Agent** – inkl. inputs,$

---

## Agent-oversigt

### Content Agent
- Genererer indhold til **Daily Program** og **Training Ground**.
- Bruger de **11 parametre** (se nedenfor).
- Output SKAL følge JSON-skema (se `src/types/...`), ellers retry → fallback.

### Simulator Agent
- Driver interaktive scenarier/spil og progression.
- Samme parametre; fokus på opgaver, events og progression.

### Image Agent
- Genererer cover/scene-billeder for universer.
- Provider styres via `IMAGE_PROVIDER` (fx `replicate`).
- Path-format: `/universe-images/{universeId}/{gradeInt}/cover.webp`.

### QA/Validation Agent
- Validerer at JSON matcher schema.
- Logger session-id, parametre og output til Supabase (debug).
- Trigger fallback ved valideringsfejl.

---

## Routing & Auth
- **Efter login**:
  - Elev → `/daily-program`
  - Lærer → `/teacher-dashboard`

^G Get Help              ^O WriteOut              ^R Read File             ^Y Prev Pg               ^K Cut Text              ^C Cur Pos               
^X Exit                  ^J Justify               ^W Where is              ^V Next Pg               ^U UnCut Text            ^T To Spell              
# AGENTS.md

## Formål
Kilde-of-truth for, hvordan NELIE’s agenter arbejder: **Content Agent**, **Simulator Agent**, **Image Agent** og **QA/Validation Agent** – inkl. inputs, prompts, routing, miljøvariabler, fallback og tests.

---

## Agent-oversigt

### Content Agent
- Genererer indhold til **Daily Program** og **Training Ground**.
- Bruger de **11 parametre** (se nedenfor).
- Output SKAL følge JSON-skema (se `src/types/...`), ellers retry → fallback.

### Simulator Agent
- Driver interaktive scenarier/spil og progression.
- Samme parametre; fokus på opgaver, events og progression.

### Image Agent
- Genererer cover/scene-billeder for universer.
- Provider styres via `IMAGE_PROVIDER` (fx `replicate`).
- Path-format: `/universe-images/{universeId}/{gradeInt}/cover.webp`.

### QA/Validation Agent
- Validerer at JSON matcher schema.
- Logger session-id, parametre og output til Supabase (debug).
- Trigger fallback ved valideringsfejl.

---

## Routing & Auth
- **Efter login**:
  - Elev → `/daily-program`
  - Lærer → `/teacher-dashboard`
  - Leder/Staff → `/school-dashboard`
  - Forælder → `/parent-dashboard`
- **Legacy**: `/profile` → redirect til `/daily-program`.
- **Supabase `emailRedirectTo`**: `/auth/callback?next=/daily-program`.

---

## 11 parametre (inputs til alle agenter)
1. **Subject** (fag)  
2. **Grade level** (trin, K-12)  
3. **Curriculum** (nationalt/lokalt)  
4. **School leader philosophy** (teaching perspective)  
5. **Lesson duration** (dagligt minut-antal)  
6. **Teacher subject weightings**  
7. **Calendar keywords** (temauger, events)  
8. **Calendar duration** (fx 1 uge, 1 måned)  
9. **Student ability level**  
10. **Student learning style**  
11. **Student interests**

> Alle hentes dynamisk fra dashboards/profiler – **aldrig hardcoded**.

---

## De 12 fag
1. Native language  
2. Mathematics  
3. Language Lab (andet sprog end elevens modersmål)  
4. Science  
5. History & Religion  
6. Geography  
7. Computer & Technology  
8. Creative Arts  
9. Music Discovery  
10. Physical Education  
11. Mental Wellness  
12. Life Essentials

---

## Unified prompt – eksempel (Mathematics, 5. klasse)

```json
[
  { "role": "system", "content": "You are an educational content generator for K-12." },
  { "role": "user", "content": "Generate a lesson for subject: Mathematics.\nGrade level: 5.\nCurriculum: {{CURRICULUM}}.\nSchool philosophy: {{SCHOOL_LEADER_PHILOSOPHY}}.\nLesson duration: 150 minutes.\nTeacher weightings: {{TEACHER_SUBJECT_WEIGHTS}}.\nCalendar context: {{CALENDAR_KEYWORDS}} (duration: {{CALENDAR_DURATION}}).\nAdapt to student ability: {{ABILITY_LEVEL}}.\nLearning style: {{LEARNING_STYLE}}.\nInterests: {{INTERESTS}}.\n\nOutput must strictly follow the JSON schema (see src/types/...)\n"}]
]
```
---

## Runbook (Operations & QA)

### Agenter & Endpoints
- **Content Agent** → kaldt via Supabase Edge Function `/generate-content`.
- **Simulator Agent** → kaldt via `/generate-scenario`.
- **Image Agent** → kaldt via `/image-ensure` (provider styres af `IMAGE_PROVIDER`).
- **QA/Validation Agent** → kører automatisk efter content-generation. Validerer mod JSON-schema og logger session til Supabase.

### Fallback-strategi
1. **Retry** → Fix JSON og prøv igen (max 2).
2. **Boring-but-correct** fallback content.
3. **Placeholder image** (fra bucket) og log hændelsen.

### Logging & Debug
- Alle sessioner får et unikt **session-id**.
- Inputparametre + output gemmes i Supabase (for QA/debug).
- Fejl cases markeres med tag `agent_error`.

### Tests
- **Unit & integration** → `npm test` (Vitest).
- **E2E** → `npx playwright test`.
- **Contract tests** → validerer output mod JSON-schema og billed-pipeline.

### Miljøvariabler (kræves i Edge Functions)
- `SUPABASE_URL`  
- `SUPABASE_SERVICE_ROLE_KEY`  
- `IMAGE_PROVIDER`  
- `REPLICATE_API_TOKEN`  
- `IMAGE_ENSURE_TOKEN`  
- `PLACEHOLDER_MIN_BYTES`

### Workflow (kort)
1. **Login redirect** (Supabase `emailRedirectTo`) → fx `/daily-program`.  
2. **Content Agent** genererer lesson baseret på 11 parametre.  
3. **QA Agent** validerer schema → fallback hvis nødvendigt.  
4. **Image Agent** genererer cover/scene billeder → fallback til placeholder hvis under min-bytes.  
5. **Simulator Agent** driver progression i scenarier/træningsøvelser.  
6. Output serveres til elev via `Daily Program` eller `Training Ground`.

### Flow-diagram (simplificeret)

```
Login → [Content Agent] → [QA Agent] → [Image Agent] → [Simulator Agent] → Output to UI
                |               |            |
                |               |            └── fallback → placeholder image
                |               └── fallback → boring-but-correct JSON
                └── retry (max 2)
```
