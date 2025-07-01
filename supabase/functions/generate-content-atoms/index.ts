
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// @deno-lint-ignore-file no-explicit-any
import { validateMathAnswer } from './math_utils.ts';
import { createMathPrompt } from './prompt_generator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || Deno.env.get("DeepSeek_API");

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

interface Atom {
  atom_id: string;
  atom_type: string;
  content: any;
  kc_ids: string[];
  metadata: any;
}

// Minimized fallback - only used as absolute last resort
function generateMinimalFallback(kcId: string, maxAtoms: number): Atom[] {
  console.log(`⚠️ LAST RESORT: Minimal fallback for ${kcId} (AI generation completely failed)`);
  
  const timestamp = Date.now();
  const atoms: Atom[] = [];
  
  atoms.push({
    atom_id: `minimal_fallback_${timestamp}_1`,
    atom_type: 'TEXT_EXPLANATION',
    content: {
      title: `Mathematics Practice`,
      explanation: `This is an important mathematical concept that requires practice and understanding.`,
      examples: [`Practice helps build mathematical skills`]
    },
    kc_ids: [kcId],
    metadata: {
      difficulty: 0.5,
      estimatedTimeMs: 30000,
      source: 'minimal_fallback',
      model: 'Minimal Fallback',
      generated_at: timestamp,
      curriculumAligned: false,
      aiGenerated: false
    }
  });
  
  return atoms.slice(0, maxAtoms);
}

async function generateWithAI(
  apiKey: string,
  apiEndpoint: string,
  model: string,
  kcId: string,
  userId: string,
  contentTypes: string[],
  maxAtoms: number,
  providerName: string,
  attemptNumber: number = 1
): Promise<Atom[]> {
  console.log(`🚀 AI Generation Attempt #${attemptNumber} with ${providerName}`);

  // Enhanced prompt with uniqueness and creativity boosters
  const diversityPrompts = [
    "Create completely unique questions with fresh scenarios and different numbers",
    "Use creative real-world applications and engaging story contexts",
    "Design innovative problem-solving approaches with varied difficulty",
    "Generate original mathematical scenarios with practical applications",
    "Create engaging word problems with diverse characters and situations"
  ];
  
  const randomDiversityPrompt = diversityPrompts[Math.floor(Math.random() * diversityPrompts.length)];
  const basePrompt = createMathPrompt(kcId, userId, contentTypes, maxAtoms);
  
  // Enhanced prompt with creativity boosters
  const enhancedPrompt = `${basePrompt}

CREATIVITY ENHANCEMENT (Attempt #${attemptNumber}):
${randomDiversityPrompt}

UNIQUENESS REQUIREMENTS:
- Use completely different numbers and scenarios from typical examples
- Create original word problems with unique contexts
- Vary mathematical operations and problem presentation
- Make content engaging and age-appropriate
- Ensure educational value while being creative

GENERATION CONTEXT:
- Provider: ${providerName}
- Attempt: ${attemptNumber}
- Session: ${Date.now()}
- Randomization: ${Math.random().toString(36).substring(7)}

Generate HIGH-QUALITY, CREATIVE, and EDUCATIONALLY VALUABLE content!`;

  try {
    // More aggressive timeout strategy - shorter but with more retries
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced timeout

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: enhancedPrompt }],
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.8 + (attemptNumber * 0.1), // Increase creativity with each attempt
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ ${providerName} API error (${response.status}): ${errorBody}`);
      throw new Error(`${providerName} API request failed: ${response.status} - ${errorBody}`);
    }

    const jsonResponse = await response.json();
    let aiContentString = "";
    
    if (providerName === "OpenAI") {
      aiContentString = jsonResponse.choices[0].message.content;
    } else if (providerName === "DeepSeek") {
      if (jsonResponse.choices?.[0]?.message?.content) {
        aiContentString = jsonResponse.choices[0].message.content;
      } else {
        console.warn(`⚠️ ${providerName} unexpected response structure:`, jsonResponse);
        throw new Error(`Invalid response structure from ${providerName}`);
      }
    }

    const aiGeneratedData = JSON.parse(aiContentString);

    if (!aiGeneratedData.atoms || !Array.isArray(aiGeneratedData.atoms)) {
      console.error(`❌ Invalid JSON from ${providerName}:`, aiGeneratedData);
      throw new Error(`Invalid JSON structure from ${providerName}: missing atoms array`);
    }

    console.log(`✅ ${providerName} SUCCESS: Generated ${aiGeneratedData.atoms.length} atoms on attempt #${attemptNumber}`);

    // Enhanced validation for AI-generated content
    aiGeneratedData.atoms.forEach((atom: any, atomIndex: number) => {
      if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && atom.content) {
        const { question, options, correctAnswer } = atom.content;
        
        console.log(`🔍 Validating AI question ${atomIndex + 1}: "${question.substring(0, 50)}..."`);
        
        // Math validation
        if (question.includes('÷') || question.includes('×') || question.includes('+') || question.includes('-') || question.includes('/')) {
          const validatedCorrectAnswer = validateMathAnswer(question, options, correctAnswer);
          
          if (validatedCorrectAnswer !== correctAnswer) {
            console.log(`🔧 AI Content: Correcting answer from ${correctAnswer} to ${validatedCorrectAnswer}`);
            atom.content.correctAnswer = validatedCorrectAnswer;
          } else {
            console.log(`✅ AI Content: Answer validation passed for question ${atomIndex + 1}`);
          }
        }
        
        // Bounds check
        if (atom.content.correctAnswer < 0 || atom.content.correctAnswer >= options.length) {
          console.warn(`⚠️ Invalid correctAnswer index ${atom.content.correctAnswer}. Setting to 0.`);
          atom.content.correctAnswer = 0;
        }
      }
    });

    const timestamp = Date.now();
    return aiGeneratedData.atoms.map((atom: any, index: number) => ({
      atom_id: `ai_${providerName.toLowerCase()}_${timestamp}_${index + 1}_attempt${attemptNumber}`,
      atom_type: atom.atom_type,
      content: atom.content,
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.7, // Higher difficulty for AI content
        estimatedTimeMs: atom.atom_type === 'TEXT_EXPLANATION' ? 30000 : 40000,
        source: 'ai_generated',
        model: `${providerName}: ${model}`,
        generated_at: timestamp,
        curriculumAligned: true,
        mathTopic: kcId.split('_').slice(3).join('_'),
        studypugIntegration: true,
        aiGenerated: true,
        attemptNumber: attemptNumber,
        creativityLevel: 0.8 + (attemptNumber * 0.1)
      },
    }));

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ ${providerName} timed out on attempt #${attemptNumber}`);
      throw new Error(`${providerName} generation timed out (attempt ${attemptNumber})`);
    }
    console.error(`❌ ${providerName} generation failed (attempt #${attemptNumber}):`, error);
    throw error;
  }
}

// Enhanced retry logic with multiple providers and attempts
async function generateWithEnhancedRetry(kcId: string, userId: string, contentTypes: string[], maxAtoms: number): Promise<Atom[]> {
  const maxAttempts = 3;
  let lastError = null;

  // Try OpenAI with multiple attempts
  if (OPENAI_API_KEY) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🎯 OpenAI Generation - Attempt ${attempt}/${maxAttempts}`);
        const atoms = await generateWithAI(OPENAI_API_KEY, OPENAI_ENDPOINT, "gpt-4o-mini", kcId, userId, contentTypes, maxAtoms, "OpenAI", attempt);
        if (atoms.length > 0) {
          console.log(`🎉 OpenAI SUCCESS on attempt ${attempt}: ${atoms.length} atoms generated`);
          return atoms;
        }
      } catch (error) {
        console.warn(`⚠️ OpenAI attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        // Short delay between attempts
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  // Try DeepSeek with multiple attempts
  if (DEEPSEEK_API_KEY) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🎯 DeepSeek Generation - Attempt ${attempt}/${maxAttempts}`);
        const atoms = await generateWithAI(DEEPSEEK_API_KEY, DEEPSEEK_ENDPOINT, "deepseek-chat", kcId, userId, contentTypes, maxAtoms, "DeepSeek", attempt);
        if (atoms.length > 0) {
          console.log(`🎉 DeepSeek SUCCESS on attempt ${attempt}: ${atoms.length} atoms generated`);
          return atoms;
        }
      } catch (error) {
        console.warn(`⚠️ DeepSeek attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        // Short delay between attempts
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  // If all AI attempts failed, throw the last error
  console.error(`❌ ALL AI GENERATION ATTEMPTS FAILED after ${maxAttempts * 2} tries`);
  throw lastError || new Error("All AI providers failed");
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 AI-FOCUSED Content Generation function invoked');
    const { kcId, userId, contentTypes = ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'], maxAtoms = 2 } = await req.json();
    console.log('🎯 AI-focused request:', { kcId, userId, contentTypes, maxAtoms });

    if (!kcId || !userId) {
      return new Response(JSON.stringify({ error: "Missing kcId or userId" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let atoms: Atom[] = [];
    let providerUsed = "None";
    let generationError = null;

    // Focus on AI generation with enhanced retry
    try {
      console.log('🚀 Starting AI-focused generation with enhanced retry logic...');
      atoms = await generateWithEnhancedRetry(kcId, userId, contentTypes, maxAtoms);
      providerUsed = "AI Enhanced Retry";
      console.log(`✅ AI generation successful: ${atoms.length} atoms created`);
    } catch (error) {
      console.error("❌ All AI generation attempts failed:", error.message);
      generationError = error;
    }

    // Only use minimal fallback as absolute last resort
    if (atoms.length === 0) {
      console.log("⚠️ ABSOLUTE LAST RESORT: Using minimal fallback (all AI attempts failed)");
      atoms = generateMinimalFallback(kcId, maxAtoms);
      providerUsed = "Minimal Fallback";
      generationError = null;
      console.log(`📝 Minimal fallback generation: ${atoms.length} atoms created`);
    }

    if (atoms.length > 0) {
      const aiGenerated = atoms.some(atom => atom.metadata.aiGenerated === true);
      console.log(`🎉 Content generated successfully using ${providerUsed}:`, atoms.length, 'atoms');
      console.log(`🤖 AI Generated: ${aiGenerated ? 'YES' : 'NO'}`);
      
      return new Response(JSON.stringify({ atoms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ All generation methods failed completely');
      const errorMessage = generationError ? generationError.message : "Unknown generation error";
      return new Response(JSON.stringify({
        error: `Content generation failed completely. Provider: ${providerUsed}. Details: ${errorMessage}`,
        details: generationError ? generationError.toString() : "No further details.",
        aiGenerated: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Content Generation main error:', error);
    return new Response(JSON.stringify({ 
      error: error.message, 
      details: error.toString(),
      aiGenerated: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
