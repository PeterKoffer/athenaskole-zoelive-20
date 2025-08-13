import { supabase } from "@/integrations/supabase/client";
import { buildPrompt, PROMPT_VERSION } from "./promptBuilder";
import { LessonRequest, LessonResponse } from "./types";
import { preferencesService } from "@/services/PreferencesService";

function hashKey(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

export async function generateContent(req: LessonRequest): Promise<LessonResponse> {
  // Fetch teacher preferences if not provided
  let enrichedReq = req;
  if (!req.teacherPreferences) {
    try {
      // Get current user to fetch their preferences
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [teacherPrefs, classLessonDurations] = await Promise.all([
          preferencesService.getTeacherPreferences(user.id),
          getClassLessonDurations()
        ]);

        enrichedReq = {
          ...req,
          teacherPreferences: {
            subjectWeights: (teacherPrefs?.subject_weights as Record<string, number>) || {},
            lessonDurations: classLessonDurations
          }
        };
      }
    } catch (error) {
      console.warn("Failed to fetch teacher preferences, using defaults:", error);
    }
  }

  const key = hashKey({ req: enrichedReq, v: PROMPT_VERSION });

  // 1. Check cache
  const { data: cached } = await supabase
    .from("ai_cache")
    .select("json")
    .eq("key", key)
    .maybeSingle();

  if (cached?.json) {
    return cached.json as LessonResponse;
  }

  const { system, user } = buildPrompt(enrichedReq);

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

function getClassLessonDurations(): Record<string, number> {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("classLessonDurations");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error("Failed to parse class lesson durations", err);
      }
    }
  }
  return {};
}