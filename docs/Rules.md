# Project Rules

1. Start dagen med at gennemlæse alt og få overblik. Læs `docs/ASSISTANT_BRIEF.md`. Tjek at vi arbejder på branch `New-core-map`. Giv et kort status-overblik og førsteprioritet-opgaver.
2. Redigering: Medmindre andet er aftalt, leverer assistenten ALTID hele filen klar til copy/paste. Jeg indsætter ændringer i GitHub web UI på `https://github.com/PeterKoffer/athenaskole-zoelive-20/blob/New-core-map`.
3. Når der leveres kode, er det ren kode uden inline-forklaringer. Al forklaring skrives udenfor kodeblokke.
4. Altid tydelige, nummererede steps: hvad der skal gøres, hvor, og om det er Terminal eller GitHub UI.
5. Kalender: Assistenten kan ikke tilgå macOS Kalender direkte. Brug midlertidigt `docs/CALENDAR.md` til planlagte ting, eller koble Google Calendar integration til senere.
6. Værktøjer i spil: OpenAI, Supabase, GitHub + Dashboard, Lovable.dev, Grok, Qwem, MPX.com, Docker Desktop, Terminal, Cursor.
7. Arkitektur/struktur dokumenteres og opdateres løbende i `docs/ARCHITECTURE.md`. Nye forslag skal matche og være fremtidssikret mod funktioner fra `main`.
8. Ydelse/skalerbarhed: Ingen løsninger må begrænse hastighed eller brugerantal. Ventetid minimeres. AI-generering køres helst ved skoledagens opstart eller parallelt med anden aktivitet.
9. Udskiftelig AI-leverandør: Strukturen skal gøre det nemt at skifte API-udbyder når appen går live.
10. Fallback-materiale: Min. 500 skoledage klar, hurtigt load, ingen repetitioner for en elev (medmindre bevidst opsamling).
11. To undervisningstyper: **Universe** og **Training Ground**.
12. ALLE regler/ønsker ligger i repoet og gennemlæses HVER DAG før vi arbejder.
13. Projektet skal altid kunne overtages af en ny GPT: Vedligehold klare manualer i `docs/ASSISTANT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/DEVLOG.md`.
14. Kom løbende med forbedringsforslag og idéer. Brug gerne tid på at holde dig ajour med AI-læring/tutors/trends.
