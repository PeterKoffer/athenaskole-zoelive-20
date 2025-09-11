// src/services/content/index.ts
export type Context = {
  grade: number;
  curriculum: string;
  ability: "support" | "core" | "advanced";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  interests?: string[];
  [k: string]: unknown;
};

export type GenerateArgs = { subject: string; context: Context };
export type GenerateResult = unknown;

// Default: Edge (Supabase Functions)
export { generate as generate } from "@content/edge";

// Explicit opt-in til OpenAI – kun til lokale tests/fallbacks
export { generate as generateWithOpenAI } from "@content/openai";
