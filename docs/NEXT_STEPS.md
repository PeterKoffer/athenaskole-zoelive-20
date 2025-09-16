# Næste Skridt - Start Implementation 🚀

## 🎯 FØRSTE OPGAVE: Universe Performance (I DAG)

### **Hvad skal vi lave nu?**
1. **Test nuværende Universe generation** på `/universe`
2. **Tilføj cache-lag** til EdgeFunctionProvider
3. **Forbedre UI** fra JSON dump til smuk visning

### **Konkret Implementation Plan:**

```typescript
// 1. Først: Test eksisterende system
// Gå til /universe og test current generation

// 2. Tilføj cache til EdgeFunctionProvider.ts
class EdgeFunctionProvider implements LLMProvider {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  
  generateCacheKey(input: GenerateContentInput): string {
    return JSON.stringify({
      subject: input.subject,
      grade: input.grade,
      curriculum: input.curriculum
    });
  }
  
  isExpired(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return !expiry || Date.now() > expiry;
  }
  
  async generateContent(input: GenerateContentInput): Promise<unknown> {
    const cacheKey = this.generateCacheKey(input);
    
    // Check cache first
    if (this.cache.has(cacheKey) && !this.isExpired(cacheKey)) {
      console.log('🎯 Cache hit for universe generation');
      return this.cache.get(cacheKey);
    }
    
    // Generate new content
    const { data, error } = await supabase.functions.invoke("generate-content", { 
      body: input 
    });
    
    if (error) {
      throw new Error(error.message ?? "generate-content failed");
    }
    
    // Cache for 30 minutes
    this.cache.set(cacheKey, data);
    this.cacheExpiry.set(cacheKey, Date.now() + (30 * 60 * 1000));
    
    return data;
  }
}

// 3. Forbedre UniverseLesson.tsx UI
// Erstat JSON dump med smuk Card-baseret visning
```

### **Test Procedure:**
1. Gå til `/universe` 
2. Test generation med forskellige subjects/grades
3. Check console for generation tid
4. Verificer cache virker (anden gang skal være hurtig)

## 🔄 EFTER DAGENS ARBEJDE
- **Commit changes** til features branch
- **Test performance** - mål: < 5 sek første gang, < 1 sek cache hit  
- **Planlæg næste dag**: Universe UI forbedringer

## ❓ SPØRGSMÅL TIL DIG
1. **Skal vi starte med Universe performance i dag?**
2. **Hvilke subjects er vigtigst at teste først?**
3. **Har du adgang til Supabase edge function logs?**

**Lad os bygge det første solide feature færdigt sammen! 💪**