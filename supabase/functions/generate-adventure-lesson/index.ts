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

// Create story-driven educational content generator
function createStoryDrivenPrompt(context: PromptContext, adventureTitle: string): string {
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
    ? `${calendarKeywords.join(', ')}`
    : 'interactive learning and problem solving';
  const interestText = studentInterests.length > 0
    ? studentInterests.join(', ')
    : "technology, games, and creativity";

  return `Create an immersive story-driven educational adventure for "${adventureTitle}" (${subject}, Grade ${gradeLevel}).

🎯 MISSION: Create a captivating learning quest with rich stories, interactive challenges, and real educational content!

📖 ADVENTURE STRUCTURE:
Create exactly 3 stages with engaging stories and educational activities:

**Stage 1: Introduction & Setup (15-20 minutes)**
- Hook students with an exciting scenario
- Set up the adventure context
- Include one interactive multiple-choice question to assess prior knowledge

**Stage 2: Main Challenge (80-100 minutes)**  
- Core learning activities with story integration
- Interactive question about ${subject} concepts
- Creative or problem-solving component

**Stage 3: Resolution & Reflection (30 minutes)**
- Wrap up the adventure story
- Apply what was learned
- Reflection activity

🎮 REQUIREMENTS:
- Each stage MUST have engaging storyText (2-3 sentences)
- Each stage MUST have detailed educational activities
- Include specific ${subject} questions with 4 options each
- Make it age-appropriate for Grade ${gradeLevel}
- Connect to student interests: ${interestText}
- Context: ${keywordText}

Return ONLY valid JSON in this exact format:

{
  "title": "${adventureTitle}",
  "subject": "${subject}", 
  "gradeLevel": ${gradeLevel},
  "scenario": "Exciting 2-3 sentence opening that hooks students and sets up the adventure",
  "learningObjectives": [
    "Specific ${subject} skill students will master",
    "Problem-solving and critical thinking skill",
    "Creative application of concepts"
  ],
  "stages": [
    {
      "id": "introduction",
      "title": "Adventure Begins",
      "description": "Get familiar with the scenario and your mission",
      "duration": 5,
      "storyText": "Exciting story opening that sets the scene and introduces the challenge...",
      "activities": [
        {
          "type": "multipleChoice",
          "title": "Initial Challenge",
          "instructions": "Answer this question to begin your adventure",
          "content": {
            "question": "Specific ${subject} question related to the story",
            "options": ["Option A with real content", "Option B with real content", "Option C with real content", "Option D with real content"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation of why this answer is correct and how it relates to the adventure",
            "points": 10
          }
        }
      ]
    },
    {
      "id": "main-challenge", 
      "title": "The Core Quest",
      "description": "Tackle the main learning objectives",
      "duration": 10,
      "storyText": "Story continuation that introduces the main challenge and raises the stakes...",
      "activities": [
        {
          "type": "multipleChoice",
          "title": "Key Challenge",
          "instructions": "Solve this challenge to progress in your adventure",
          "content": {
            "question": "Advanced ${subject} question that builds on the story",
            "options": ["Detailed option A", "Detailed option B", "Detailed option C", "Detailed option D"],
            "correctAnswer": 1,
            "explanation": "Comprehensive explanation connecting the answer to both ${subject} concepts and the adventure narrative",
            "points": 20
          }
        }
      ]
    },
    {
      "id": "resolution",
      "title": "Victory & Reflection", 
      "description": "Complete the adventure and reflect on learning",
      "duration": 8,
      "storyText": "Satisfying conclusion where students apply their knowledge to resolve the adventure...",
      "activities": [
        {
          "type": "creativeTask",
          "title": "Adventure Conclusion",
          "instructions": "Create or design something to complete your adventure using what you've learned"
        }
      ]
    }
  ],
  "estimatedTime": ${lessonDuration}
}

CRITICAL: Return ONLY the JSON object above. No additional text, markdown, or explanations. The JSON must be complete and valid.`;
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
    lessonDuration: schoolSettings?.lessonDuration || 135,
    subjectWeight: teacherPreferences?.subjectWeights?.[adventure.subject] || 'medium',
    calendarKeywords: calendarContext?.keywords || ['interactive learning', 'problem solving'],
    calendarDuration: calendarContext?.duration || 'single session',
    studentAbilities: studentProfile?.abilities || 'mixed ability with both support and challenges',
    learningStyle: studentProfile?.learningStyle || 'multimodal approach',
    studentInterests: studentProfile?.interests || ['technology', 'games', 'creativity']
  };
}

async function callOpenAI(prompt: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.error('🔑 OPENAI_API_KEY not found in environment');
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log('🤖 Calling OpenAI for adventure lesson generation...');
  console.log('🔑 API Key configured:', openaiApiKey ? `Yes (${openaiApiKey.substring(0, 8)}...)` : 'No');
  console.log('✏️ Generated prompt length:', prompt.length);
  console.log('📝 Prompt preview:', prompt.substring(0, 300) + '...');
  
  const requestBody = {
    model: 'gpt-5-mini-2025-08-07',
    messages: [
      {
        role: 'system',
        content: 'You are an expert educational content creator specializing in interactive, story-driven lessons. Always return valid JSON responses with detailed, engaging educational content.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_completion_tokens: 3000,
  };

  console.log('📤 Request model:', requestBody.model);
  console.log('📤 Request body preview:', JSON.stringify(requestBody).substring(0, 200) + '...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('📥 Response status:', response.status);
  console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('🤖 OpenAI response received:', {
    id: data.id,
    model: data.model,
    choices: data.choices?.length,
    usage: data.usage,
    finishReason: data.choices?.[0]?.finish_reason
  });
  
  if (!data.choices?.[0]?.message?.content) {
    console.error('❌ Invalid OpenAI response - missing content:', JSON.stringify(data, null, 2));
    
    // Check if it was truncated due to length
    if (data.choices?.[0]?.finish_reason === 'length') {
      console.error('❌ Response was truncated due to length limit');
      throw new Error('Response truncated due to length limit. Please try again with a shorter prompt.');
    }
    
    throw new Error('Invalid response from OpenAI - no content received');
  }
  
  const content = data.choices[0].message.content.trim();
  console.log('📄 Response content length:', content.length);
  console.log('📄 Response content preview:', content.substring(0, 500) + '...');
  
  if (!content) {
    throw new Error('OpenAI returned empty content');
  }

  console.log('✅ Successfully received OpenAI response');
  return content;
}

// Parse and validate JSON response
function parseAndValidateLesson(jsonContent: string): any {
  console.log('🔍 Parsing JSON response...');
  console.log('📄 Raw content length:', jsonContent.length);
  console.log('📄 Content preview:', jsonContent.substring(0, 200) + '...');
  
  // Try to extract JSON from the response (in case there's extra text)
  let jsonString = jsonContent.trim();
  
  // Look for JSON object boundaries
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}') + 1;
  
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    jsonString = jsonString.substring(jsonStart, jsonEnd);
    console.log('📄 Extracted JSON substring:', jsonString.substring(0, 200) + '...');
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    console.log('✅ Successfully parsed JSON');
    console.log('📚 Parsed lesson preview:', {
      title: parsed.title,
      subject: parsed.subject,
      gradeLevel: parsed.gradeLevel,
      stagesCount: parsed.stages?.length,
      scenario: parsed.scenario?.substring(0, 100) + '...'
    });
    
    // Enhanced validation
    if (!parsed.title || !parsed.subject || !parsed.scenario) {
      console.error('❌ Missing required top-level fields:', {
        hasTitle: !!parsed.title,
        hasSubject: !!parsed.subject,
        hasScenario: !!parsed.scenario
      });
      throw new Error('Missing required fields: title, subject, or scenario');
    }
    
    if (!Array.isArray(parsed.stages) || parsed.stages.length === 0) {
      console.error('❌ Invalid stages array:', parsed.stages);
      throw new Error('Lesson must have at least one stage with valid structure');
    }
    
    // Validate each stage has required fields
    parsed.stages.forEach((stage, index) => {
      if (!stage.title || !stage.duration || !Array.isArray(stage.activities)) {
        console.error(`❌ Stage ${index} missing required fields:`, stage);
        throw new Error(`Stage ${index + 1} is missing required fields (title, duration, or activities)`);
      }
    });
    
    console.log('✅ Lesson validation passed');
    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse OpenAI response as JSON:', error);
    console.error('📄 Full response content:', jsonContent);
    console.error('🔍 Attempted JSON string:', jsonString);
    throw new Error(`Failed to parse lesson content: ${error.message}. Raw response: ${jsonContent.substring(0, 500)}...`);
  }
}

// Main lesson generation function
async function generateAdventureLesson(request: AdventureLessonRequest) {
  console.log('🚀 Starting adventure lesson generation for:', request.adventure.title);
  
  // Build prompt context
  const context = buildPromptContext(request);
  console.log('📋 Built prompt context:', context);
  
  // Generate story-driven prompt
  const prompt = createStoryDrivenPrompt(context, request.adventure.title);
  
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

  let requestData: AdventureLessonRequest | null = null;

  try {
    console.log('🚀 Starting generate-adventure-lesson function');
    
    requestData = await req.json();
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
          duration: 15,
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
          duration: 90,
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
          duration: 30,
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
      estimatedTime: 135,
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