# READ FIRST — Morning Reading Stack

**Branch:** `New-core-map`

## Læserækkefølge (hver morgen)
1. `docs/RULES.md`  – faste spilleregler & workflow
2. `docs/ASSISTANT_BRIEF.md` – aktuel status, fokus, kommandoer
3. `docs/READ_FIRST.md` (denne) – samlet indeks
4. `docs/OVERVIEW_INDEX.md` – alle produkt-/app-overblik
5. `docs/ARCHITECTURE.md` – struktur, dataflow, provider-agnostik
6. `docs/DEVLOG.md` – dagens noter/blokkere (øverste sektion)

> Hvis nye overblik-filer tilføjes, så link dem i `docs/OVERVIEW_INDEX.md`.

## Hurtig tjekliste
- [ ] Branch = **New-core-map**
- [ ] `npm run dev` -> `/universe` åbner
- [ ] Edge function `generate-content` svarer
- [ ] Ingen duplikerede keys i payloads (brug `sanitizedContext`-mønstret)
