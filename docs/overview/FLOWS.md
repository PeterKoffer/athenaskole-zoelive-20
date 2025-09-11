# Key Flows

## Universe (Daglig)
1) Elev åbner `/universe`
2) Tryk “Generate New Universe”
3) `sanitizedContext` → Supabase `generate-content`
4) Vis univers (senere pæn UI; nu JSON)

## Scenario
1) Vælg scenarie på Universe-siden
2) Route til `/scenario/:scenarioId` m. state eller query
3) `sanitizedContext` → `generate-content`
4) Vis scenarie-output
