
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { generateWithEnhancedRetry, type Atom } from './ai-providers.ts';
import { createEnhancedPrompt } from './prompt-enhancer.ts';
import { validateAndCorrectAIContent } from './validation-utils.ts';
import { generateMinimalFallback } from './fallback-generator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      
      // Create enhanced prompt for better AI generation
      const enhancedPrompt = createEnhancedPrompt(kcId, userId, contentTypes, maxAtoms, "AI Enhanced", 1);
      
      atoms = await generateWithEnhancedRetry(kcId, userId, contentTypes, maxAtoms, enhancedPrompt);
      
      // Validate and correct AI-generated content
      validateAndCorrectAIContent(atoms);
      
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
