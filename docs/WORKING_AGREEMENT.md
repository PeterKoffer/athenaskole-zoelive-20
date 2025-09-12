# WORKING AGREEMENT – New-core som ny main

**Formål:** Samle alt brugbart fra `main` i `New-core-map`, som bliver den nye `main`.  
**Principper:**
1. **New-core-map er sandheden.** Alt udviklingsarbejde foregår på `New-core-map` eller branches derfra.
2. **Main er read-only kilde.** Vi ændrer ikke `main`, medmindre det eksplicit gavner porten – og kun for at gøre porten nemmere.
3. **Portér selektivt.** Kun filer/indhold der gavner New-core flyttes fra `main`.
4. **Guardrails:**  
   - **Én Supabase-klient** i frontend (ingen ekstra `createClient(` spredt i repoet).  
   - **Én NELIE-instans** i UI (global `SingleNELIE`; ingen lokale `<NELIE />` mounts).
   - **Ruter i New-core** bruger `ScenarioRunner` (ikke `ScenarioPlayerPage`).

**Definition of Done (for hver port-PR):**
- [ ] Fil(er) hentet **fra `main` → New-core** (ikke omvendt)
- [ ] Dev bygger: `npm run dev`
- [ ] Sanity: `git grep -nF 'createClient(' -- src` viser kun `src/lib/supabaseClient.ts`
- [ ] Sanity: `git grep -nF '<NELIE' -- src` viser ingen lokale mounts
- [ ] Rute bruger `ScenarioRunner`
