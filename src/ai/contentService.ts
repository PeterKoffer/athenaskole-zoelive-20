import { supabase } from "@/integrations/supabase/client";
import { buildPrompt, PROMPT_VERSION } from "./promptBuilder";
import { LessonRequest, LessonResponse } from "./types";

function hashKey(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

export async function generateContent(req: LessonRequest): Promise<LessonResponse> {
  const key = hashKey({ req, v: PROMPT_VERSION });

  // 1. Check cache
  const { data: cached } = await supabase
    .from("ai_cache")
    .select("json")
    .eq("key", key)
    .maybeSingle();

  if (cached?.json) {
    return cached.json as LessonResponse;
  }

  const { system, user } = buildPrompt(req);

  // 2. Call Supabase edge function for OpenAI
  const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
    body: {
      systemPrompt: system,
      userPrompt: user,
      model: "gpt-4o-mini",
      temperature: 0.4
    }
  });

  if (error) {
    throw new Error("Edge function error: " + error.message);
  }

  let parsed: LessonResponse;

  try {
    parsed = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (err) {
    throw new Error("Invalid JSON from AI: " + JSON.stringify(data));
  }

  parsed.metadata = { promptVersion: PROMPT_VERSION };

  // 3. Save to cache
  await supabase.from("ai_cache").upsert({ key, json: parsed });

  return parsed;
}