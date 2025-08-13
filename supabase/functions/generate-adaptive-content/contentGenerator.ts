// @ts-nocheck
// ============================================
// CONTENT GENERATOR - Uses unified prompt system

// Local prompt types and builders (edge functions cannot import from src)
interface PromptContext {
  subject: string;
  gradeLevel: number;
  curriculumStandards?: string;
  teachingPerspective?: string;
  lessonDuration?: number;
  subjectWeight?: 'high' | 'medium' | 'low';
  calendarKeywords?: string[];
  calendarDuration?: string;
  studentAbilities?: string;
  learningStyle?: string;
  studentInterests?: string[];
  performanceLevel?: 'below' | 'average' | 'above';
  interests?: string[];
  schoolPhilosophy?: string;
}

type AppDataSources = {
  lessonContext: { subject?: string; requested_duration?: number };
  studentProfile: {
    grade_level?: number;
    learning_style_preference?: string;
    interests?: string[];
    performance_data?: { accuracy?: number; engagement_level?: string };
    abilities_assessment?: string;
  };
  teacherSettings: {
    teaching_approach?: string;
    curriculum_alignment?: string;
    lesson_duration_minutes?: number;
    subject_priorities?: Array<'high' | 'medium' | 'low'>;
  };
  schoolConfig: {
    pedagogy?: string;
    curriculum_standards?: string;
    default_lesson_duration?: number;
  };
  calendarData: {
    active_themes?: string[];
    seasonal_keywords?: string[];
    current_unit_duration?: string;
    unit_timeframe?: string;
  };
};

function validateDataSources(sources: AppDataSources) {
  const missing: string[] = [];
  if (!sources.lessonContext.subject) missing.push('lessonContext.subject');
  if (!sources.studentProfile.grade_level) missing.push('studentProfile.grade_level');
  const warnings: string[] = [];
  return { isValid: missing.length === 0, missing, warnings };
}

function determineAbility(perf?: { accuracy?: number }) {
  const acc = perf?.accuracy;
  if (typeof acc !== 'number') return 'average';
  if (acc < 0.7) return 'below';
  if (acc > 0.85) return 'above';
  return 'average';
}

function mapAppDataToPromptContext(s: AppDataSources): PromptContext {
  const subject = s.lessonContext.subject || 'general learning';
  const gradeLevel = s.studentProfile.grade_level || 5;
  const curriculumStandards = s.teacherSettings.curriculum_alignment || s.schoolConfig.curriculum_standards || 'broadly accepted topics and skills for that grade';
  const teachingPerspective = s.teacherSettings.teaching_approach || s.schoolConfig.pedagogy || 'balanced, evidence-based style';
  const lessonDuration = s.teacherSettings.lesson_duration_minutes || s.schoolConfig.default_lesson_duration || s.lessonContext.requested_duration || 35;
  const subjectWeight = (s.teacherSettings.subject_priorities && s.teacherSettings.subject_priorities[0]) || 'medium';
  const calendarKeywords = s.calendarData.active_themes || s.calendarData.seasonal_keywords || [];
  const calendarDuration = s.calendarData.current_unit_duration || s.calendarData.unit_timeframe || 'this week';
  const studentInterests = s.studentProfile.interests || [];
  const learningStyle = s.studentProfile.learning_style_preference || 'mixed';
  const studentAbilities = s.studentProfile.abilities_assessment || determineAbility(s.studentProfile.performance_data);
  const performanceLevel = determineAbility(s.studentProfile.performance_data) as 'below' | 'average' | 'above';
  const schoolPhilosophy = s.schoolConfig.pedagogy;

  return { subject, gradeLevel, curriculumStandards, teachingPerspective, lessonDuration, subjectWeight, calendarKeywords, calendarDuration, studentAbilities, learningStyle, studentInterests, performanceLevel, interests: studentInterests, schoolPhilosophy };
}

function buildTrainingGroundPrompt(context: PromptContext): string {
  const {
    subject,
    gradeLevel,
    curriculumStandards = 'broadly accepted topics and skills for that grade',
    teachingPerspective = 'balanced, evidence-based style',
    lessonDuration = 35,
    subjectWeight = 'medium',
    calendarKeywords = [],
    calendarDuration = 'standalone session',
    studentAbilities = 'mixed ability with both support and challenges',
    learningStyle = 'multimodal approach',
    studentInterests = []
  } = context;

  const keywordText = calendarKeywords.length > 0
    ? `the context of ${calendarKeywords.join(', ')} over the next ${calendarDuration}`
    : 'general, timeless examples appropriate for any time of year';
  const interestText = studentInterests.length > 0 ? studentInterests.join(', ') : "the student's general interests";
  const abilityAdaptation = studentAbilities;
  const learningStyleAdaptation = learningStyle;

  return `You are a world-class ${subject} teacher and imaginative storyteller creating an immersive, game-like lesson for a Grade ${gradeLevel} student.
The lesson must align fully with ${curriculumStandards} and follow the school's ${teachingPerspective} teaching approach.

Design a dynamic, interactive learning adventure lasting about ${lessonDuration} minutes.
${subject} is a ${subjectWeight} priority in our curriculum, so adjust depth accordingly.
Incorporate ${keywordText} and adapt to the student's level — ${abilityAdaptation} — and preferred learning style — ${learningStyleAdaptation}.
Incorporate their personal interests: ${interestText}.

The adventure must have:
1) An exciting opening scenario that hooks the student immediately — they are solving a mystery, helping someone, exploring a strange world, or repairing a crisis.
2) Multiple stages or “scenes”, each with:
   - A short chunk of story (very concise).
   - An activity or challenge directly tied to ${subject}.
   - Clear instructions for the activity.
3) A variety of challenge types (not just multiple choice). Include a mix of:
   - multipleChoice, fillBlank, puzzle, matching, sequencing, experiment, creativeTask
4) Pacing that fills the whole ${lessonDuration} minutes — provide OPTIONAL "bonusMissions" so faster students stay engaged, while slower students can still reach the ending.
5) A satisfying conclusion that rewards the student.

Return ONLY JSON in this exact schema (no extra prose):

{
  "title": "string",
  "scenario": "string",
  "stages": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": 0,
        "expectedAnswer": "string",
        "rubric": "string",
        "explanation": "string"
      },
      "imagePrompts": [
        "string (describe an image to generate for this scene or concept)",
        "string"
      ]
    }
  ],
  "bonusMissions": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": { "question": "string", "options": [], "expectedAnswer": "string", "rubric": "string", "explanation": "string" },
      "imagePrompts": ["string"]
    }
  ],
  "objectives": ["string", "string"],
  "estimatedTime": ${lessonDuration}
}

Rules:
- Keep story chunks short and energetic.
- Each stage must include exactly one activity.
- Activities must directly teach or practice ${subject} content aligned with ${curriculumStandards}.
- Use ${abilityAdaptation} and ${learningStyleAdaptation} to tailor wording and supports.
- Use ${interestText} for light theming (names, settings, examples).
- Provide 1–3 imagePrompts per stage for visuals (scenes, diagrams, characters).
- Ensure exactly ONE correct answer for multipleChoice. Provide ` + "`expectedAnswer`" + ` for non-MC activities.
- Do NOT include any text outside the JSON.`;
}

function buildDailyLessonPrompt(context: PromptContext): string {
  const { subject, gradeLevel, performanceLevel = 'average', learningStyle = 'mixed' } = context;
  return `You are a world-class ${subject} teacher and imaginative storyteller creating an immersive, game-like lesson for Grade ${gradeLevel}.

Design a dynamic, interactive learning adventure lasting about 35 minutes.
Use age-appropriate language and adapt to the student's performance level (${performanceLevel}) and learning style (${learningStyle}).

Return ONLY JSON in this exact schema (no extra prose):
{
  "title": "string",
  "scenario": "string",
  "stages": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correct": 0,
        "expectedAnswer": "string",
        "rubric": "string",
        "explanation": "string"
      },
      "imagePrompts": [
        "string (describe an image to generate for this scene or concept)",
        "string"
      ]
    }
  ],
  "bonusMissions": [
    {
      "story": "string",
      "activityType": "multipleChoice | fillBlank | puzzle | matching | sequencing | experiment | creativeTask",
      "activity": { "question": "string", "options": [], "expectedAnswer": "string", "rubric": "string", "explanation": "string" },
      "imagePrompts": ["string"]
    }
  ],
  "objectives": ["string", "string"],
  "estimatedTime": 35
}

Rules:
- Keep story chunks short and energetic.
- Each stage must include exactly one activity.
- Activities must directly teach or practice ${subject} content suitable for Grade ${gradeLevel}.
- Tailor wording and supports to ${performanceLevel} performance and ${learningStyle} learning style.
- Provide 1–3 imagePrompts per stage for visuals.
- Ensure exactly ONE correct answer for multipleChoice. Provide ` + "`expectedAnswer`" + ` for non-MC activities.
- Do NOT include any text outside the JSON.`;
}


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

    const prompt = buildTrainingGroundPrompt(context);
    
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
            content: 'You are an expert educational content creator. Always respond with valid JSON only. Follow the user\'s format exactly and do not include any text outside the JSON.'
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

    console.log('📝 Raw Training Ground response:', generatedText.substring(0, 500) + '...');

    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('🔍 Raw response causing error:', generatedText);
      
      // Try to fix common JSON issues
      let fixedResponse = cleanedResponse;
      
      // Fix unterminated strings by finding the last complete object
      const lastBraceIndex = cleanedResponse.lastIndexOf('}');
      if (lastBraceIndex > 0) {
        fixedResponse = cleanedResponse.substring(0, lastBraceIndex + 1);
        console.log('🔧 Attempting to fix truncated JSON...');
        
        try {
          parsedContent = JSON.parse(fixedResponse);
          console.log('✅ Fixed JSON successfully');
        } catch (secondError) {
          console.error('❌ Could not fix JSON:', secondError.message);
          throw new Error(`Invalid JSON from OpenAI: ${parseError.message}\n\nResponse: ${generatedText}`);
        }
      } else {
        throw new Error(`Invalid JSON from OpenAI: ${parseError.message}\n\nResponse: ${generatedText}`);
      }
    }

    // Validate Interactive Adventure format
    if (!parsedContent.title || !parsedContent.scenario || !Array.isArray(parsedContent.stages) || parsedContent.stages.length === 0) {
      throw new Error('Invalid Interactive Adventure format from OpenAI');
    }

    console.log('✅ Interactive Adventure generated:', {
      hasTitle: !!parsedContent.title,
      stagesCount: parsedContent.stages?.length,
      firstActivityType: parsedContent.stages?.[0]?.activityType
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

    const prompt = buildDailyLessonPrompt(context);

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
            content: 'You are an expert educational content creator. Always respond with valid JSON only. Follow the user\'s format exactly and do not include any text outside the JSON.'
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

    console.log('📝 Raw OpenAI response:', generatedText.substring(0, 500) + '...');

    // Parse JSON response with better error handling
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('🔍 Raw response causing error:', generatedText);
      
      // Try to fix common JSON issues more aggressively
      let fixedResponse = cleanedResponse;
      
      // Fix unterminated strings by finding the last complete object
      const lastBraceIndex = cleanedResponse.lastIndexOf('}');
      if (lastBraceIndex > 0) {
        fixedResponse = cleanedResponse.substring(0, lastBraceIndex + 1);
        console.log('🔧 Attempting to fix truncated JSON...');
        
        try {
          // Try to complete any unterminated strings
          fixedResponse = fixedResponse.replace(/("[^"]*$)/, '$1"');
          // Try to add missing closing brackets
          const openBraces = (fixedResponse.match(/\{/g) || []).length;
          const closeBraces = (fixedResponse.match(/\}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedResponse += '}'.repeat(openBraces - closeBraces);
          }
          
          parsedContent = JSON.parse(fixedResponse);
          console.log('✅ Fixed JSON successfully');
        } catch (secondError) {
          console.error('❌ Could not fix JSON:', secondError.message);
          // Return a fallback structure for daily lessons
          parsedContent = {
            title: "Math Adventure",
            scenario: "Join a math quest to solve real-world challenges!",
            stages: [
              {
                story: "You start your math adventure by solving basic problems.",
                activityType: "multipleChoice",
                activity: {
                  question: "What is 2 + 2?",
                  options: ["3", "4", "5", "6"],
                  correct: 1,
                  expectedAnswer: "4",
                  explanation: "2 + 2 equals 4"
                }
              }
            ]
          };
          console.log('🔄 Using fallback content due to JSON parsing failure');
        }
      } else {
        throw new Error(`Invalid JSON from OpenAI: ${parseError.message}\n\nResponse: ${generatedText}`);
      }
    }

    // Validate Interactive Adventure format (Daily Program)
    if (!parsedContent.title || !parsedContent.scenario || !Array.isArray(parsedContent.stages) || parsedContent.stages.length === 0) {
      throw new Error('Invalid Interactive Adventure format from OpenAI');
    }

    console.log('✅ Interactive Adventure generated (daily):', {
      hasTitle: !!parsedContent.title,
      stagesCount: parsedContent.stages?.length,
      firstActivityType: parsedContent.stages?.[0]?.activityType
    });
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

    const prompt = buildDailyLessonPrompt(context);

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
            content: 'You are an expert educational content creator. Always respond with valid JSON only. Follow the user\'s format exactly and do not include any text outside the JSON.'
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

    console.log('📝 Raw DeepSeek response:', generatedText.substring(0, 500) + '...');

    // Parse JSON response with better error handling
    const cleanedResponse = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('🔍 Raw response causing error:', generatedText);
      
      // Try to fix common JSON issues
      let fixedResponse = cleanedResponse;
      
      // Fix unterminated strings by finding the last complete object
      const lastBraceIndex = cleanedResponse.lastIndexOf('}');
      if (lastBraceIndex > 0) {
        fixedResponse = cleanedResponse.substring(0, lastBraceIndex + 1);
        console.log('🔧 Attempting to fix truncated JSON...');
        
        try {
          parsedContent = JSON.parse(fixedResponse);
          console.log('✅ Fixed JSON successfully');
        } catch (secondError) {
          console.error('❌ Could not fix JSON:', secondError.message);
          throw new Error(`Invalid JSON from DeepSeek: ${parseError.message}\n\nResponse: ${generatedText}`);
        }
      } else {
        throw new Error(`Invalid JSON from DeepSeek: ${parseError.message}\n\nResponse: ${generatedText}`);
      }
    }

    // Validate Interactive Adventure format (Daily Program - DeepSeek)
    if (!parsedContent.title || !parsedContent.scenario || !Array.isArray(parsedContent.stages) || parsedContent.stages.length === 0) {
      throw new Error('Invalid Interactive Adventure format from DeepSeek');
    }

    console.log('✅ Interactive Adventure generated (daily, DeepSeek):', {
      hasTitle: !!parsedContent.title,
      stagesCount: parsedContent.stages?.length,
      firstActivityType: parsedContent.stages?.[0]?.activityType
    });
    return parsedContent;

  } catch (error) {
    console.error('❌ DeepSeek generation failed:', error);
    throw error;
  }
}