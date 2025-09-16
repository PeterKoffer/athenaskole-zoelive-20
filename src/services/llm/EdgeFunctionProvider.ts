import { supabase } from "@/lib/supabaseClient";
import type { LLMProvider, GenerateContentInput } from "./Provider";

export class EdgeFunctionProvider implements LLMProvider {
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private generateCacheKey(input: GenerateContentInput): string {
    return JSON.stringify({
      subject: input.subject,
      grade: input.grade,
      curriculum: input.curriculum,
      ability: input.ability,
      learningStyle: input.learningStyle
    });
  }

  private isExpired(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return !expiry || Date.now() > expiry;
  }

  async generateContent(input: GenerateContentInput): Promise<unknown> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(input);
    
    // Check cache first
    if (this.cache.has(cacheKey) && !this.isExpired(cacheKey)) {
      const cacheTime = Date.now() - startTime;
      console.log(`🎯 Cache hit! Response time: ${cacheTime}ms`);
      return this.cache.get(cacheKey);
    }
    
    console.log('🚀 Generating new content via edge function...');
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", { 
        body: input 
      });
      
      if (error) {
        throw new Error(error.message ?? "generate-content failed");
      }
      
      // Cache the result
      this.cache.set(cacheKey, data);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
      
      const totalTime = Date.now() - startTime;
      console.log(`✅ Generation complete! Response time: ${totalTime}ms`);
      
      return data;
    } catch (error) {
      const errorTime = Date.now() - startTime;
      console.error(`❌ Generation failed after ${errorTime}ms:`, error);
      throw error;
    }
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    console.log('🧹 Cache cleared');
  }
}