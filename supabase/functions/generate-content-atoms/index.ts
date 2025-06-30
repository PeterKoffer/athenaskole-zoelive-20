
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🤖 AI Content Generation started');
    
    const { kcId, userId, contentTypes, maxAtoms } = await req.json();
    
    console.log('📝 Request details:', { kcId, userId, contentTypes, maxAtoms });

    // Simulate AI content generation (replace with actual AI call)
    const timestamp = Date.now();
    const atoms = [
      {
        atom_id: `ai_${timestamp}_1`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `AI-Generated Introduction to ${kcId}`,
          explanation: `This is an AI-generated explanation tailored to your learning needs. We'll explore the key concepts step by step.`,
          examples: [`AI example for ${kcId}`]
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 0.5,
          estimatedTimeMs: 30000,
          source: 'ai_generated',
          model: 'content-generator-v1',
          generated_at: timestamp
        }
      },
      {
        atom_id: `ai_${timestamp}_2`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: `AI-generated question: What is the most important aspect of ${kcId}?`,
          options: [
            'Understanding the fundamentals',
            'Memorizing formulas',
            'Skipping the basics',
            'Avoiding practice'
          ],
          correctAnswer: 0,
          correct: 0,
          explanation: 'AI-generated explanation: Understanding fundamentals is crucial for building strong knowledge.',
          correctFeedback: 'Excellent! AI confirms this is the right approach.',
          generalIncorrectFeedback: 'AI suggests reviewing the fundamental concepts first.'
        },
        kc_ids: [kcId],
        metadata: {
          difficulty: 0.5,
          estimatedTimeMs: 45000,
          source: 'ai_generated',
          model: 'content-generator-v1',
          generated_at: timestamp
        }
      }
    ];

    console.log('✅ AI content generated successfully');

    return new Response(JSON.stringify({ atoms }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ AI Content Generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
