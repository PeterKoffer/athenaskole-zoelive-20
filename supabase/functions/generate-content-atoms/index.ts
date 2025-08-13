// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Enhanced generate-content-atoms function called with curriculum integration');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('📋 Enhanced request data:', {
      kcId: requestData.kcId,
      hasCurriculumContext: !!requestData.curriculumContext,
      hasRealWorldApps: !!requestData.realWorldApplications,
      cognitiveLevel: requestData.cognitiveLevel
    });

    // Check for API key availability
    const openaiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
    const deepSeekKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('DeepSeek_API');
    
    if (!openaiKey && !deepSeekKey) {
      console.error('❌ No API keys found');
      return new Response(JSON.stringify({
        success: false,
        error: 'No API keys configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Generate unified training ground prompt
    const enhancedPrompt = `Create educational content atoms for ${requestData.subject || 'mathematics'} Grade ${requestData.gradeLevel || 4}.
    
    Content types needed: ${(requestData.contentTypes || ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE']).join(', ')}
    Maximum atoms: ${requestData.maxAtoms || 3}
    Knowledge component: ${requestData.kcId}
    
    Return valid JSON with an "atoms" array containing the educational content.`;

    // Add curriculum context if available
    let finalPrompt = enhancedPrompt;
    if (requestData.curriculumContext) {
      finalPrompt = `${requestData.curriculumContext}\n\n${enhancedPrompt}`;
    }

    // Add real-world scenario requirements
    if (requestData.realWorldApplications && requestData.realWorldApplications.length > 0) {
      finalPrompt += `\n\n🌍 REAL-WORLD INTEGRATION REQUIREMENTS:
- Incorporate these real-world applications: ${requestData.realWorldApplications.join(', ')}
- Create questions that connect math to everyday situations
- Use age-appropriate scenarios that students can relate to`;
    }

    // Add cross-subject connections
    if (requestData.crossSubjectConnections && requestData.crossSubjectConnections.length > 1) {
      finalPrompt += `\n\n🔗 CROSS-SUBJECT CONNECTIONS:
- Connect this math topic to: ${requestData.crossSubjectConnections.filter(s => s !== 'Mathematics').join(', ')}
- Show how math applies in other academic areas`;
    }

    console.log('🤖 Using enhanced curriculum-integrated prompt');

    // Try OpenAI first
    let generatedContent = null;
    let apiUsed = 'none';

    if (openaiKey) {
      try {
        console.log('🎯 Attempting enhanced OpenAI generation with curriculum context...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert K-12 curriculum designer and educational content creator. You specialize in creating engaging, standards-aligned math content that connects to real-world applications and student interests.' 
              },
              { role: 'user', content: finalPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content;
        
        try {
          generatedContent = JSON.parse(generatedText);
          apiUsed = 'openai-enhanced';
          console.log('✅ Enhanced OpenAI generation successful');
        } catch (parseError) {
          console.error('❌ Failed to parse OpenAI JSON response:', parseError);
          throw new Error('Invalid JSON response from OpenAI');
        }
      } catch (openaiError) {
        console.error('❌ Enhanced OpenAI generation failed:', openaiError);
        
        // Fallback to DeepSeek if available
        if (deepSeekKey) {
          console.log('🔄 Falling back to DeepSeek with curriculum context...');
          try {
            // Similar DeepSeek implementation would go here
            // For now, we'll throw the original error
            throw openaiError;
          } catch (deepSeekError) {
            console.error('❌ DeepSeek fallback also failed:', deepSeekError);
            throw openaiError;
          }
        } else {
          throw openaiError;
        }
      }
    }

    if (!generatedContent || !generatedContent.atoms) {
      console.error('❌ No valid content generated');
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to generate valid curriculum content'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Enhance generated atoms with curriculum metadata
    const enhancedAtoms = generatedContent.atoms.map((atom: any, index: number) => ({
      atom_id: `enhanced_${Date.now()}_${index}_${Math.random().toString(36).substring(7)}`,
      atom_type: atom.atom_type,
      content: {
        ...atom.content,
        // Ensure both correctAnswer and correct are set for compatibility
        correctAnswer: atom.content.correctAnswer ?? atom.content.correct ?? 0,
        correct: atom.content.correct ?? atom.content.correctAnswer ?? 0
      },
      kc_ids: [requestData.kcId],
      metadata: {
        source: 'enhanced_curriculum_ai',
        generated_at: Date.now(),
        curriculum_aligned: true,
        api_used: apiUsed,
        real_world_context: !!requestData.realWorldApplications,
        cross_subject_connected: !!requestData.crossSubjectConnections,
        cognitive_level: requestData.cognitiveLevel || 'understand'
      }
    }));

    console.log('✅ Enhanced curriculum-aligned content generated:', {
      atomCount: enhancedAtoms.length,
      apiUsed,
      hasCurriculumContext: !!requestData.curriculumContext,
      realWorldIntegrated: !!requestData.realWorldApplications
    });

    return new Response(JSON.stringify({
      success: true,
      atoms: enhancedAtoms,
      metadata: {
        curriculum_integrated: true,
        generation_method: 'enhanced_ai',
        api_used: apiUsed,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Enhanced content generation error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Enhanced content generation failed',
      debug: {
        errorName: error.name,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
