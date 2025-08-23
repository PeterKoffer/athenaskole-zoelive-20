import { RUBRIC_PROMPT, RubricReport } from "./rubric";
import { invokeFn } from '@/supabase/functionsClient';
import { logEvent } from "@/services/telemetry/events";
import type { AdaptiveContentRes } from '@/types/api';

// Helper to call LLM and parse JSON response
async function callLLMJson<T = any>(prompt: string): Promise<T> {
  const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
    prompt: prompt,
    maxTokens: 300,
    temperature: 0.3 // Lower temperature for more consistent evaluation
  });
  
  // Parse the AI response
  let result;
  if (typeof data.content === 'string') {
    // Try to extract JSON from the response
    const jsonMatch = data.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No JSON found in LLM response');
    }
  } else {
    result = data.content;
  }
  
  return result as T;
}

export async function qualityCheck(subject: string, activity: any): Promise<{ok: boolean, report: RubricReport}> {
  try {
    const r = await callLLMJson<RubricReport>(RUBRIC_PROMPT(subject, activity));
    
    // Define quality thresholds
    const ok = r.groundedInDailyLife && 
               r.usesProps && 
               r.clearLearningGoal && 
               r.standardLinked &&
               (r.cognitiveLevel === "apply" || 
                r.cognitiveLevel === "analyze" ||
                r.cognitiveLevel === "evaluate" || 
                r.cognitiveLevel === "create");
    
    if (!ok && r.fix) {
      await logEvent("activity_rejected", { 
        reason: {
          groundedInDailyLife: r.groundedInDailyLife,
          usesProps: r.usesProps,
          clearLearningGoal: r.clearLearningGoal,
          standardLinked: r.standardLinked,
          cognitiveLevel: r.cognitiveLevel
        }, 
        kind: (activity as any).kind || 'unknown',
        fix: r.fix 
      });
    }
    
    return { ok, report: r };
    
  } catch (error) {
    console.error('Quality check failed:', error);
    
    // Fallback: assume it's okay if we can't evaluate
    const fallbackReport: RubricReport = {
      groundedInDailyLife: true,
      usesProps: true,
      clearLearningGoal: true,
      standardLinked: true,
      cognitiveLevel: "apply",
      engagementHooks: [],
      fix: undefined
    };
    
    return { ok: true, report: fallbackReport };
  }
}

export async function generateWithQualityGate(
  basePrompt: string,
  subject: string,
  maxAttempts: number = 2
): Promise<any> {
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Generate activity
      const activity = await callLLMJson(basePrompt);
      
      // Check quality
      const qc = await qualityCheck(subject, activity);
      
      if (qc.ok) {
        // Quality passed
        await logEvent("activity_quality_passed", { 
          attempt, 
          cognitiveLevel: qc.report.cognitiveLevel,
          engagementHooks: qc.report.engagementHooks.length 
        });
        return activity;
      } else if (attempt < maxAttempts && qc.report.fix) {
        // Try again with improvement instruction
        basePrompt = `${basePrompt}\n\nIMPROVE: ${qc.report.fix}`;
        
        await logEvent("activity_quality_retry", { 
          attempt, 
          fix: qc.report.fix,
          issues: Object.entries(qc.report)
            .filter(([, value]) => typeof value === 'boolean' && !value)
            .map(([key]) => key)
        });
      } else {
        // Final attempt failed, return anyway
        await logEvent("activity_quality_failed", { 
          attempts: maxAttempts,
          finalIssues: Object.entries(qc.report)
            .filter(([, value]) => typeof value === 'boolean' && !value)
            .map(([key]) => key)
        });
        return activity;
      }
      
    } catch (error) {
      console.error(`Quality generation attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }
  
  throw new Error('Failed to generate quality content after all attempts');
}