// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const subject = url.searchParams.get('subject') || 'Mathematics';
    const grade = url.searchParams.get('grade') || '5';
    const learningStyle = url.searchParams.get('style') || 'mixed';

    console.log(`🧪 Testing unified prompt system for ${subject}, Grade ${grade}, Style: ${learningStyle}`);

    // Simulate the unified prompt generation
    const promptConfig = {
      subject,
      gradeLevel: grade,
      learningStyle,
      studentInterests: ['science', 'animals'],
      calendarKeywords: ['winter', 'holidays'],
      lessonDurationMinutes: 30,
      studentAbilities: 'average',
      teachingPerspective: 'constructivist learning',
      curriculumStandards: 'Common Core aligned'
    };

    // Test prompt structure (simulating the generateTrainingGroundPrompt function)
    const prompt = `You are a world-class ${subject} teacher creating a lesson for a Grade ${grade} student. Develop a lesson aligned with Common Core aligned and incorporate the school's constructivist learning approach. The lesson should be designed for about 30 minutes of learning. Since ${subject} is a medium priority subject in our curriculum, adjust the depth accordingly. Consider the context of winter, holidays over the next this week in the lesson content. Tailor the material to the student's skill level – student performing at grade level - provide standard complexity with appropriate support, providing support or extension as needed. Use a multi-modal approach that combines visual, auditory, and kinesthetic elements. Connect to the student's interests in science, animals to make the lesson engaging. Include interactive activities or a game, and end with a brief quiz or test to assess understanding.

CRITICAL INSTRUCTIONS:
1. Calculate the correct answer step by step before creating options
2. Make sure the "correct" field matches the index of the mathematically correct answer
3. Double-check your math before finalizing
4. There must be EXACTLY ONE correct answer - no equivalent options (like 1/2 and 2/4)
5. All wrong answers must be clearly incorrect

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation why the answer is correct",
  "learningObjectives": ["Learning objective 1", "Learning objective 2"],
  "estimatedTime": 30
}`;

    // Test metadata
    const metadata = {
      fallbacksUsed: ['calendarDuration: No calendar timeframe specified'],
      parametersSource: {
        subject: 'provided',
        gradeLevel: 'provided',
        learningStyle: 'provided',
        studentInterests: 'provided',
        calendarKeywords: 'provided',
        lessonDurationMinutes: 'provided',
        studentAbilities: 'fallback',
        teachingPerspective: 'fallback',
        curriculumStandards: 'fallback'
      },
      adaptations: [
        'Incorporated student interests: science, animals',
        'Added seasonal/calendar context: winter, holidays'
      ]
    };

    const result = {
      success: true,
      config: promptConfig,
      generatedPrompt: prompt,
      metadata,
      promptLength: prompt.length,
      adaptationCount: metadata.adaptations.length,
      fallbackCount: metadata.fallbacksUsed.length,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Unified prompt generated successfully:`);
    console.log(`📏 Prompt length: ${prompt.length} characters`);
    console.log(`🎯 Adaptations made: ${metadata.adaptations.length}`);
    console.log(`🔄 Fallbacks used: ${metadata.fallbacksUsed.length}`);

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Test prompt error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});