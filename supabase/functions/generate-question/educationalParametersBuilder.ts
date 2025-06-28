
import { QuestionGenerationRequest } from './types.ts';

export interface EducationalContext {
  gradeLevel: number;
  subject: string;
  skillArea: string;
  teacherRequirements?: {
    focusAreas: string[];
    avoidTopics: string[];
    preferredQuestionTypes: string[];
    difficultyPreference: 'easier' | 'standard' | 'challenging';
  };
  schoolStandards?: {
    curriculum: 'common_core' | 'state_standards' | 'international' | 'custom';
    assessmentStyle: 'traditional' | 'performance_based' | 'formative';
    learningGoals: string[];
    mandatoryTopics: string[];
  };
  studentAdaptation?: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    previousPerformance: {
      accuracy: number;
      averageTime: number;
      strugglingConcepts: string[];
      masteredConcepts: string[];
    };
    engagementLevel: 'low' | 'medium' | 'high';
    preferredContexts: string[]; // e.g., ['sports', 'food', 'animals', 'technology']
  };
}

export function buildEducationalPrompt(context: EducationalContext): string {
  const {
    gradeLevel,
    subject,
    skillArea,
    teacherRequirements,
    schoolStandards,
    studentAdaptation
  } = context;

  let prompt = `Create a Grade ${gradeLevel} ${subject} question about ${skillArea}.`;

  // Add teacher requirements
  if (teacherRequirements) {
    if (teacherRequirements.focusAreas.length > 0) {
      prompt += `\n\nTEACHER FOCUS AREAS: Emphasize these concepts: ${teacherRequirements.focusAreas.join(', ')}.`;
    }
    
    if (teacherRequirements.avoidTopics.length > 0) {
      prompt += `\nAVOID these topics: ${teacherRequirements.avoidTopics.join(', ')}.`;
    }
    
    if (teacherRequirements.difficultyPreference !== 'standard') {
      prompt += `\nDIFFICULTY: Make this question ${teacherRequirements.difficultyPreference} than typical Grade ${gradeLevel} level.`;
    }
  }

  // Add school standards requirements
  if (schoolStandards) {
    prompt += `\n\nSCHOOL STANDARDS: Align with ${schoolStandards.curriculum} curriculum.`;
    
    if (schoolStandards.learningGoals.length > 0) {
      prompt += `\nLearning goals to address: ${schoolStandards.learningGoals.join(', ')}.`;
    }
    
    if (schoolStandards.mandatoryTopics.length > 0) {
      prompt += `\nMust incorporate these topics: ${schoolStandards.mandatoryTopics.join(', ')}.`;
    }
    
    prompt += `\nUse ${schoolStandards.assessmentStyle} assessment style.`;
  }

  // Add student adaptation
  if (studentAdaptation) {
    prompt += `\n\nSTUDENT ADAPTATION:`;
    prompt += `\nLearning style: ${studentAdaptation.learningStyle}`;
    
    if (studentAdaptation.learningStyle === 'visual') {
      prompt += ` - Use visual scenarios, diagrams in word problems, spatial reasoning.`;
    } else if (studentAdaptation.learningStyle === 'auditory') {
      prompt += ` - Include rhythmic patterns, word problems with dialogue, sound-based contexts.`;
    } else if (studentAdaptation.learningStyle === 'kinesthetic') {
      prompt += ` - Use hands-on scenarios, movement-based problems, physical activities.`;
    }
    
    const performance = studentAdaptation.previousPerformance;
    if (performance.accuracy < 0.7) {
      prompt += `\nStudent is struggling (${Math.round(performance.accuracy * 100)}% accuracy) - provide extra scaffolding and clearer explanations.`;
    } else if (performance.accuracy > 0.9) {
      prompt += `\nStudent is excelling (${Math.round(performance.accuracy * 100)}% accuracy) - can handle more complex problems.`;
    }
    
    if (performance.strugglingConcepts.length > 0) {
      prompt += `\nStudent struggles with: ${performance.strugglingConcepts.join(', ')} - provide gentle reinforcement.`;
    }
    
    if (performance.masteredConcepts.length > 0) {
      prompt += `\nStudent has mastered: ${performance.masteredConcepts.join(', ')} - can build on these.`;
    }
    
    if (studentAdaptation.preferredContexts.length > 0) {
      prompt += `\nUse contexts the student enjoys: ${studentAdaptation.preferredContexts.join(', ')}.`;
    }
    
    prompt += `\nStudent engagement level: ${studentAdaptation.engagementLevel}`;
    if (studentAdaptation.engagementLevel === 'low') {
      prompt += ` - Make it extra engaging and fun!`;
    }
  }

  // Add critical validation requirements
  prompt += `\n\nCRITICAL REQUIREMENTS:
1. There must be EXACTLY ONE correct answer - no equivalent options (like 1/2 and 2/4)
2. All wrong answers must be clearly incorrect
3. For fractions: ensure no simplified/equivalent forms in different options
4. For decimals: avoid equivalent representations (0.5 vs 0.50)
5. Double-check mathematical accuracy before finalizing

RESPONSE FORMAT (JSON only):
{
  "question": "Your personalized question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation tailored to Grade ${gradeLevel} student",
  "educationalNotes": {
    "addressedStandards": ["standards met"],
    "teacherFocus": ["focus areas covered"],
    "studentAdaptations": ["how it's adapted for this student"]
  }
}`;

  return prompt;
}

export function parseEducationalContext(request: QuestionGenerationRequest & any): EducationalContext {
  return {
    gradeLevel: request.gradeLevel || 5,
    subject: request.subject,
    skillArea: request.skillArea,
    teacherRequirements: request.teacherRequirements || {
      focusAreas: [],
      avoidTopics: [],
      preferredQuestionTypes: ['multiple_choice'],
      difficultyPreference: 'standard'
    },
    schoolStandards: request.schoolStandards || {
      curriculum: 'common_core',
      assessmentStyle: 'traditional',
      learningGoals: [],
      mandatoryTopics: []
    },
    studentAdaptation: request.studentAdaptation || {
      learningStyle: 'mixed',
      previousPerformance: {
        accuracy: 0.75,
        averageTime: 30,
        strugglingConcepts: [],
        masteredConcepts: []
      },
      engagementLevel: 'medium',
      preferredContexts: []
    }
  };
}
