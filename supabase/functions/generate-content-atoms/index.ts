
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || Deno.env.get("DeepSeek_API");

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"; // Assumption

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
  console.log(`🧠 Attempting content generation with ${providerName}`);

  const desiredContentTypesString = contentTypes.join(", ");
  const prompt = `
    You are an AI assistant specialized in creating educational content.
    Generate content for a knowledge component identified as "${kcId}".
    The user ID is "${userId}".
    Please provide ${maxAtoms} content atoms.
    The desired atom types are: ${desiredContentTypesString}. For example, a TEXT_EXPLANATION and a QUESTION_MULTIPLE_CHOICE.

    Respond with a JSON object containing a single key "atoms".
    The value of "atoms" should be an array of atom objects.
    Each atom object must have the following structure:
    {
      "atom_type": "TYPE_STRING", // e.g., "TEXT_EXPLANATION" or "QUESTION_MULTIPLE_CHOICE"
      "content": {
        // Content structure depends on atom_type
        // For TEXT_EXPLANATION:
        //   "title": "AI Generated Title for ${kcId}",
        //   "explanation": "AI generated explanation text...",
        //   "examples": ["AI generated example 1", "AI generated example 2"]
        // For QUESTION_MULTIPLE_CHOICE:
        //   "question": "AI generated question about ${kcId}?",
        //   "options": ["Option A", "Option B", "Option C", "Option D"],
        //   "correctAnswer": 0, // index of the correct option
        //   "explanation": "AI generated explanation for the correct answer."
      }
    }
    Ensure the output is a valid JSON.
  `;

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
        response_format: { type: "json_object" }, // For OpenAI GPT-4 Turbo and newer
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ ${providerName} API error (${response.status}): ${errorBody}`);
      throw new Error(`${providerName} API request failed with status ${response.status}. Body: ${errorBody}`);
    }

    const jsonResponse = await response.json();

    if (providerName === "OpenAI" && (!jsonResponse.choices || !jsonResponse.choices[0] || !jsonResponse.choices[0].message || !jsonResponse.choices[0].message.content)) {
      console.error(`❌ Invalid response structure from ${providerName}:`, jsonResponse);
      throw new Error(`Invalid response structure from ${providerName}. Missing 'choices[0].message.content'.`);
    }

    // DeepSeek might have a different response structure, this part might need adjustment
    // For now, assuming it's similar to OpenAI or the main content is directly in a field.
    // If DeepSeek returns JSON directly in a specific field (e.g. data.result), adjust here.
    let aiContentString = "";
    if (providerName === "OpenAI") {
        aiContentString = jsonResponse.choices[0].message.content;
    } else if (providerName === "DeepSeek") {
        // Placeholder: Adjust if DeepSeek's response structure for JSON output is different.
        // For example, if DeepSeek also uses choices[0].message.content:
        if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message && jsonResponse.choices[0].message.content) {
            aiContentString = jsonResponse.choices[0].message.content;
        } else {
            // Fallback if the structure is unknown or different, try to parse the whole response.
            // This is a guess and might fail if the response isn't a simple JSON string.
            console.warn(`⚠️ ${providerName} response structure might be different. Attempting to parse directly. Response:`, jsonResponse)
            aiContentString = JSON.stringify(jsonResponse);
        }
    }


    const aiGeneratedData = JSON.parse(aiContentString);

    if (!aiGeneratedData.atoms || !Array.isArray(aiGeneratedData.atoms)) {
      console.error(`❌ Invalid JSON structure from ${providerName} AI: "atoms" array not found or not an array. Parsed data:`, aiGeneratedData);
      throw new Error(`Invalid JSON structure from ${providerName} AI: "atoms" array not found or not an array.`);
    }

    const timestamp = Date.now();
    return aiGeneratedData.atoms.map((atom: any, index: number) => ({
      atom_id: `ai_${providerName.toLowerCase()}_${timestamp}_${index + 1}`,
      atom_type: atom.atom_type,
      content: atom.content,
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.5, // Placeholder, AI could provide this
        estimatedTimeMs: atom.atom_type === 'TEXT_EXPLANATION' ? 30000 : 45000, // Placeholder
        source: 'ai_generated',
        model: `${providerName}: ${model}`,
        generated_at: timestamp,
        raw_ai_response_truncated: jsonResponse // Storing for debug, might want to truncate/remove for prod
      },
    }));

  } catch (error) {
    console.error(`❌ Error during ${providerName} AI generation or parsing:`, error);
    throw error; // Re-throw to be caught by the main handler
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 AI Content Generation function invoked');
    const { kcId, userId, contentTypes = ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'], maxAtoms = 2 } = await req.json();
    console.log('📝 Request details:', { kcId, userId, contentTypes, maxAtoms });

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
        atoms = await generateWithAI(OPENAI_API_KEY, OPENAI_ENDPOINT, "gpt-3.5-turbo", kcId, userId, contentTypes, maxAtoms, "OpenAI");
        providerUsed = "OpenAI";
      } catch (error) {
        console.error("❌ OpenAI generation failed:", error.message);
        generationError = error; // Store error to potentially try next provider
      }
    }

    if (atoms.length === 0 && DEEPSEEK_API_KEY) {
      console.log("🔄 OpenAI failed or key not present, trying DeepSeek.");
      try {
        // Note: DeepSeek model name might differ, e.g., "deepseek-chat" or "deepseek-coder"
        // Using "deepseek-chat" as a common guess.
        atoms = await generateWithAI(DEEPSEEK_API_KEY, DEEPSEEK_ENDPOINT, "deepseek-chat", kcId, userId, contentTypes, maxAtoms, "DeepSeek");
        providerUsed = "DeepSeek";
        generationError = null; // Clear previous error if DeepSeek succeeds
      } catch (error) {
        console.error("❌ DeepSeek generation failed:", error.message);
        if (!generationError) generationError = error; // Keep first error if OpenAI wasn't tried
      }
    } else if (atoms.length === 0 && !OPENAI_API_KEY && !DEEPSEEK_API_KEY) {
       console.error("❌ No API keys configured for OpenAI or DeepSeek.");
       return new Response(JSON.stringify({ error: "AI content generation failed: No API keys configured." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }


    if (atoms.length > 0) {
      console.log(`✅ AI content generated successfully using ${providerUsed}. Atoms:`, atoms.length);
      return new Response(JSON.stringify({ atoms }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ AI content generation failed for all providers or no keys configured.');
      const errorMessage = generationError ? generationError.message : "Unknown error during AI generation.";
      return new Response(JSON.stringify({
        error: `AI content generation failed. Provider: ${providerUsed}. Details: ${errorMessage}`,
        details: generationError ? generationError.toString() : "No further details."
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ AI Content Generation main error catch:', error);
    // This catches errors from req.json() or other unexpected issues
    return new Response(JSON.stringify({ error: error.message, details: error.toString() }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
