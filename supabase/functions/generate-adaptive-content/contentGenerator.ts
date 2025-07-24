// ============================================
// CONTENT GENERATOR - Uses unified prompt system
// ============================================

import { getPromptForContext, type PromptContext } from '../../../src/services/prompt-system/index.ts';
import { mapAppDataToPromptContext, type AppDataSources, validateDataSources } from '../../../src/services/prompt-system/dataMapping.ts';

export async function generateContentWithTrainingGroundPrompt(requestData: any) {
  const openaiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OpenAI API key not found');
  }

  try {
    // Map request data to standardized app data structure
    const dataSources: AppDataSources = {
      lessonContext: {
        subject: requestData.subject || 'Mathematics',
        requested_duration: requestData.lessonDuration
      },
      studentProfile: {
        grade_level: requestData.gradeLevel,
        learning_style_preference: requestData.learningStyle,
        interests: requestData.interests || requestData.studentInterests,
        performance_data: requestData.performanceData ? {
          accuracy: requestData.performanceData.accuracy || 0.75,
          engagement_level: requestData.performanceData.engagement || 'moderate'
        } : undefined,
        abilities_assessment: requestData.studentAbilities
      },
      teacherSettings: {
        teaching_approach: requestData.teachingPerspective || requestData.schoolPhilosophy,
        curriculum_alignment: requestData.curriculumStandards,
        lesson_duration_minutes: requestData.lessonDuration,
        subject_priorities: requestData.subjectPriorities
      },
      schoolConfig: {
        pedagogy: requestData.schoolPhilosophy,
        curriculum_standards: requestData.curriculumStandards,
        default_lesson_duration: 35
      },
      calendarData: {
        active_themes: requestData.calendarKeywords,
        seasonal_keywords: requestData.seasonalKeywords,
        current_unit_duration: requestData.calendarDuration,
        unit_timeframe: requestData.unitTimeframe
      }
    };

    // Validate we have sufficient data
    const validation = validateDataSources(dataSources);
    if (!validation.isValid) {
      console.warn('Missing required data for Training Ground prompt:', validation.missing);
    }
    if (validation.warnings.length > 0) {
      console.info('Training Ground prompt warnings:', validation.warnings);
    }

    // Build comprehensive context using the 12-parameter system
    const context: PromptContext = mapAppDataToPromptContext(dataSources);

    const prompt = getPromptForContext('training-ground', context);
    
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
            content: 'You are a creative educational activity designer who NEVER creates quizzes or multiple choice questions. You design hands-on, interactive, and imaginative learning experiences that feel like games and adventures. You must follow the user\'s format requirements exactly and avoid any quiz-style content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 1200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('📝 Raw Training Ground response:', generatedText.substring(0, 200) + '...');

    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedContent = JSON.parse(cleanedResponse);

    // Validate Training Ground activity format
    if (!parsedContent.title || !parsedContent.activity || !parsedContent.activity.type) {
      throw new Error('Invalid Training Ground activity format from OpenAI');
    }

    console.log('✅ Training Ground activity generated:', {
      hasTitle: !!parsedContent.title,
      hasActivity: !!parsedContent.activity,
      activityType: parsedContent.activity?.type
    });

    return parsedContent;
  } catch (error) {
    console.error('❌ Training Ground generation failed:', error);
    throw error;
  }
}

export async function generateContentWithOpenAI(requestData: any) {
  const openaiKey = Deno.env.get('OpenaiAPI') || Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not found');
  }

  console.log('🔑 Using OpenAI API key:', {
    keySource: Deno.env.get('OpenaiAPI') ? 'OpenaiAPI' : 'OPENAI_API_KEY',
    keyLength: openaiKey.length,
    keyPreview: openaiKey.substring(0, 7) + '...' + openaiKey.slice(-4)
  });

  console.log('🤖 generateContentWithOpenAI called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });

  try {
    // Build context for daily lesson
    const context: PromptContext = {
      subject: requestData.subject || 'general learning',
      gradeLevel: requestData.gradeLevel || 5,
      performanceLevel: requestData.performanceLevel || 'average',
      learningStyle: requestData.learningStyle || 'mixed',
      interests: requestData.interests || [],
      schoolPhilosophy: requestData.schoolPhilosophy,
      calendarKeywords: requestData.calendarKeywords || []
    };

    const prompt = getPromptForContext('daily-lesson', context);

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
            content: 'You are an expert educational content creator. Generate age-appropriate, engaging questions for K-12 students. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('📝 Raw OpenAI response:', generatedText.substring(0, 200) + '...');

    // Parse JSON response
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedContent = JSON.parse(cleanedResponse);

    // Validate required fields
    if (!parsedContent.question || !parsedContent.options || !Array.isArray(parsedContent.options)) {
      throw new Error('Invalid response format from OpenAI');
    }

    console.log('✅ OpenAI content generated successfully');
    return parsedContent;

  } catch (error) {
    console.error('❌ OpenAI generation failed:', error);
    throw error;
  }
}

export async function generateContentWithDeepSeek(requestData: any) {
  const deepSeekKey = Deno.env.get('DEEPSEEK_API_KEY') || Deno.env.get('DeepSeek_API');
  
  if (!deepSeekKey) {
    throw new Error('DeepSeek API key not found');
  }

  console.log('🔑 Using DeepSeek API key:', {
    keySource: Deno.env.get('DEEPSEEK_API_KEY') ? 'DEEPSEEK_API_KEY' : 'DeepSeek_API',
    keyLength: deepSeekKey.length,
    keyPreview: deepSeekKey.substring(0, 7) + '...' + deepSeekKey.slice(-4)
  });

  console.log('🤖 generateContentWithDeepSeek called with:', {
    subject: requestData.subject,
    skillArea: requestData.skillArea,
    difficultyLevel: requestData.difficultyLevel,
    gradeLevel: requestData.gradeLevel,
    hasStandardsAlignment: !!requestData.standardsAlignment
  });

  try {
    // Build context for daily lesson
    const context: PromptContext = {
      subject: requestData.subject || 'general learning',
      gradeLevel: requestData.gradeLevel || 5,
      performanceLevel: requestData.performanceLevel || 'average',
      learningStyle: requestData.learningStyle || 'mixed',
      interests: requestData.interests || [],
      schoolPhilosophy: requestData.schoolPhilosophy,
      calendarKeywords: requestData.calendarKeywords || []
    };

    const prompt = getPromptForContext('daily-lesson', context);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Generate age-appropriate, engaging questions for K-12 students. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API error:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('📝 Raw DeepSeek response:', generatedText.substring(0, 200) + '...');

    // Parse JSON response
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedContent = JSON.parse(cleanedResponse);

    // Validate required fields
    if (!parsedContent.question || !parsedContent.options || !Array.isArray(parsedContent.options)) {
      throw new Error('Invalid response format from DeepSeek');
    }

    console.log('✅ DeepSeek content generated successfully');
    return parsedContent;

  } catch (error) {
    console.error('❌ DeepSeek generation failed:', error);
    throw error;
  }
}