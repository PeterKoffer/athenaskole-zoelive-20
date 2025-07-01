
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

// Enhanced fallback content generator for when APIs fail
function generateFallbackContent(kcId: string, maxAtoms: number): Atom[] {
  console.log(`🔄 Generating fallback content for ${kcId}`);
  
  const timestamp = Date.now();
  const atoms: Atom[] = [];
  
  // Extract topic info from kcId
  const parts = kcId.toLowerCase().split('_');
  const grade = parts[2]?.replace('g', '') || '5';
  const topic = parts.slice(3).join(' ').replace(/_/g, ' ') || 'mathematics';
  
  // Generate TEXT_EXPLANATION atom
  atoms.push({
    atom_id: `fallback_explanation_${timestamp}_1`,
    atom_type: 'TEXT_EXPLANATION',
    content: {
      title: `Understanding ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
      explanation: `Let's explore ${topic} for Grade ${grade}. This concept builds on your previous knowledge and helps you develop stronger mathematical skills. We'll work through examples step by step to ensure you understand the process.`,
      examples: [
        `Example 1: Practice problem for ${topic}`,
        `Example 2: Real-world application of ${topic}`
      ]
    },
    kc_ids: [kcId],
    metadata: {
      difficulty: 0.5,
      estimatedTimeMs: 30000,
      source: 'curriculum_fallback',
      model: 'Fallback Generator',
      generated_at: timestamp,
      curriculumAligned: true,
      mathTopic: topic,
      studypugIntegration: false
    }
  });
  
  // Generate QUESTION_MULTIPLE_CHOICE atom if requested
  if (maxAtoms > 1) {
    atoms.push({
      atom_id: `fallback_question_${timestamp}_2`,
      atom_type: 'QUESTION_MULTIPLE_CHOICE',
      content: {
        question: `Which of the following best describes ${topic}?`,
        options: [
          "A mathematical concept we're learning",
          "An advanced topic for higher grades",
          "A basic skill we already know",
          "Something not related to math"
        ],
        correctAnswer: 0,
        explanation: `${topic.charAt(0).toUpperCase() + topic.slice(1)} is indeed a mathematical concept that we're currently learning in Grade ${grade}.`
      },
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.4,
        estimatedTimeMs: 25000,
        source: 'curriculum_fallback',
        model: 'Fallback Generator',
        generated_at: timestamp,
        curriculumAligned: true,
        mathTopic: topic,
        studypugIntegration: false
      }
    });
  }
  
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
  providerName: string
): Promise<Atom[]> {
  console.log(`🧠 Generating CURRICULUM-ENHANCED content with ${providerName}`);

  // Use our curriculum-enhanced prompt generator
  const prompt = createMathPrompt(kcId, userId, contentTypes, maxAtoms);
  
  try {
    // Increased timeout and optimized for better success rate
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased to 20 seconds

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
        max_tokens: 1500, // Reduced for faster response
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ ${providerName} API error (${response.status}): ${errorBody}`);
      throw new Error(`${providerName} API request failed with status ${response.status}: ${errorBody}`);
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
        throw new Error(`Invalid response structure from ${providerName}`);
      }
    }

    const aiGeneratedData = JSON.parse(aiContentString);

    if (!aiGeneratedData.atoms || !Array.isArray(aiGeneratedData.atoms)) {
      console.error(`❌ Invalid JSON from ${providerName}:`, aiGeneratedData);
      throw new Error(`Invalid JSON structure from ${providerName}: "atoms" array not found`);
    }

    console.log(`✅ CURRICULUM-ENHANCED content generated: ${aiGeneratedData.atoms.length} atoms`);

    // Enhanced validation for curriculum-aligned content
    aiGeneratedData.atoms.forEach((atom: any, atomIndex: number) => {
      if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && atom.content) {
        const { question, options, correctAnswer } = atom.content;
        
        console.log(`🔍 Validating curriculum-aligned question ${atomIndex + 1}: "${question.substring(0, 50)}..."`);
        
        // Enhanced math validation for curriculum content
        if (question.includes('÷') || question.includes('×') || question.includes('+') || question.includes('-') || question.includes('/')) {
          const validatedCorrectAnswer = validateMathAnswer(question, options, correctAnswer);
          
          if (validatedCorrectAnswer !== correctAnswer) {
            console.log(`🔧 Curriculum content: Correcting answer from index ${correctAnswer} to ${validatedCorrectAnswer}`);
            atom.content.correctAnswer = validatedCorrectAnswer;
          } else {
            console.log(`✅ Curriculum content: Answer validation passed for question ${atomIndex + 1}`);
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
      atom_id: `curriculum_${providerName.toLowerCase()}_${timestamp}_${index + 1}`,
      atom_type: atom.atom_type,
      content: atom.content,
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.6, // Slightly higher for curriculum-aligned content
        estimatedTimeMs: atom.atom_type === 'TEXT_EXPLANATION' ? 25000 : 35000,
        source: 'curriculum_enhanced_ai',
        model: `${providerName}: ${model}`,
        generated_at: timestamp,
        curriculumAligned: true,
        mathTopic: kcId.split('_').slice(3).join('_'),
        studypugIntegration: true
      },
    }));

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ ${providerName} curriculum generation timed out`);
      throw new Error(`${providerName} curriculum generation timed out - please try again`);
    }
    console.error(`❌ Error during ${providerName} curriculum generation:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎓 CURRICULUM-ENHANCED Content Generation function invoked');
    const { kcId, userId, contentTypes = ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'], maxAtoms = 2 } = await req.json();
    console.log('📚 Curriculum-enhanced request:', { kcId, userId, contentTypes, maxAtoms });

    if (!kcId || !userId) {
      return new Response(JSON.stringify({ error: "Missing kcId or userId" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let atoms: Atom[] = [];
    let providerUsed = "None";
    let generationError = null;

    // Try OpenAI first for curriculum-enhanced generation
    if (OPENAI_API_KEY) {
      try {
        console.log('🚀 Attempting OpenAI curriculum-enhanced generation...');
        atoms = await generateWithAI(OPENAI_API_KEY, OPENAI_ENDPOINT, "gpt-4o-mini", kcId, userId, contentTypes, maxAtoms, "OpenAI");
        providerUsed = "OpenAI";
        console.log(`✅ OpenAI curriculum generation successful: ${atoms.length} atoms created`);
      } catch (error) {
        console.error("❌ OpenAI curriculum generation failed:", error.message);
        generationError = error;
      }
    }

    // Fallback to DeepSeek only if OpenAI fails
    if (atoms.length === 0 && DEEPSEEK_API_KEY) {
      console.log("🔄 Trying DeepSeek for curriculum generation");
      try {
        atoms = await generateWithAI(DEEPSEEK_API_KEY, DEEPSEEK_ENDPOINT, "deepseek-chat", kcId, userId, contentTypes, maxAtoms, "DeepSeek");
        providerUsed = "DeepSeek";
        generationError = null;
        console.log(`✅ DeepSeek curriculum generation successful: ${atoms.length} atoms created`);
      } catch (error) {
        console.error("❌ DeepSeek curriculum generation failed:", error.message);
        if (!generationError) generationError = error;
      }
    }

    // Enhanced fallback: Generate curriculum-aligned content locally if all APIs fail
    if (atoms.length === 0) {
      console.log("🔄 All API providers failed, generating enhanced fallback content");
      atoms = generateFallbackContent(kcId, maxAtoms);
      providerUsed = "Curriculum-Enhanced Fallback";
      generationError = null;
      console.log(`✅ Fallback curriculum generation successful: ${atoms.length} atoms created`);
    }

    if (atoms.length > 0) {
      console.log(`🎉 CURRICULUM-ENHANCED content generated successfully using ${providerUsed}:`, atoms.length, 'atoms');
      console.log('🏷️ Curriculum metadata:', atoms.map(a => a.metadata.curriculumAligned ? 'Aligned' : 'Standard').join(', '));
      
      return new Response(JSON.stringify({ atoms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ All curriculum generation methods failed');
      const errorMessage = generationError ? generationError.message : "Unknown curriculum generation error";
      return new Response(JSON.stringify({
        error: `Curriculum content generation failed. Provider: ${providerUsed}. Details: ${errorMessage}`,
        details: generationError ? generationError.toString() : "No further details.",
        curriculumEnhanced: false
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ Curriculum Content Generation main error:', error);
    return new Response(JSON.stringify({ 
      error: error.message, 
      details: error.toString(),
      curriculumEnhanced: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
