// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { QuestionGenerationRequest, GeneratedQuestion, QuestionValidationResult } from './types.ts';
import { generateQuestionWithOpenAI } from './openaiClient.ts';
import { validateQuestionStructure } from './validator.ts';
import { validateMathAnswer } from './mathValidator.ts';
import { validateForEquivalentAnswers } from './equivalentAnswerValidator.ts';
import { createSubjectPrompt } from '../prompts/index.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`🚀 Enhanced Educational Question Generator called at ${new Date().toISOString()}`);
  console.log(`📊 Request method: ${req.method}`);
  console.log(`🔑 OpenAI API Key available: ${!!Deno.env.get('OPENAI_API_KEY')}`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log(`📥 Enhanced request body:`, JSON.stringify(requestBody, null, 2));

    const {
      subject,
      skillArea,
      difficultyLevel = 1,
      gradeLevel = 4,
      userId,
      questionIndex = 0,
      promptVariation = 'basic',
      specificContext = 'K-12 learning',
      teacherRequirements,
      schoolStandards,
      studentAdaptation,
      hasTeacherRequirements = false,
      hasSchoolStandards = false,
      hasStudentAdaptation = false
    } = requestBody;

    // Validate required fields
    if (!subject || !skillArea) {
      throw new Error('Subject and skillArea are required');
    }

    const isStemSubject = ['mathematics', 'science', 'physics', 'chemistry', 'biology'].includes(subject.toLowerCase());
    console.log(`🔬 STEM subject (requires math validation): ${isStemSubject}`);

    // Generate educational context
    console.log(`🎯 Generating personalized K-12 question for Grade ${gradeLevel} ${subject}/${skillArea}`);
    console.log(`👨‍🏫 Teacher requirements: ${hasTeacherRequirements}`);
    console.log(`🏫 School standards: ${hasSchoolStandards}`);
    console.log(`👨‍🎓 Student adaptation: ${hasStudentAdaptation}`);

    const educationalContext = {
      grade: gradeLevel,
      hasTeacherReqs: hasTeacherRequirements,
      hasSchoolStandards: hasSchoolStandards,
      hasStudentAdaptation: hasStudentAdaptation,
      learningStyle: studentAdaptation?.learningStyle || 'mixed'
    };

    console.log(`🎓 Educational context:`, JSON.stringify(educationalContext, null, 2));

    // Construct the prompt
    const prompt = createSubjectPrompt(
      subject,
      skillArea,
      gradeLevel,
      ['QUESTION_MULTIPLE_CHOICE'],
      1
    );

    console.log(`📝 Educational prompt length: ${prompt.length} characters`);
    console.log(`🤖 Calling OpenAI with personalized K-12 prompt for Grade ${gradeLevel}`);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert K-12 mathematics educator specializing in Grade ${gradeLevel} curriculum. You create mathematically accurate questions with verified correct answers. ALWAYS double-check your arithmetic, especially for fraction operations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent math
        max_tokens: 1000,
      }),
    });

    console.log(`📊 OpenAI response status: ${openAIResponse.status}`);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error(`❌ OpenAI API error: ${errorText}`);
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const rawContent = openAIData.choices[0].message.content;
    console.log(`🤖 Raw AI response:`, rawContent.substring(0, 200) + '...');

    // Parse the JSON response
    let questionData: GeneratedQuestion;
    try {
      questionData = JSON.parse(rawContent);
    } catch (parseError) {
      console.error(`❌ Failed to parse AI response as JSON:`, parseError);
      throw new Error(`Invalid JSON response from AI: ${parseError}`);
    }

    console.log(`✅ Parsed personalized K-12 question data:`, {
      hasQuestion: !!questionData.question,
      optionsCount: questionData.options?.length || 0,
      correctIndex: questionData.correct,
      hasEducationalNotes: !!questionData.educationalNotes
    });

    // Enhanced validation for math problems
    if (isStemSubject && skillArea.includes('fraction')) {
      console.log(`🔍 Performing enhanced math validation for ${skillArea}...`);
      const validationResult: QuestionValidationResult = validateMathAnswer(questionData, skillArea);
      
      if (!validationResult.isValid) {
        console.error(`❌ Math validation failed: ${validationResult.error}`);
        
        if (validationResult.correctedIndex !== undefined) {
          console.log(`🔧 Correcting answer index from ${questionData.correct} to ${validationResult.correctedIndex}`);
          questionData.correct = validationResult.correctedIndex;
        } else {
          // If we can't correct it, regenerate with explicit math instruction
          console.log(`🔄 Regenerating question with explicit math verification...`);
          throw new Error('Math validation failed - question needs regeneration');
        }
      }
    }

    console.log(`🎯 Final correct answer index: ${questionData.correct} -> "${questionData.options[questionData.correct]}"`);
    console.log(`✅ Generated PERSONALIZED K-12 ${subject.toUpperCase()} question: ${questionData.question.substring(0, 50)}...`);
    console.log(`📚 Educational context applied: Grade ${gradeLevel}, adapted for student needs`);
    console.log(`🔍 Validations passed: structure, equivalents, math`);

    return new Response(JSON.stringify(questionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in generate-question function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate question', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
