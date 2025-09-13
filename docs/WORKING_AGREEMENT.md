# WORKING AGREEMENT – New-core som ny main
1) Udvikling sker på New-core-map (+ feature-branches).
2) Main er read-only kilde – vi porter selektivt til New-core.
3) Guardrails: én Supabase-klient, én NELIE-instans, ruter = ScenarioRunner.
4) DoD for port-PR: dev grønt, ingen nye `createClient(`, ingen lokale `<NELIE />`.
