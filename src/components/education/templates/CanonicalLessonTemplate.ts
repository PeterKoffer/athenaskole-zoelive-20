
import { LessonActivity, SubjectLessonPlan } from '../components/types/LessonTypes';

export interface CanonicalLessonConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  sessionDuration: number;
  learningObjectives: string[];
}

export const createCanonicalLessonTemplate = (config: CanonicalLessonConfig): SubjectLessonPlan => {
  const { subject, skillArea, gradeLevel, sessionDuration, learningObjectives } = config;
  const sessionId = `canonical_${subject}_${Date.now()}`;

  // Calculate phase durations based on total session duration
  const phases = {
    introduction: Math.floor(sessionDuration * 0.15), // 15%
    contentDelivery: Math.floor(sessionDuration * 0.35), // 35%
    interactiveGame: Math.floor(sessionDuration * 0.25), // 25%
    application: Math.floor(sessionDuration * 0.15), // 15%
    summary: Math.floor(sessionDuration * 0.10) // 10%
  };

  const activities: LessonActivity[] = [
    // Introduction Phase
    {
      id: `${sessionId}_intro`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${subject}`,
      duration: phases.introduction,
      phaseDescription: 'Engaging introduction to capture interest',
      metadata: {
        subject,
        skillArea,
        gradeLevel
      },
      content: {
        hook: `Ready to explore the amazing world of ${subject}?`,
        objectives: learningObjectives,
        preview: `Today we'll master ${skillArea} concepts!`
      }
    },

    // Content Delivery Phase
    {
      id: `${sessionId}_content`,
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Understanding ${skillArea}`,
      duration: phases.contentDelivery,
      phaseDescription: 'Core concept explanation and demonstration',
      metadata: {
        subject,
        skillArea,
        gradeLevel
      },
      content: {
        segments: [{
          title: `${skillArea} Fundamentals`,
          concept: skillArea,
          explanation: `Let's explore the key concepts of ${skillArea} step by step.`,
          examples: [`Example 1 for ${skillArea}`, `Example 2 for ${skillArea}`],
          checkQuestion: {
            question: `What is the main concept of ${skillArea}?`,
            options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
            correctAnswer: 3,
            explanation: 'Great! Understanding all aspects helps master the topic.'
          }
        }]
      }
    },

    // Interactive Game Phase
    {
      id: `${sessionId}_game`,
      type: 'interactive-game',
      phase: 'interactive-game',
      title: `${skillArea} Challenge`,
      duration: phases.interactiveGame,
      phaseDescription: 'Interactive practice and reinforcement',
      metadata: {
        subject,
        skillArea,
        gradeLevel
      },
      content: {
        question: `Ready to test your ${skillArea} skills?`,
        options: ['Yes, let\'s do this!', 'I need more practice', 'Explain again please', 'I\'m ready!'],
        correctAnswer: 0,
        explanation: 'Excellent! Let\'s put your knowledge to the test!'
      }
    },

    // Application Phase
    {
      id: `${sessionId}_application`,
      type: 'application',
      phase: 'application',
      title: `Apply Your ${skillArea} Knowledge`,
      duration: phases.application,
      phaseDescription: 'Real-world application of learned concepts',
      metadata: {
        subject,
        skillArea,
        gradeLevel
      },
      content: {
        scenario: `Imagine you need to use ${skillArea} in a real situation...`,
        task: `Apply what you've learned about ${skillArea} to solve this problem.`,
        guidance: 'Take your time and think through each step.'
      }
    }
  ];

  // Add summary activity
  const summaryActivity: LessonActivity = {
    id: `${sessionId}_summary`,
    type: 'summary',
    phase: 'summary',
    title: 'Lesson Complete!',
    duration: phases.summary,
    phaseDescription: 'Lesson wrap-up and achievement celebration',
    metadata: {
      subject,
      skillArea,
      gradeLevel
    },
    content: {
      keyTakeaways: [
        `You mastered ${skillArea} concepts`,
        `You can apply ${skillArea} in real situations`,
        `You're ready for more advanced topics!`
      ],
      achievements: learningObjectives.map(obj => `✓ ${obj}`),
      nextSteps: `Continue exploring ${subject} with more advanced ${skillArea} topics!`,
      celebrationMessage: `Amazing work! You've successfully completed your ${subject} lesson!`,
      achievementsList: learningObjectives
    }
  };

  activities.push(summaryActivity);

  return {
    title: `${subject}: ${skillArea} Mastery`,
    subject,
    skillArea,
    gradeLevel,
    estimatedDuration: sessionDuration,
    objectives: learningObjectives,
    activities,
    difficulty: gradeLevel <= 3 ? 1 : gradeLevel <= 6 ? 2 : gradeLevel <= 9 ? 3 : 4,
    prerequisites: [`Basic ${subject} knowledge`],
    assessmentCriteria: ['Understanding of concepts', 'Application of knowledge'],
    extensions: [`Advanced ${skillArea} practice`, `Related ${subject} topics`]
  };
};

export const generateQuickCanonicalLesson = (
  subject: string,
  skillArea: string,
  gradeLevel: number = 6
): SubjectLessonPlan => {
  return createCanonicalLessonTemplate({
    subject,
    skillArea,
    gradeLevel,
    sessionDuration: 1200, // 20 minutes
    learningObjectives: [
      `Understand ${skillArea} fundamentals`,
      `Apply ${skillArea} concepts`,
      `Solve ${skillArea} problems confidently`
    ]
  });
};
