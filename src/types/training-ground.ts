// Training Ground Configuration Types
export interface TrainingGroundConfig {
  subject: string;
  gradeLevel: number;
  studentProfile?: {
    id: string;
    name: string;
    gradeStep: number;
    performanceLevel: 'below' | 'on-track' | 'above';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    interests: string[];
    classId: string;
  };
  teacherDashboard?: {
    classId: string;
    subjectWeights: Record<string, number>;
    dailyDurationBySubject: Record<string, number>;
  };
  schoolDashboard?: {
    schoolId: string;
    teachingPerspective: string;
  };
  calendar?: {
    date: string;
    classId: string;
    keywords: string[];
    duration: string;
  };
}

export interface TrainingGroundResponse {
  title: string;
  objective: string;
  explanation: string;
  activity: {
    type: string;
    instructions: string;
  };
  optionalExtension: string;
  studentSkillTargeted: string;
  learningStyleAdaptation: string;
}

// Simple function to create training ground prompts
export function generateTrainingGroundPrompt(config: TrainingGroundConfig): string {
  const {
    subject,
    gradeLevel,
    studentProfile,
    teacherDashboard,
    schoolDashboard,
    calendar
  } = config;

  // Base prompt template
  let prompt = `You are an advanced AI educator. Generate a fun, imaginative, and explanatory educational activity for the subject: ${subject}.

Use the following contextual profile and environment data:
- Student grade: ${gradeLevel}`;

  // Add dynamic context based on available data
  if (studentProfile) {
    prompt += `
- Performance level: ${studentProfile.performanceLevel}
- Learning style: ${studentProfile.learningStyle}
- Interests: ${studentProfile.interests.join(', ')}`;
  }

  if (schoolDashboard) {
    prompt += `
- Teaching philosophy: ${schoolDashboard.teachingPerspective}`;
  }

  if (teacherDashboard && teacherDashboard.subjectWeights[subject]) {
    prompt += `
- Teacher's subject emphasis: ${teacherDashboard.subjectWeights[subject]}/10`;
  }

  if (calendar) {
    prompt += `
- Calendar keywords: ${calendar.keywords.join(', ')}
- Calendar duration: ${calendar.duration}`;
  }

  // Add requirements
  prompt += `

Guidelines:
- Generate **engaging** and **curriculum-aligned** content for ${subject}
- Do **not** repeat standard exercises. Use creativity, interactivity, and short educational games where appropriate
- Include **a short explanation**, **a playful challenge or game mechanic**, and **an optional extension** for students who want more
- Be flexible in difficulty: adapt if the student is struggling or excelling
- Keep tone playful, positive, and curious — but focused on deepening understanding

Return the result as structured JSON:
{
  "title": "",
  "objective": "",
  "explanation": "",
  "activity": {
    "type": "",
    "instructions": ""
  },
  "optionalExtension": "",
  "studentSkillTargeted": "",
  "learningStyleAdaptation": ""
}`;

  return prompt;
}