import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClassData {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string;
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

interface LessonData {
  id: string;
  classId: string;
  subject: string;
  date: string;
  lessonData: any;
  createdAt: string;
}

serve(async (req) => {
  console.log('🚀 Scheduled Lesson Generator called with method:', req.method);
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('📋 Initializing scheduled lesson generation...');

    // Get current date
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Generating lessons for date: ${today}`);

    // Parse request body for optional parameters
    let targetClasses: string[] | null = null;
    let targetDate: string = today;
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        targetClasses = body.classIds || null;
        
        // Validate and set target date
        if (body.date) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(body.date) && !isNaN(Date.parse(body.date))) {
            targetDate = body.date;
          } else {
            console.warn(`⚠️ Invalid date format provided: ${body.date}, using today instead`);
          }
        }
        
        console.log('🎯 Target classes specified:', targetClasses);
        console.log('📆 Target date specified:', targetDate);
      } catch (e) {
        console.log('ℹ️ No request body or invalid JSON, processing all classes for today');
      }
    }

    // Retrieve all classes (mock data for now, can be replaced with database query)
    const classes = await getAllClasses(targetClasses);
    console.log(`📚 Found ${classes.length} classes to process`);

    const results = {
      date: targetDate,
      totalClasses: classes.length,
      processedClasses: 0,
      generatedLessons: 0,
      skippedLessons: 0,
      errors: [] as string[],
      details: [] as any[],
    };

    // Process each class
    for (const classData of classes) {
      try {
        console.log(`🏫 Processing class: ${classData.name} (${classData.id})`);
        
        const classResult = await processClassLessons(supabase, classData, targetDate);
        results.processedClasses++;
        results.generatedLessons += classResult.generatedCount;
        results.skippedLessons += classResult.skippedCount;
        results.details.push({
          classId: classData.id,
          className: classData.name,
          ...classResult
        });

      } catch (error) {
        console.error(`❌ Error processing class ${classData.name}:`, error);
        results.errors.push(`Class ${classData.name}: ${error.message}`);
        results.details.push({
          classId: classData.id,
          className: classData.name,
          error: error.message
        });
      }
    }

    console.log('✅ Lesson generation completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Scheduled lesson generation completed',
        results
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('💥 Fatal error in scheduled lesson generator:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        debug: { 
          errorMessage: error.message, 
          errorStack: error.stack 
        }
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

async function getAllClasses(targetClasses: string[] | null): Promise<ClassData[]> {
  // Mock class data - this would be replaced with a database query
  // when a proper classes table is implemented
  const mockClasses: ClassData[] = [
    {
      id: "1a",
      name: "1.A",
      grade: "1",
      teacher: "Lærer Hansen",
      subject: "Matematik & Dansk",
      students: [
        { id: "1", name: "Emma Nielsen", email: "emma@example.com" },
        { id: "2", name: "Lucas Hansen", email: "lucas@example.com" }
      ]
    },
    {
      id: "1b",
      name: "1.B",
      grade: "1",
      teacher: "Lærer Andersen",
      subject: "Matematik & Dansk",
      students: [
        { id: "3", name: "Sofia Larsen", email: "sofia@example.com" }
      ]
    }
  ];

  // Filter classes if specific ones are requested
  if (targetClasses) {
    return mockClasses.filter(cls => targetClasses.includes(cls.id));
  }

  return mockClasses;
}

async function processClassLessons(
  supabase: any, 
  classData: ClassData, 
  date: string
): Promise<{ generatedCount: number; skippedCount: number; subjects: string[] }> {
  const subjects = extractSubjectsFromClassSubject(classData.subject);
  let generatedCount = 0;
  let skippedCount = 0;

  console.log(`📖 Processing subjects for class ${classData.name}: ${subjects.join(', ')}`);

  for (const subject of subjects) {
    // Check if lesson already exists for this class, subject, and date
    const existingLesson = await checkExistingLesson(supabase, classData.id, subject, date);
    
    if (existingLesson) {
      console.log(`⏭️ Lesson already exists for ${classData.name} - ${subject} on ${date}`);
      skippedCount++;
      continue;
    }

    // Generate new lesson
    const lessonData = await generateLessonForClass(classData, subject, date);
    
    // Store the lesson
    await storeLessonData(supabase, classData.id, subject, date, lessonData);
    
    console.log(`✅ Generated lesson for ${classData.name} - ${subject}`);
    generatedCount++;
  }

  return { generatedCount, skippedCount, subjects };
}

function extractSubjectsFromClassSubject(subjectString: string): string[] {
  // Parse combined subject strings like "Matematik & Dansk"
  return subjectString
    .split('&')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function checkExistingLesson(
  supabase: any, 
  classId: string, 
  subject: string, 
  date: string
): Promise<boolean> {
  try {
    // Check in lesson_progress table using class-based user_id pattern
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', `class-${classId}`)
      .eq('subject', subject)
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`)
      .limit(1);

    if (error) {
      console.warn(`⚠️ Error checking existing lesson: ${error.message}`);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.warn(`⚠️ Exception checking existing lesson: ${error.message}`);
    return false;
  }
}

async function generateLessonForClass(
  classData: ClassData, 
  subject: string, 
  date: string
): Promise<any> {
  // Generate a basic lesson structure
  // This uses a simplified approach since we can't directly import the DailyLessonGenerator
  // In a production setup, this would integrate with the existing lesson generation logic
  
  const gradeLevel = parseInt(classData.grade) || 1;
  const lessonId = `lesson-${classData.id}-${subject}-${date}-${Date.now()}`;
  
  console.log(`🎯 Generating lesson: ${lessonId} for grade ${gradeLevel}`);

  // Calculate total lesson duration (20-25 minutes typical)
  const activities = generatePlaceholderActivities(subject, gradeLevel);
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);

  return {
    id: lessonId,
    subject: subject,
    skillArea: getDefaultSkillArea(subject),
    gradeLevel: gradeLevel,
    totalActivities: activities.length,
    activities: activities,
    metadata: {
      classId: classData.id,
      className: classData.name,
      teacher: classData.teacher,
      date: date,
      generatedAt: new Date().toISOString(),
      studentCount: classData.students.length,
      totalDurationMinutes: Math.round(totalDuration / 60),
      version: '1.0',
      generatedBy: 'scheduledLessonGenerator'
    }
  };
}

function getDefaultSkillArea(subject: string): string {
  const skillAreaMap: { [key: string]: string } = {
    'Matematik': 'arithmetic',
    'Dansk': 'reading-comprehension',
    'Engelsk': 'vocabulary',
    'Naturvidenskab': 'observation',
    'Historie': 'chronology'
  };
  return skillAreaMap[subject] || 'general';
}

function generatePlaceholderActivities(subject: string, gradeLevel: number): any[] {
  const activities = [];
  const activityTypes = ['content-delivery', 'interactive-game', 'application'];
  
  // Subject-specific activity themes
  const subjectThemes: { [key: string]: string[] } = {
    'Matematik': ['Addition', 'Subtraction', 'Counting', 'Shapes', 'Measurement'],
    'Dansk': ['Reading', 'Writing', 'Vocabulary', 'Grammar', 'Storytelling'],
    'Engelsk': ['Vocabulary', 'Pronunciation', 'Basic Phrases', 'Listening', 'Speaking']
  };
  
  const themes = subjectThemes[subject] || ['Learning', 'Practice', 'Review', 'Exploration', 'Application'];
  
  for (let i = 0; i < 7; i++) {
    const theme = themes[i % themes.length];
    const activityType = activityTypes[i % activityTypes.length];
    const baseDuration = activityType === 'interactive-game' ? 300 : 
                        activityType === 'content-delivery' ? 240 : 180;
    
    activities.push({
      id: `activity-${i + 1}`,
      type: activityType,
      title: `${subject} - ${theme}`,
      description: `Grade ${gradeLevel} ${subject} learning activity focusing on ${theme.toLowerCase()}`,
      duration: baseDuration + Math.floor(Math.random() * 120), // Add some variance
      difficultyLevel: Math.max(1, gradeLevel),
      content: {
        instructions: `Practice ${theme.toLowerCase()} skills appropriate for grade ${gradeLevel}`,
        gradeLevel: gradeLevel,
        subject: subject,
        theme: theme,
        learningObjective: `Students will be able to demonstrate understanding of ${theme.toLowerCase()} in ${subject}`
      }
    });
  }
  
  return activities;
}

async function storeLessonData(
  supabase: any, 
  classId: string, 
  subject: string, 
  date: string, 
  lessonData: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('lesson_progress')
      .insert({
        id: lessonData.id,
        user_id: `class-${classId}`, // Use a class-based user ID pattern
        subject: subject,
        skill_area: lessonData.skillArea,
        lesson_data: lessonData,
        total_activities: lessonData.totalActivities,
        current_activity_index: 0,
        is_completed: false,
        created_at: `${date}T00:00:00`,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to store lesson: ${error.message}`);
    }

    console.log(`💾 Stored lesson data for class ${classId}, subject ${subject} (${lessonData.totalActivities} activities, ~${lessonData.metadata.totalDurationMinutes} minutes)`);
  } catch (error) {
    console.error(`❌ Error storing lesson: ${error.message}`);
    throw error;
  }
}