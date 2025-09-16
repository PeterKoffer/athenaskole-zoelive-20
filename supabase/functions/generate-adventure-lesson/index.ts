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
    
    // Return a simple fallback lesson to test the function
    const fallbackLesson = {
      title: requestData.adventure.title,
      subject: requestData.adventure.subject || 'General',
      gradeLevel: requestData.adventure.gradeLevel || 7,
      scenario: `Welcome to an exciting learning adventure about ${requestData.adventure.title}! This interactive experience will help you explore key concepts through hands-on activities.`,
      learningObjectives: [
        `Understand key concepts related to ${requestData.adventure.subject}`,
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
    
    const result = {
      success: true,
      lesson: fallbackLesson,
      metadata: {
        adventureId: requestData.adventure.id,
        generatedAt: new Date().toISOString(),
        fallback: true
      }
    };
    
    console.log('✅ Successfully generated fallback lesson');
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('❌ Error in generate-adventure-lesson:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});