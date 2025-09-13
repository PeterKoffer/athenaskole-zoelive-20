# WORKING AGREEMENT – New-core som ny main
1) Alt arbejde foregår på New-core-map (+ feature-branches herfra).
2) Main er read-only kilde: vi porter selektivt fra main → New-core.
3) Guardrails: én Supabase-klient, én NELIE-instans, ruter = ScenarioRunner.
4) DoD for hver port-PR: dev grønt; ingen nye `createClient(`; ingen lokale `<NELIE />`.
