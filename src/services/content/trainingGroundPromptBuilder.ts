// Training Ground Dynamic Prompt Builder
// Maps real data sources to AI prompt templates

interface StudentProfile {
  id: string;
  name?: string;
  gradeStep: number;
  performanceLevel: 'below' | 'on-track' | 'above';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  interests: string[];
  classId: string;
}

interface TeacherDashboard {
  classId: string;
  subjectWeights: Record<string, number>; // e.g., { math: 9, music: 5 }
  dailyDurationBySubject?: Record<string, number>;
}

interface SchoolDashboard {
  schoolId: string;
  teachingPerspective: string; // e.g., 'project-based', 'traditional', etc.
}

interface CalendarEntry {
  date: string;
  classId: string;
  keywords: string[];
  duration: 'one-day' | 'multi-day' | 'week-long' | string;
}

interface TrainingGroundRequest {
  subject: string;
  studentProfile?: StudentProfile;
  teacherSettings?: TeacherDashboard;
  schoolSettings?: SchoolDashboard;
  calendarContext?: CalendarEntry;
}

export function buildTrainingGroundPrompt(request: TrainingGroundRequest): string {
  const { 
    subject, 
    studentProfile, 
    teacherSettings, 
    schoolSettings, 
    calendarContext 
  } = request;

  // Start with base prompt
  let prompt = `You are an advanced AI educator. Generate a fun, imaginative, and explanatory educational activity for the subject: ${subject}.

Use the following contextual profile and environment data:`;

  // Add student context
  if (studentProfile) {
    prompt += `
- Student grade: ${studentProfile.gradeStep}
- Performance level: ${studentProfile.performanceLevel}
- Learning style: ${studentProfile.learningStyle}`;
    
    if (studentProfile.interests.length > 0) {
      prompt += `
- Student interests: ${studentProfile.interests.join(', ')}`;
    }
  } else {
    prompt += `
- Student grade: 5 (default)
- Performance level: on-track
- Learning style: mixed`;
  }

  // Add school philosophy
  if (schoolSettings) {
    prompt += `
- Teaching philosophy: ${schoolSettings.teachingPerspective}`;
  } else {
    prompt += `
- Teaching philosophy: Creative and experiential learning`;
  }

  // Add teacher subject emphasis
  if (teacherSettings && teacherSettings.subjectWeights[subject]) {
    prompt += `
- Teacher's subject emphasis: ${teacherSettings.subjectWeights[subject]}/10`;
  } else {
    prompt += `
- Teacher's subject emphasis: 7/10 (standard priority)`;
  }

  // Add calendar context if available
  if (calendarContext && calendarContext.keywords.length > 0) {
    prompt += `
- Calendar keywords: ${calendarContext.keywords.join(', ')}
- Calendar duration: ${calendarContext.duration}`;
  }

  // Add guidelines and response format
  prompt += `

Guidelines:
- Generate **engaging** and **curriculum-aligned** content for ${subject}
- Do **not** repeat standard exercises. Use creativity, interactivity, and short educational games where appropriate
- Include **a short explanation**, **a playful challenge or game mechanic**, and **an optional extension** for students who want more
- Be flexible in difficulty: adapt if the student is struggling or excelling
- Keep tone playful, positive, and curious — but focused on deepening understanding

CRITICAL REQUIREMENTS:
1. Create exactly one educational activity
2. Make it engaging and interactive
3. Align with the grade level and learning style
4. Include clear instructions
5. Provide extension activities for advanced learners

Return the result as structured JSON:
{
  "title": "Engaging title for the activity",
  "objective": "What the student will learn",
  "explanation": "Brief explanation of the concept",
  "activity": {
    "type": "Puzzle, Game, Challenge, Interactive Simulation, etc.",
    "instructions": "Step-by-step instructions for the activity"
  },
  "optionalExtension": "Additional challenge for advanced students",
  "studentSkillTargeted": "Specific skill being developed",
  "learningStyleAdaptation": "How this adapts to the student's learning style"
}`;

  return prompt;
}

// Helper function to gather data from different parts of the app
export function assembleTrainingGroundRequest(
  subject: string,
  // These would be replaced with actual data sources from your app
  getUserProfile?: () => StudentProfile | undefined,
  getTeacherSettings?: (classId: string) => TeacherDashboard | undefined,
  getSchoolSettings?: () => SchoolDashboard | undefined,
  getCalendarContext?: (classId: string) => CalendarEntry | undefined
): TrainingGroundRequest {
  
  const studentProfile = getUserProfile?.();
  const teacherSettings = studentProfile ? getTeacherSettings?.(studentProfile.classId) : undefined;
  const schoolSettings = getSchoolSettings?.();
  const calendarContext = studentProfile ? getCalendarContext?.(studentProfile.classId) : undefined;

  return {
    subject,
    studentProfile,
    teacherSettings,
    schoolSettings,
    calendarContext
  };
}

// Example usage function
export function generateTrainingGroundPromptForSubject(subject: string): string {
  // TODO: Replace these with actual data fetching from your app
  const mockRequest: TrainingGroundRequest = {
    subject,
    studentProfile: {
      id: 'student-123',
      name: 'Alex',
      gradeStep: 5,
      performanceLevel: 'on-track',
      learningStyle: 'visual',
      interests: ['animals', 'space', 'technology'],
      classId: 'class-456'
    },
    teacherSettings: {
      classId: 'class-456',
      subjectWeights: {
        math: 9,
        science: 8,
        english: 7,
        art: 6
      }
    },
    schoolSettings: {
      schoolId: 'school-789',
      teachingPerspective: 'project-based learning with hands-on activities'
    },
    calendarContext: {
      date: '2024-01-15',
      classId: 'class-456',
      keywords: ['winter', 'exploration', 'discovery'],
      duration: 'week-long'
    }
  };

  return buildTrainingGroundPrompt(mockRequest);
}