// @ts-nocheck
// AI Provider Configuration and Generation Logic

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") || Deno.env.get("DeepSeek_API");

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

export interface Atom {
  atom_id: string;
  atom_type: string;
  content: any;
  kc_ids: string[];
  metadata: any;
}

export async function generateWithAI(
  apiKey: string,
  apiEndpoint: string,
  model: string,
  kcId: string,
  userId: string,
  contentTypes: string[],
  maxAtoms: number,
  providerName: string,
  enhancedPrompt: string,
  attemptNumber: number = 1
): Promise<Atom[]> {
  console.log(`🚀 AI Generation Attempt #${attemptNumber} with ${providerName}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
        temperature: 0.8 + (attemptNumber * 0.1),
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

    const timestamp = Date.now();
    return aiGeneratedData.atoms.map((atom: any, index: number) => ({
      atom_id: `ai_${providerName.toLowerCase()}_${timestamp}_${index + 1}_attempt${attemptNumber}`,
      atom_type: atom.atom_type,
      content: atom.content,
      kc_ids: [kcId],
      metadata: {
        difficulty: 0.7,
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

export async function generateWithEnhancedRetry(
  kcId: string, 
  userId: string, 
  contentTypes: string[], 
  maxAtoms: number,
  enhancedPrompt: string
): Promise<Atom[]> {
  const maxAttempts = 3;
  let lastError = null;

  // Try OpenAI with multiple attempts
  if (OPENAI_API_KEY) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🎯 OpenAI Generation - Attempt ${attempt}/${maxAttempts}`);
        const atoms = await generateWithAI(
          OPENAI_API_KEY, 
          OPENAI_ENDPOINT, 
          "gpt-4o-mini", 
          kcId, 
          userId, 
          contentTypes, 
          maxAtoms, 
          "OpenAI", 
          enhancedPrompt,
          attempt
        );
        if (atoms.length > 0) {
          console.log(`🎉 OpenAI SUCCESS on attempt ${attempt}: ${atoms.length} atoms generated`);
          return atoms;
        }
      } catch (error) {
        console.warn(`⚠️ OpenAI attempt ${attempt} failed:`, error.message);
        lastError = error;
        
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
        const atoms = await generateWithAI(
          DEEPSEEK_API_KEY, 
          DEEPSEEK_ENDPOINT, 
          "deepseek-chat", 
          kcId, 
          userId, 
          contentTypes, 
          maxAtoms, 
          "DeepSeek", 
          enhancedPrompt,
          attempt
        );
        if (atoms.length > 0) {
          console.log(`🎉 DeepSeek SUCCESS on attempt ${attempt}: ${atoms.length} atoms generated`);
          return atoms;
        }
      } catch (error) {
        console.warn(`⚠️ DeepSeek attempt ${attempt} failed:`, error.message);
        lastError = error;
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  console.error(`❌ ALL AI GENERATION ATTEMPTS FAILED after ${maxAttempts * 2} tries`);
  throw lastError || new Error("All AI providers failed");
}
