import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types for Adventure Lesson Generation
interface AdventureMetadata {
  id: string;
  title: string;
  subject: string;
  category: string;
  gradeLevel: string;
  description: string;
  tags: string[];
  crossSubjects: string[];
}

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
}

interface AdventureLessonRequest {
  adventure: AdventureMetadata;
  studentProfile?: {
    abilities?: string;
    learningStyle?: string;
    interests?: string[];
  };
  schoolSettings?: {
    curriculum?: string;
    teachingPerspective?: string;
    lessonDuration?: number;
  };
  teacherPreferences?: {
    subjectWeights?: Record<string, 'high' | 'medium' | 'low'>;
  };
  calendarContext?: {
    keywords?: string[];
    duration?: string;
  };
}

// Daily Lesson Prompt Generator
function createDailyLessonPrompt(context: PromptContext, adventureTitle: string): string {
  const {
    subject,
    gradeLevel,
    curriculumStandards = 'broadly accepted topics and skills for that grade',
    teachingPerspective = 'balanced, evidence-based style',
    lessonDuration = 135,
    subjectWeight = 'medium',
    calendarKeywords = [],
    calendarDuration = 'standalone session',
    studentAbilities = 'mixed ability with both support and challenges',
    learningStyle = 'multimodal approach',
    studentInterests = [],
  } = context;

  const keywordText = calendarKeywords.length > 0
    ? `the context of ${calendarKeywords.join(', ')} over the next ${calendarDuration}`
    : 'general, timeless examples appropriate for any time of year';
  const interestText = studentInterests.length > 0
    ? studentInterests.join(', ')
    : "the student's general interests";

  return `You are a world-class ${subject} teacher and imaginative storyteller creating an immersive, game-like lesson for Grade ${gradeLevel} based on the adventure "${adventureTitle}".
The lesson must align fully with ${curriculumStandards} and follow the school's ${teachingPerspective} teaching approach.

Design a dynamic, interactive learning adventure lasting about ${lessonDuration} minutes.
${subject} is a ${subjectWeight} priority in our curriculum, so adjust depth accordingly.
Incorporate ${keywordText} and adapt to the student's level — ${studentAbilities} — and preferred learning style — ${learningStyle}.
Incorporate their personal interests: ${interestText}.

The adventure must have:
1) An exciting opening scenario that hooks the student immediately — they are solving a mystery, helping someone, exploring a strange world, or repairing a crisis related to "${adventureTitle}".
2) Multiple stages or "scenes", each with:
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
- Use ${studentAbilities} and ${learningStyle} to tailor wording and supports.  
- Use ${interestText} for light theming (names, settings, examples).
- Provide 1–3 imagePrompts per stage for visuals (scenes, diagrams, characters).
- Ensure exactly ONE correct answer for multipleChoice. Provide expectedAnswer for non-MC activities.
- Do NOT include any text outside the JSON.`;
}

// Convert grade level string to number
function parseGradeLevel(gradeLevel: string): number {
  if (gradeLevel.includes('K-2')) return 1;
  if (gradeLevel.includes('3-5')) return 4;
  if (gradeLevel.includes('6-8')) return 7;
  if (gradeLevel.includes('9-10')) return 9;  
  if (gradeLevel.includes('11-12')) return 11;
  
  // Try to extract number from string like "Grade 6"
  const match = gradeLevel.match(/\d+/);
  return match ? parseInt(match[0]) : 6; // Default to grade 6
}

// Build PromptContext from adventure request
function buildPromptContext(request: AdventureLessonRequest): PromptContext {
  const { adventure, studentProfile, schoolSettings, teacherPreferences, calendarContext } = request;
  
  return {
    subject: adventure.subject,
    gradeLevel: parseGradeLevel(adventure.gradeLevel),
    curriculumStandards: schoolSettings?.curriculum || 'broadly accepted topics and skills for that grade',
    teachingPerspective: schoolSettings?.teachingPerspective || 'balanced, evidence-based style',
    lessonDuration: schoolSettings?.lessonDuration || 35,
    subjectWeight: teacherPreferences?.subjectWeights?.[adventure.subject] || 'medium',
    calendarKeywords: calendarContext?.keywords || ['interactive learning', 'problem solving'],
    calendarDuration: calendarContext?.duration || 'single session',
    studentAbilities: studentProfile?.abilities || 'mixed ability with both support and challenges',
    learningStyle: studentProfile?.learningStyle || 'multimodal approach',
    studentInterests: studentProfile?.interests || ['technology', 'games', 'creativity']
  };
}

// Call OpenAI API
async function callOpenAI(prompt: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log('🤖 Calling OpenAI for adventure lesson generation...');
  console.log('🔑 API Key configured:', openaiApiKey ? `Yes (${openaiApiKey.substring(0, 8)}...)` : 'No');
  console.log('✏️ Generated prompt length:', prompt.length);
  
  const requestBody = {
    model: 'gpt-5-mini-2025-08-07',
    messages: [
      {
        role: 'system',
        content: 'You are an expert educational content generator. Create a complete lesson plan and return only valid JSON as requested. Be concise but comprehensive.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_completion_tokens: 4000,
  };

  console.log('📤 Request model:', requestBody.model);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('📥 Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🤖 OpenAI response received');
  
  if (!data.choices?.[0]?.message?.content) {
    console.error('Invalid OpenAI response - missing content:', JSON.stringify(data));
    
    // Check if it was truncated due to length
    if (data.choices?.[0]?.finish_reason === 'length') {
      throw new Error('Response truncated due to length limit. Please try again with a shorter prompt.');
    }
    
    throw new Error('Invalid response from OpenAI - no content received');
  }
  
  const content = data.choices[0].message.content.trim();
  if (!content) {
    throw new Error('OpenAI returned empty content');
  }

  console.log('✅ Successfully received OpenAI response');
  return content;
}

// Parse and validate JSON response
function parseAndValidateLesson(jsonContent: string): any {
  try {
    const parsed = JSON.parse(jsonContent);
    
    // Basic validation
    if (!parsed.title || !parsed.scenario || !parsed.stages) {
      throw new Error('Missing required fields in generated lesson');
    }
    
    if (!Array.isArray(parsed.stages) || parsed.stages.length === 0) {
      throw new Error('Lesson must have at least one stage');
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse OpenAI response as JSON:', error);
    console.error('Raw content:', jsonContent.substring(0, 500) + '...');
    throw new Error('Failed to parse lesson content from AI response');
  }
}

// Main lesson generation function
async function generateAdventureLesson(request: AdventureLessonRequest) {
  console.log('🚀 Starting adventure lesson generation for:', request.adventure.title);
  
  // Build prompt context
  const context = buildPromptContext(request);
  console.log('📋 Built prompt context:', context);
  
  // Generate prompt
  const prompt = createDailyLessonPrompt(context, request.adventure.title);
  
  // Call OpenAI
  const rawResponse = await callOpenAI(prompt);
  console.log('📥 Received OpenAI response');
  
  // Parse and validate
  const lesson = parseAndValidateLesson(rawResponse);
  console.log('✅ Successfully generated lesson with', lesson.stages?.length, 'stages');
  
  return {
    success: true,
    lesson,
    metadata: {
      adventureId: request.adventure.id,
      generatedAt: new Date().toISOString(),
      promptContext: context
    }
  };
}

// Edge function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting generate-adventure-lesson function');
    
    const requestData: AdventureLessonRequest = await req.json();
    console.log('📨 Received request for adventure:', requestData?.adventure?.title);
    
    if (!requestData?.adventure) {
      console.error('❌ No adventure metadata provided');
      throw new Error('Adventure metadata is required');
    }
    
    console.log('✅ Adventure metadata valid, generating lesson...');
    
    const result = await generateAdventureLesson(requestData);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('❌ Error in generate-adventure-lesson:', error);
    
    // Provide a fallback lesson structure
    const fallbackLesson = {
      title: `${requestData?.adventure?.title || 'Learning Adventure'}`,
      subject: requestData?.adventure?.subject || 'General',
      gradeLevel: requestData?.adventure?.gradeLevel || 7,
      scenario: `Welcome to an exciting learning adventure about ${requestData?.adventure?.title}! This interactive experience will help you explore key concepts through hands-on activities.`,
      learningObjectives: [
        `Understand key concepts related to ${requestData?.adventure?.subject}`,
        "Apply problem-solving skills in real-world scenarios",
        "Develop critical thinking abilities"
      ],
      stages: [
        {
          id: "intro",
          title: "Introduction",
          description: "Get familiar with the adventure setting",
          duration: 5,
          activities: [
            {
              type: "exploration",
              title: "Explore the Environment",
              instructions: "Take a moment to understand your role and the challenges ahead.",
              expectedOutcome: "Students will be oriented to the adventure scenario"
            }
          ]
        },
        {
          id: "main",
          title: "Main Challenge", 
          description: "Tackle the primary learning objectives",
          duration: 20,
          activities: [
            {
              type: "problem_solving",
              title: "Solve Key Challenges",
              instructions: "Work through the main learning activities step by step.",
              expectedOutcome: "Students will demonstrate understanding of core concepts"
            }
          ]
        },
        {
          id: "conclusion",
          title: "Wrap Up",
          description: "Reflect on what you've learned",
          duration: 10,
          activities: [
            {
              type: "reflection",
              title: "Reflect on Learning",
              instructions: "Think about what you discovered and how you can apply it.",
              expectedOutcome: "Students will consolidate their learning"
            }
          ]
        }
      ],
      estimatedTime: 35,
      materials: ["Computer or tablet", "Notebook for reflection"],
      assessmentCriteria: ["Understanding of key concepts", "Problem-solving approach", "Engagement with activities"]
    };
    
    return new Response(
      JSON.stringify({ 
        success: true,
        lesson: fallbackLesson,
        metadata: {
          adventureId: requestData?.adventure?.id,
          generatedAt: new Date().toISOString(),
          fallback: true,
          originalError: error.message
        }
      }), 
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});