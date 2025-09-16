# ZoeLive - Solidt Fundament

## 🎯 KERNEPROBLEM & MÅL
- **Problem**: Elever får personaliseret undervisning genereret af AI uden ventetid
- **Mål**: Lærere og skole får klar styring og overblik
- **Vision**: Hurtig levering, offline fallback, ingen gentagelser for samme elev

## 👥 MÅLGRUPPER
1. **Elever** → Universe + Training Ground læring
2. **Lærere** → Kontrol og tilpasning af undervisning  
3. **Skoleledelse/Forældre** → Rapportering og overblik

## 🏗️ TO KERNEFUNKTIONER

### **1. UNIVERSE (Daglig Program)**
- **Story/ramme-baseret læring** på tværs af fag
- **Flow**: `/universe` → "Generate New Universe" → `sanitizedContext` → AI → Univers visning
- **Scenario navigation**: `/scenario/:scenarioId` med state/query parametre

### **2. TRAINING GROUND (Målrettet Træning)**
- **Fokuserede øvelser** per fag/færdighed
- **Flow**: Subject selection → målrettede opgaver → ingen gentagelser
- **Format**: TikTok/Instagram-style scrolling gennem indhold

## 🤖 NELIE AI TUTOR
- **Tale og tekst interface** - eleven kan kommunikere naturligt
- **Personaliseret guidance** gennem pensum på bedst mulige måde
- **Altid tilgængelig** support og tilpasning

## ⚡ PERFORMANCE KRAV
- **< 1-2 sekunder** ventetid (ingen synlige spinners)
- **Pre-generation** ved dagstart (batch per klasse/årgang)
- **Cache + deduplikering** i backend
- **Offline fallback** ≥ 500 skoledage ready

## 🔧 TEKNISK ARKITEKTUR

### **Provider-Agnostik LLM Layer**
```typescript
interface LLMProvider {
  generateContent(payload: GenerateContentInput): Promise<unknown>;
}

// Implementeringer:
// - EdgeFunctionProvider (Supabase → OpenAI) [NU]
// - DirectOpenAIProvider [SENERE]
// - AlternativeProvider [FREMTID]
```

### **Clean Features Structure**
```
src/features/
├── daily-program/          # Universe & Scenarios
│   ├── pages/UniverseLesson.tsx
│   ├── pages/ScenarioRunner.tsx
│   └── types/
├── training-ground/        # Målrettet træning
│   ├── pages/TrainingGroundHome.tsx
│   └── types/
└── nelie/                 # AI Tutor integration
    ├── components/
    └── services/
```

### **Data Flow Pattern**
```
Student Action → sanitizedContext → LLM Provider → Generated Content → UI Display
```

## 📊 PERSONALISERINGS PARAMETRE
Alle genereringer SKAL bruge disse 12 parametre:
1. Subject, 2. Grade Level, 3. Curriculum Standards, 4. Teaching Perspective
5. Lesson Duration, 6. Subject Weight, 7. Calendar Keywords, 8. Calendar Duration  
9. Student Abilities, 10. Learning Style, 11. Student Interests, 12. Assessment Elements

## 🛡️ KVALITETSSIKRING
- **Ingen hard-coded værdier** - alt skal være tilpasseligt
- **Multi-sprog support** (EN → DA først)
- **Curriculum compliance** per land/region
- **Safety first** - alderspassende indhold altid

## 🚀 IMPLEMENTATION PRIORITET
1. **✅ DONE**: Clean architecture foundation (features/, provider-agnostic LLM)
2. **NEXT**: Universe generation med performance optimering
3. **THEN**: Training Ground implementation  
4. **LATER**: NELIE integration og advanced personalisering

---
**Dette fundament sikrer skalerbar, vedligeholdbar udvikling der respecterer alle dine 6 måneders erfaringer.**