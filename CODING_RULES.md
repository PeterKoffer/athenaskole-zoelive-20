# CODING RULES - LÆS INDEN HVER KODE GENERERING

## 🚨 OBLIGATORISK: LÆS SOLIDT FUNDAMENT FØRST
**INDEN du skriver en eneste linje kode, SKAL du læse:**

### **🏛️ FUNDAMENT (START HER):**
- `docs/SOLID_FOUNDATION.md` - **KERNEFUNDAMENT for hele projektet**
- `docs/CRITICAL_FLOWS.md` - **Kritiske brugerflows og implementation**
- `docs/PRODUCT_OVERVIEW.md` - **ZoeLive produktmål og globale parametre**
- `docs/NELIE_SPEC.md` - **NELIE AI tutor specifikation**
- `docs/NELIE_Foundational_Principles.md` - **NELIE's kerneprincipper**
- `docs/Rules.md` - **Alle projektregler**

### **📋 ARKITEKTUR & BESLUTNINGER:**
- `docs/ARCHITECTURE.md` - App arkitektur og struktur
- `docs/ADR-0001-nelie-orchestrator.md` - **NELIE orchestrator arkitektur**
- `docs/ADR-0002-simulation-dsl.md` - **Simulation DSL beslutning**
- `docs/ENGINEERING_GUIDE.md` - Praktisk implementerings guide
- `docs/ENHANCED_NELIE_README.md` - NELIE lesson system
- `docs/SIMULATION_PLATFORM.md` - Universe simulation engine

### **🔧 SYSTEMER & INTEGRATION:**
- `docs/PARAMETER_DATA_SOURCES_UPDATED.md` - **Nyeste data kilder mapping**
- `docs/TRAINING_GROUND_PROMPT_TEMPLATE_UPDATED.md` - **Nyeste Training Ground parametre**
- `docs/CURRICULUM_INDEX.md` - Pensum normalisering schema
- `docs/CURRICULUM_COVERAGE_UPDATED.md` - **Nyeste pensum dækning status**
- `docs/GAME_INTEGRATION_GUIDE.md` - Spil integration og tracking
- `docs/UNIFIED_QUESTION_GENERATION.md` - Spørgsmål generering
- `docs/COST_CONTROL.md` - AI omkostnings kontrol
- `docs/I18N_STRATEGY.md` - Flersproget strategi

### **✅ VERIFIKATION & KVALITET:**
- `docs/VERIFICATION_CHECKLIST.md` - **System verifikations tjekliste**
- `docs/ASSISTANT_BRIEF.md` - Dagens fokus og prioriteter

**🚨 INGEN kode må skrives uden at have gennemlæst disse regler og specifikationer!**

## CORE APP KONCEPT
Dette er en **AI-drevet skole app** med fokus på personaliseret læring for hver enkelt elev.

### HOVEDFUNKTIONER

#### 1. DAILY PROGRAM (Obligatorisk daglig undervisning)
- **Univers-baseret læring**: Hver morgen mødes eleven af en historie/udfordring
- **Alle fag integreret**: Gennem universer lærer eleven ALLE 12 fag
- **Eksempler**: Hjælpe politiet, åbne butik, lede fodboldhold, hjælpe kvinde i Kina
- **500+ lagrede universer** + AI kan generere nye

#### 2. TRAINING GROUND (Individuel fagspecifik træning)
- **Enkelt-fag fokus**: Eleven kan træne specifikke fag eller dele af fag
- **TikTok/Instagram format**: Scroll gennem opgaver/videoer
- **Samme 12 fag** som Daily Program

### DE 12 FAG (Skal supporteres overalt)
1. Native language (Engelsk i US, Dansk i DK, etc.)
2. Mathematics
3. Language lab (Spansk, Fransk, Tysk, Italiensk, Kinesisk, Engelsk)
4. Science
5. History & Religion
6. Geography
7. Computer and technology
8. Creative arts
9. Music discovery
10. Physical education
11. Mental Wellness
12. Life Essentials (praktiske livsfærdigheder)

### NELIE - AI HJÆLPEREN
- **Altid tilgængelig** for tale/tekst support
- **Personaliseret hjælp** gennem pensum
- **Tilpasset hver enkelt elevs behov**

## PERSONALISERING PARAMETRE
### Alle funktioner skal tilpasse sig:
- [ ] Subject (fag)
- [ ] Students K-12 step/grade level (0-10 + gymnasium 1-3)
- [ ] National Curriculum
- [ ] School leaders fundamental view
- [ ] Lesson duration per day
- [ ] Subjects weight in AI Content Preferences
- [ ] Calendar Keywords
- [ ] Calendar duration
- [ ] Students abilities, level and reactions
- [ ] Students learning style
- [ ] Students fields of interests

## 6 LOGIN TYPER - ADGANG REGLER

### 1. ELEV LOGIN
- **Adgang til**: Daily Program, Training Ground, skema, kalender
- **NELIE support**: Altid tilgængelig
- **Fokus**: Læring og undervisning

### 2. LÆRER LOGIN
- **Dashboard med**: Temaer, fag-vægte, skoledag-varighed, statistik
- **Kan influere**: Undervisning gennem parametre
- **Fokus**: Undervisnings-tilpasning

### 3. FORÆLDRE LOGIN
- **Kan følge**: Elevens fremgang
- **Kommunikation**: Med skolen
- **Se**: Planer og fremgang

### 4. SKOLE LOGIN
- **Administrative opgaver**
- **Skole-drift funktioner**

### 5. SKOLELEDER LOGIN
- **Sætte perspektiv**: For hele skolens undervisning
- **Adgang til**: Alle andre dashboards
- **Kan influere**: Gennem lærer dashboard og mere

### 6. ADMINISTRATOR LOGIN
- **System administration**
- **Teknisk vedligeholdelse**

## TEKNISKE KRAV

### SPROG & PENSUM
- **Multi-sprog support**: Alle sprog skal supporteres
- **Nationale standarder**: Pensum efter landets krav
- **Fallback**: Standard pensum hvis nationale ikke findes
- **Klassetrin**: K-12 (0-10 + gymnasium 1-3)

### PERSONALISERING CORE
- **Hver elev er unik**: Alle features skal tilpasse sig individet
- **Styrker/svagheder**: Brug elevens profil
- **Pensum-fokus**: Alt skal matche elevens pensum
- **Læringsstil**: Tilpas til hvordan eleven lærer bedst

## SIMULATOR
- **Indbygget simulator**: Kan simulere skoledag, uge, år
- **Virkelighedstro**: Så realistisk som muligt
- **Integreret i Daily Program**

## KODNINGS PRINCIPPER

### ALTID HUSK:
1. **Eleven i centrum**: Hver funktion skal fokusere på elevens behov
2. **NELIE integration**: AI hjælperen skal være tilgængelig
3. **Personalisering**: Brug de 11 parametre til tilpasning
4. **Multi-fag support**: Alle 12 fag skal kunne håndteres
5. **Login-type awareness**: Respekter adgangsrettigheder
6. **Skalerbarhed**: Skal virke for alle sprog og lande

### UNDGÅ:
- ❌ Hard-coded værdier der ikke kan tilpasses
- ❌ Funktioner der ikke respekterer elevens profil
- ❌ UI der ikke kan håndtere alle 6 login-typer
- ❌ Fag-specifikke løsninger der ikke skalerer
- ❌ Funktionalitet uden NELIE integration mulighed

## KVALITETS TJEK INDEN KODING
1. ✅ Understøtter dette elevens personalisering?
2. ✅ Kan NELIE integreres her?
3. ✅ Virker det for alle 12 fag?
4. ✅ Respekterer det login-type adgang?
5. ✅ Er det skalérbart til alle lande/sprog?
6. ✅ Bidrager det til elevens læring gennem pensum?

---
**HUSK**: Denne app skal hjælpe hver enkelt elev gennem deres pensum på den bedst mulige måde. Alt kode skal støtte denne mission!