
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

async function generateWithAI(
  apiKey: string,
  apiEndpoint: string,
  model: string,
  kcId: string,
  userId: string,
  contentTypes: string[],
  maxAtoms: number,
  providerName: string
): Promise<Atom[]> {
  console.log(`🧠 Generating REAL MATH content with ${providerName}`);

  const prompt = createMathPrompt(kcId, userId, contentTypes, maxAtoms);
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ ${providerName} API error (${response.status}): ${errorBody}`);
      throw new Error(`${providerName} API request failed with status ${response.status}`);
    }

    const jsonResponse = await response.json();
    let aiContentString = "";
    
    if (providerName === "OpenAI") {
      aiContentString = jsonResponse.choices[0].message.content;
    } else if (providerName === "DeepSeek") {
      if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message && jsonResponse.choices[0].message.content) {
        aiContentString = jsonResponse.choices[0].message.content;
      } else {
        console.warn(`⚠️ ${providerName} response structure different:`, jsonResponse);
        aiContentString = JSON.stringify(jsonResponse);
      }
    }

    const aiGeneratedData = JSON.parse(aiContentString);

    if (!aiGeneratedData.atoms || !Array.isArray(aiGeneratedData.atoms)) {
      console.error(`❌ Invalid JSON from ${providerName}:`, aiGeneratedData);
      throw new Error(`Invalid JSON structure from ${providerName}: "atoms" array not found`);
    }

    // Validate and fix correctAnswer indices for multiple choice questions
    aiGeneratedData.atoms.forEach((atom: any, atomIndex: number) => {
      if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && atom.content) {
        const { question, options, correctAnswer } = atom.content;
        
        // Log the original data for debugging
        console.log(`🔍 Validating question ${atomIndex + 1}:`, {
          question,
          options,
          originalCorrectAnswer: correctAnswer
        });
        
        // Validate the math and get the correct index
        const validatedCorrectAnswer = validateMathAnswer(question, options, correctAnswer);
        
        // Update the correctAnswer if it was wrong
        if (validatedCorrectAnswer !== correctAnswer) {
          console.log(`🔧 Correcting answer from index ${correctAnswer} to ${validatedCorrectAnswer}`);
          atom.content.correctAnswer = validatedCorrectAnswer;
        }
        
        // Basic validation - ensure correctAnswer is within bounds
        if (atom.content.correctAnswer < 0 || atom.content.correctAnswer >= options.length) {
          console.warn(`⚠️ Invalid correctAnswer index ${atom.content.correctAnswer} for question with ${options.length} options. Setting to 0.`);
          atom.content.correctAnswer = 0;
        }
        
        console.log(`✅ Question ${atomIndex + 1} final validation - correctAnswer: ${atom.content.correctAnswer}, answer: "${options[atom.content.correctAnswer]}"`);
      }
    });

    const timestamp = Date.now();
    return aiGeneratedData.atoms.map((atom: any, index: number) => ({
      atom_id: `math_${providerName.toLowerCase()}_${timestamp}_${index + 1}`,
      atom_type: atom.atom_type,
      content: atom.content,
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.5,
        estimatedTimeMs: atom.atom_type === 'TEXT_EXPLANATION' ? 30000 : 45000,
        source: 'ai_math_generated',
        model: `${providerName}: ${model}`,
        generated_at: timestamp,
        mathTopic: kcId.split('_').slice(3).join('_')
      },
    }));

  } catch (error) {
    console.error(`❌ Error during ${providerName} math generation:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧮 MATH Content Generation function invoked');
    const { kcId, userId, contentTypes = ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'], maxAtoms = 2 } = await req.json();
    console.log('📊 Math request:', { kcId, userId, contentTypes, maxAtoms });

    if (!kcId || !userId) {
      return new Response(JSON.stringify({ error: "Missing kcId or userId" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let atoms: Atom[] = [];
    let providerUsed = "None";
    let generationError = null;

    if (OPENAI_API_KEY) {
      try {
        atoms = await generateWithAI(OPENAI_API_KEY, OPENAI_ENDPOINT, "gpt-4o-mini", kcId, userId, contentTypes, maxAtoms, "OpenAI");
        providerUsed = "OpenAI";
      } catch (error) {
        console.error("❌ OpenAI math generation failed:", error.message);
        generationError = error;
      }
    }

    if (atoms.length === 0 && DEEPSEEK_API_KEY) {
      console.log("🔄 Trying DeepSeek for math generation");
      try {
        atoms = await generateWithAI(DEEPSEEK_API_KEY, DEEPSEEK_ENDPOINT, "deepseek-chat", kcId, userId, contentTypes, maxAtoms, "DeepSeek");
        providerUsed = "DeepSeek";
        generationError = null;
      } catch (error) {
        console.error("❌ DeepSeek math generation failed:", error.message);
        if (!generationError) generationError = error;
      }
    } else if (atoms.length === 0 && !OPENAI_API_KEY && !DEEPSEEK_API_KEY) {
      console.error("❌ No API keys configured");
      return new Response(JSON.stringify({ error: "Math content generation failed: No API keys configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (atoms.length > 0) {
      console.log(`✅ REAL MATH content generated using ${providerUsed}:`, atoms.length, 'atoms');
      // Log each question for debugging
      atoms.forEach((atom, index) => {
        if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE') {
          console.log(`📝 Generated Question ${index + 1}:`, {
            question: atom.content.question,
            options: atom.content.options,
            correctAnswer: atom.content.correctAnswer,
            correctAnswerText: atom.content.options[atom.content.correctAnswer]
          });
        }
      });
      
      return new Response(JSON.stringify({ atoms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ Math generation failed for all providers');
      const errorMessage = generationError ? generationError.message : "Unknown math generation error";
      return new Response(JSON.stringify({
        error: `Math content generation failed. Provider: ${providerUsed}. Details: ${errorMessage}`,
        details: generationError ? generationError.toString() : "No further details."
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Math Content Generation main error:', error);
    return new Response(JSON.stringify({ error: error.message, details: error.toString() }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
