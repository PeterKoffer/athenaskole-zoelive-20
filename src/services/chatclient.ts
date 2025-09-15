// src/services/nelie/chatClient.ts
import { supabase } from "@/lib/supabaseClient";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

function extractText(payload: any): string {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  // Common edge-function payload shapes
  if (payload.content) return payload.content;
  if (payload.data?.content) return payload.data.content;
  if (payload.data) return JSON.stringify(payload.data);

  return JSON.stringify(payload);
}

/**
 * Sends messages to Supabase Edge Function.
 * Tries "ai-stream" first, falls back to "generate-content".
 */
export async function askNelie(messages: ChatMessage[]): Promise<string> {
  if (!supabase) {
    return "⚠️ Supabase mangler konfiguration. Sæt VITE_SUPABASE_URL og VITE_SUPABASE_ANON i .env.local";
  }

  // 1) Try ai-stream
  try {
    const { data, error } = await supabase.functions.invoke("ai-stream", {
      body: { messages },
    });
    if (error) throw error;
    return extractText(data) || "🤖 (tomt svar)";
  } catch {
    // 2) Fallback to generate-content
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { messages },
      });
      if (error) throw error;
      return extractText(data) || "🤖 (tomt svar)";
    } catch (err: any) {
      return `❌ NELIE er ikke forbundet endnu (${err?.message ?? err})`;
    }
  }
}
