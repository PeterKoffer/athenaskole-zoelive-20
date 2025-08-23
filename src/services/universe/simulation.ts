import { UNIVERSE_BRIEF_PROMPT, SIMULATE_STEP_PROMPT } from "./prompts";
import { UniverseState, UniverseDiff, applyDiff, Horizon } from "./state";
import { topTags } from "@/services/interestProfile";
import { invokeFn } from '@/supabase/safeInvoke';
import { logEvent } from "@/services/telemetry/events";
import type { AdaptiveContentRes } from '@/types/api';

// Helper to call LLM and parse JSON response
async function callLLMJson<T = any>(
  prompt: string, 
  subject: string = 'mathematics', 
  interests: string[] = []
): Promise<T> {
  console.log('🔧 Calling edge function with:', {
    type: 'universe_generation',
    subject: subject,
    gradeLevel: 6,
    studentInterests: interests,
    hasPrompt: !!prompt
  });
  
  const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
    type: 'universe_generation',
    prompt: prompt,
    subject: subject,
    gradeLevel: 6, // Default grade level
    studentInterests: interests,
    maxTokens: 400,
    temperature: 0.7
  });
  
  // Check if the response has the expected structure
  if (data?.success === false) {
    throw new Error(data.error || 'Universe generation failed');
  }
  
  // Extract the generated content
  let result;
  if (data?.generatedContent) {
    result = data.generatedContent;
  } else if (data?.content) {
    // Legacy format - try to parse
    if (typeof data.content === 'string') {
      const jsonMatch = data.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in LLM response');
      }
    } else {
      result = data.content;
    }
  } else {
    throw new Error('No content found in response');
  }
  
  return result as T;
}

export async function createOrRefreshUniverse(
  subject: string, 
  gradeBand: "3-5" | "6-8" | "9-12"
): Promise<UniverseState> {
  const tags = topTags(3);
  
  console.log('🌟 Creating universe with:', { subject, gradeBand, tags });
  
  try {
    const brief = await callLLMJson(
      UNIVERSE_BRIEF_PROMPT({
        subject, gradeBand, interestsCSV: tags.join(", ")
      }),
      subject,
      tags
    );
    
    const state: UniverseState = {
      id: crypto.randomUUID(),
      subject, gradeBand,
      title: brief.title || `${subject} Adventure`,
      synopsis: brief.synopsis || `Learn ${subject} through hands-on experiences`,
      tags: brief.tags ?? tags, 
      props: brief.props ?? ['notebook', 'calculator', 'smartphone', 'whiteboard'],
      time: { dayIndex: 0, horizon: "day" },
      metrics: { mastery: {}, engagement: 0 },
      log: [{ t: "init", event: "universe_created", data: { tags } }]
    };
    
    await logEvent("universe_created", { subject, gradeBand, tags: state.tags });
    return state;
    
  } catch (error) {
    console.error('Failed to create universe:', error);
    
    // Fallback universe
    const fallbackState: UniverseState = {
      id: crypto.randomUUID(),
      subject, gradeBand,
      title: `${subject} Learning Lab`,
      synopsis: `Join a hands-on ${subject.toLowerCase()} project where you'll solve real-world challenges using classroom tools and community resources.`,
      tags: tags.slice(0, 2), 
      props: ['notebook', 'calculator', 'smartphone', 'project board'],
      time: { dayIndex: 0, horizon: "day" },
      metrics: { mastery: {}, engagement: 0 },
      log: [{ t: "init", event: "universe_created_fallback", data: { tags, error: String(error) } }]
    };
    
    return fallbackState;
  }
}

export async function simulateStep(
  state: UniverseState,
  horizon: Horizon,
  standardsToday: string[],
  signals: Array<{tag:string,delta:number}>
): Promise<UniverseState> {
  try {
    const diff = await callLLMJson<UniverseDiff>(
      SIMULATE_STEP_PROMPT({
        state, horizon, todayStandards: standardsToday, signals
      }),
      state.subject,
      state.tags
    );
    
    const next = applyDiff({ ...state, time: { ...state.time, horizon } }, diff);
    
    await logEvent("universe_advanced", {
      horizon, dayIndex: next.time.dayIndex, changed: Object.keys(diff)
    });
    
    return next;
    
  } catch (error) {
    console.error('Failed to simulate step:', error);
    
    // Minimal advancement fallback
    const next = applyDiff(state, {
      log: [{ t: new Date().toLocaleTimeString(), event: "day_continued", data: { error: String(error) } }],
      advanceDay: horizon === "day",
      metrics: {
        engagement: Math.max(-1, Math.min(1, state.metrics.engagement + 0.1))
      }
    });
    
    return next;
  }
}