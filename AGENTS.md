cat > AGENTS.md <<'EOF'
# AGENTS.md

## Formål
Kilde-of-truth for hvordan vores “agenter” arbejder (content, simulator, image, QA) – inputs, prompts, redirects, og fallback.

## Routing & Auth
- Efter login: /daily-program (elev), /teacher-dashboard (lærer), /school-dashboard (leder/staff), /parent-dashboard (forælder).
- Legacy: /profile → redirect til /daily-program.
- Supabase emailRedirectTo: /auth/callback?next=/daily-program.

## Data-inputs (parametre)
subject, grade, curriculum, school-leader philosophy, lesson duration,
teacher subject weightings, calendar keywords, calendar duration,
student ability, learning style, interests.

## Prompt-standard
- Én unified prompt pr. fag.
- Output VALIDERES mod JSON-skema; retry(max=2) → fallback.

## Fallback-politik
1) Fix JSON og retry  
2) Brug “boring but correct” fallback  
3) Placeholder-billede og logning

## Billedpolitik
/universe-images/{universeId}/{gradeInt}/cover.webp, cache-bust, min-bytes gate.

## Miljøvariabler
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, IMAGE_PROVIDER, REPLICATE_API_TOKEN, IMAGE_ENSURE_TOKEN, PLACEHOLDER_MIN_BYTES.

## Tests
Vitest (unit/integration) + Playwright (E2E). Kontrakt-tests for skema + image-pipeline.
