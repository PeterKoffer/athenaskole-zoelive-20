
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
function createMathPrompt(kcId: string, userId: string, contentTypes: string[], maxAtoms: number): string {
  // Extract math topic from KC ID
  const kcParts = kcId.toLowerCase().split('_');
  const subject = kcParts[1] || 'math';
  const grade = kcParts[2] || 'g4';
  const gradeNumber = grade.replace('g', '');
  const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ');

  let specificInstructions = "";
  
  if (topic.includes('equivalent_fractions')) {
    specificInstructions = `Create questions about equivalent fractions like "Which fraction is equivalent to 2/4?" with options like "1/2", "3/6", "4/8", "All of the above" (correct: All of the above)`;
  } else if (topic.includes('multiply_decimals')) {
    specificInstructions = `Create decimal multiplication questions like "What is 2.5 × 1.6?" with numerical answer choices`;
  } else if (topic.includes('area_rectangles')) {
    specificInstructions = `Create area questions like "A rectangle has length 8 units and width 5 units. What is its area?" with options like "40 square units", "13 square units", "26 square units", "35 square units"`;
  } else if (topic.includes('add_fractions')) {
    specificInstructions = `Create fraction addition questions like "What is 2/5 + 1/5?" with fraction answer options. CRITICAL: Make sure the correctAnswer index points to the mathematically correct sum.`;
  } else if (topic.includes('basic_division')) {
    specificInstructions = `Create basic division questions like "What is 24 ÷ 6?" with numerical answer choices. MAKE SURE the correctAnswer index points to the mathematically correct result.`;
  } else {
    specificInstructions = `Create grade ${gradeNumber} math questions about ${topic} with numerical problems and calculations`;
  }

  return `You are a Grade ${gradeNumber} math teacher creating educational content about ${topic}.

Generate ${maxAtoms} educational atoms with these exact types: ${contentTypes.join(', ')}.

${specificInstructions}

For TEXT_EXPLANATION atoms, explain the math concept clearly with examples.
For QUESTION_MULTIPLE_CHOICE atoms, create ACTUAL MATH PROBLEMS with numbers, not generic questions about concepts.

CRITICAL: For multiple choice questions, you MUST ensure the correctAnswer index points to the option that contains the mathematically correct answer. 

Example for fraction addition: If the question is "What is 2/5 + 3/5?" and your options are ["4/5", "5/5", "1/2", "1/5"], then correctAnswer should be 1 (because "5/5" is at index 1 and 2/5 + 3/5 = 5/5).

Return JSON with this exact structure:
{
  "atoms": [
    {
      "atom_type": "TEXT_EXPLANATION",
      "content": {
        "title": "Understanding ${topic}",
        "explanation": "Clear explanation of the math concept with step-by-step process",
        "examples": ["Example: 3 × 4 = 12", "Example: Area = length × width"]
      }
    },
    {
      "atom_type": "QUESTION_MULTIPLE_CHOICE", 
      "content": {
        "question": "What is 12 × 15?",
        "options": ["180", "170", "190", "200"],
        "correctAnswer": 0,
        "explanation": "12 × 15 = 180. You can solve this by multiplying 12 × 10 = 120, then 12 × 5 = 60, so 120 + 60 = 180."
      }
    }
  ]
}

DOUBLE-CHECK: Before finalizing your response, verify that the correctAnswer index matches the position of the mathematically correct answer in the options array. This is CRITICAL for the learning system to work properly.

IMPORTANT: Create real mathematical calculations, not questions about concepts. Use actual numbers and math problems appropriate for Grade ${gradeNumber}.`;
}

function validateMathAnswer(question: string, options: string[], correctAnswerIndex: number): number {
  console.log(`🔍 Validating math answer for: "${question}"`);
  console.log(`📝 Options:`, options);
  console.log(`🎯 Original correctAnswer index:`, correctAnswerIndex);

  // Helper function to find greatest common divisor (GCD)
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  // Helper function to simplify a fraction string "num/den"
  function simplifyFractionStr(fractionStr: string): string {
    const parts = fractionStr.split('/');
    if (parts.length !== 2) return fractionStr; // Not a simple fraction
    let num = parseInt(parts[0]);
    let den = parseInt(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return fractionStr;

    if (num === 0) return "0";

    const common = gcd(Math.abs(num), Math.abs(den));
    num /= common;
    den /= common;

    if (den < 0) { // Ensure denominator is positive
        num = -num;
        den = -den;
    }

    return den === 1 ? `${num}` : `${num}/${den}`;
  }

  // Helper function to parse a string that might be a fraction or a number
  function parseNumericString(s: string): number | { num: number, den: number } {
    s = s.trim();
    if (s.includes('/')) {
      const parts = s.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return { num, den };
        }
      }
    }
    const val = parseFloat(s);
    return isNaN(val) ? NaN : val;
  }
  
  // Helper function to compare two numeric values (could be fractions or numbers)
  // Tolerates small differences for floating point comparisons.
  function areNumericallyEquivalent(val1: any, val2: any, tolerance = 1e-9): boolean {
    const num1 = typeof val1 === 'object' ? val1.num / val1.den : val1;
    const num2 = typeof val2 === 'object' ? val2.num / val2.den : val2;

    if (isNaN(num1) || isNaN(num2)) return false;
    return Math.abs(num1 - num2) < tolerance;
  }

  let calculatedCorrectValue: number | { num: number, den: number } | null = null;

  // Handle fraction addition: "a/b + c/d"
  const fractionAddMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)/);
  if (fractionAddMatch) {
    const [, n1, d1, n2, d2] = fractionAddMatch.map(Number);
    if (d1 !== 0 && d2 !== 0) {
      const num = n1 * d2 + n2 * d1;
      const den = d1 * d2;
      calculatedCorrectValue = { num, den };
      console.log(`🧮 Calculated fraction addition: ${num}/${den} from question: "${question}"`);
    }
  }

  // Handle fraction subtraction: "a/b - c/d"
  if (!calculatedCorrectValue) {
    const fractionSubMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionSubMatch) {
      const [, n1, d1, n2, d2] = fractionSubMatch.map(Number);
      if (d1 !== 0 && d2 !== 0) {
        const num = n1 * d2 - n2 * d1;
        const den = d1 * d2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction subtraction: ${num}/${den} from question: "${question}"`);
      }
    }
  }

  // Handle fraction multiplication: "a/b * c/d" or "a/b x c/d"
  if (!calculatedCorrectValue) {
    const fractionMultMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*[×*]\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionMultMatch) {
      const [, n1, d1, n2, d2] = fractionMultMatch.map(Number);
      if (d1 !== 0 && d2 !== 0) {
        const num = n1 * n2;
        const den = d1 * d2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction multiplication: ${num}/${den} from question: "${question}"`);
      }
    }
  }

  // Handle fraction division: "a/b ÷ c/d" or "a/b / c/d" (ensure not to conflict with date-like strings if relevant)
  if (!calculatedCorrectValue) {
    // More specific regex for fraction division to avoid general slash use
    const fractionDivMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*(?:÷|\/)\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionDivMatch) {
      const [, n1, d1, n2, d2] = fractionDivMatch.map(Number);
      if (d1 !== 0 && d2 !== 0 && n2 !== 0) { // Denominators and numerator of divisor cannot be zero
        const num = n1 * d2;
        const den = d1 * n2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction division: ${num}/${den} from question: "${question}"`);
      } else if (n2 === 0) {
        console.warn(`Division by zero fraction detected in question: "${question}"`);
      }
    }
  }

  // Handle basic multiplication of numbers (integers or decimals): "N1 x N2" or "N1 * N2"
  // Uses a more general regex for numbers, including potential negative signs.
  if (!calculatedCorrectValue) {
    const multMatch = question.match(/(-?\d+(?:\.\d+)?)\s*[×*]\s*(-?\d+(?:\.\d+)?)/);
    if (multMatch) {
      const [, num1Str, num2Str] = multMatch;
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);
      if (!isNaN(num1) && !isNaN(num2)) {
        calculatedCorrectValue = num1 * num2;
        console.log(`🧮 Calculated multiplication: ${calculatedCorrectValue}`);
      }
    }
  }
  
  // Handle basic division of numbers (integers or decimals): "N1 ÷ N2" or "N1 / N2"
  // Avoid matching fractions here by checking for prior fraction operation matches.
  // Uses a more general regex for numbers, including potential negative signs.
  if (!calculatedCorrectValue && (question.includes('÷') || (question.includes('/') && !fractionAddMatch && !fractionSubMatch && !fractionMultMatch && !fractionDivMatch))) {
    const divMatch = question.match(/(-?\d+(?:\.\d+)?)\s*[÷/]\s*(-?\d+(?:\.\d+)?)/);
    if (divMatch) {
      const [, num1Str, num2Str] = divMatch;
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);
      if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
        calculatedCorrectValue = num1 / num2;
        console.log(`🧮 Calculated division: ${calculatedCorrectValue}`);
      } else if (num2 === 0) {
        console.warn(`Division by zero detected in question: "${question}"`);
      }
    }
  }

  if (calculatedCorrectValue !== null) {
    let correctValueStr = "";
    if (typeof calculatedCorrectValue === 'object' && calculatedCorrectValue.num !== undefined) {
      // It's a fraction object {num, den}
      correctValueStr = simplifyFractionStr(`${calculatedCorrectValue.num}/${calculatedCorrectValue.den}`);
      console.log(`Simplified correct fraction: ${correctValueStr}`);
    } else {
      // It's a number (potentially a float from multiplication/division)
      correctValueStr = calculatedCorrectValue.toString();
      console.log(`Calculated correct number: ${correctValueStr}`);
    }

    for (let i = 0; i < options.length; i++) {
      const optionVal = parseNumericString(options[i]);
      const calculatedValToCompare = parseNumericString(correctValueStr); // re-parse in case it was simplified to "0" etc.

      if (areNumericallyEquivalent(optionVal, calculatedValToCompare)) {
        console.log(`✅ Found numerically equivalent answer "${options[i]}" (parsed: ${JSON.stringify(optionVal)}) at index ${i}. Original index: ${correctAnswerIndex}.`);
        return i;
      }
    }
    console.log(`⚠️ Calculated correct value "${correctValueStr}" not found in options:`, options);
  } else {
    console.log(`ℹ️ No specific math operation matched for validation logic for question: "${question}"`);
  }
  
  console.log(`⚠️ Defaulting to original AI-provided index: ${correctAnswerIndex} for question "${question}"`);
  return correctAnswerIndex;
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
