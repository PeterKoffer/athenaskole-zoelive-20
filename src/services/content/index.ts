export type Ability = "support" | "core" | "advanced";
export type LearningStyle = "visual" | "auditory" | "kinesthetic" | "mixed";
export type Context = {
  grade: number; curriculum: string; ability: Ability;
  learningStyle: LearningStyle; interests?: string[]; [k: string]: unknown;
};
export type GenerateArgs = { subject: string; context: Context };
export type GenerateResult = unknown;

// Default: Edge (Supabase)
export { generate } from "./EdgeContentService";
// Valgfri: eksplicit OpenAI (til lokale tests)
export { generate as generateWithOpenAI } from "@/services/openai/OpenAIContentService";
