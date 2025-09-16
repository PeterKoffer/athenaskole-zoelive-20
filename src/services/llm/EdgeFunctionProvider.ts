import { supabase } from "@/lib/supabaseClient";
import type { LLMProvider, GenerateContentInput } from "./Provider";

export class EdgeFunctionProvider implements LLMProvider {
  async generateContent(input: GenerateContentInput): Promise<unknown> {
    const { data, error } = await supabase.functions.invoke("generate-content", { 
      body: input 
    });
    
    if (error) {
      throw new Error(error.message ?? "generate-content failed");
    }
    
    return data;
  }
}