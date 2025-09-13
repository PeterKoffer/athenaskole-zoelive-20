## Hvad gør denne PR?
- [ ] Porter filer fra main → New-core-map (ikke omvendt)
- [ ] Ingen direkte ændringer på main
- [ ] Én Supabase-klient (ingen nye `createClient(` i frontend)
- [ ] Én NELIE-instans (ingen nye `<NELIE />`)
- [ ] Ruter peger på `ScenarioRunner`

## Test
- [ ] `npm run dev` grønt
- [ ] Smoke: /scenario/:scenarioId og /daily-program
