
import { LessonActivity } from '../types/LessonTypes';
import { generateEnhancedLesson, EnhancedLessonConfig } from './EnhancedLessonGenerator';

export interface NELIESessionConfig {
  subject: string;
  skillArea: string;
  studentName: string;
  sessionDuration: number;
  gradeLevel: number;
  learningPreferences: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
}

export interface NELIESession {
  sessionId: string;
  config: NELIESessionConfig;
  activities: LessonActivity[];
  estimatedDuration: number;
  personalizedElements: {
    greetings: string[];
    encouragements: string[];
    explanationStyle: string;
  };
  subjects?: Record<string, any>;
  metadata?: {
    totalDuration: number;
    subjectCount: number;
    gradeLevel: number;
    learningStyle: string;
    qualityScores: Record<string, number>;
    generatedAt: number;
  };
}

class NELIESessionGenerator {
  private sessionCounter = 0;

  async generatePersonalizedSession(config: NELIESessionConfig): Promise<NELIESession> {
    this.sessionCounter++;
    const sessionId = `nelie_session_${config.subject}_${Date.now()}_${this.sessionCounter}`;

    try {
      const enhancedLesson = await generateEnhancedLesson(config.subject, config.skillArea);
      const personalizedElements = this.createPersonalizedElements(config);
      const adaptedActivities = this.adaptActivitiesForLearningStyle(
        enhancedLesson.phases,
        config.learningPreferences
      );

      return {
        sessionId,
        config,
        activities: adaptedActivities,
        estimatedDuration: enhancedLesson.estimatedTotalDuration,
        personalizedElements
      };
    } catch (error) {
      console.error('Error generating NELIE session:', error);
      return this.generateFallbackSession(config, sessionId);
    }
  }

  // Add missing static methods
  static generateSession(config: any): NELIESession {
    const sessionId = `session_${Date.now()}`;
    const totalDuration = config.sessionDuration || 1500;
    
    return {
      sessionId,
      config: {
        subject: config.subjects?.[0] || 'mathematics',
        skillArea: 'general',
        studentName: 'Student',
        sessionDuration: totalDuration,
        gradeLevel: config.gradeLevel || 1,
        learningPreferences: { visual: 5, auditory: 5, kinesthetic: 5 }
      },
      activities: [],
      estimatedDuration: totalDuration,
      personalizedElements: {
        greetings: ['Hello!'],
        encouragements: ['Great job!'],
        explanationStyle: config.preferredLearningStyle || 'mixed'
      },
      subjects: config.subjects?.reduce((acc: any, subject: string) => {
        acc[subject] = { lesson: { totalDuration: 1200 } };
        return acc;
      }, {}),
      metadata: {
        totalDuration,
        subjectCount: config.subjects?.length || 1,
        gradeLevel: config.gradeLevel || 1,
        learningStyle: config.preferredLearningStyle || 'mixed',
        qualityScores: { default: 85 },
        generatedAt: Date.now()
      }
    };
  }

  static generateSubjectLesson(subject: string, gradeLevel: number, learningStyle: string) {
    return {
      activities: [],
      validation: { qualityScore: 85 }
    };
  }

  static generateSessionSummary(session: NELIESession): string {
    return `Session Summary: ${session.sessionId} - Duration: ${session.estimatedDuration} minutes`;
  }

  private createPersonalizedElements(config: NELIESessionConfig) {
    const { studentName, subject } = config;
    
    return {
      greetings: [
        `Hi ${studentName}! Ready for an amazing ${subject} adventure?`,
        `Hello ${studentName}! Let's explore ${subject} together today!`,
        `Welcome back ${studentName}! I'm excited to learn ${subject} with you!`
      ],
      encouragements: [
        `You're doing great, ${studentName}!`,
        `Excellent work, ${studentName}! Keep it up!`,
        `I'm so proud of your progress, ${studentName}!`,
        `Amazing job, ${studentName}! You're getting so much better!`
      ],
      explanationStyle: this.determineExplanationStyle(config.learningPreferences)
    };
  }

  private determineExplanationStyle(preferences: NELIESessionConfig['learningPreferences']): string {
    const maxPreference = Math.max(preferences.visual, preferences.auditory, preferences.kinesthetic);
    
    if (preferences.visual === maxPreference) {
      return 'visual-focused';
    } else if (preferences.auditory === maxPreference) {
      return 'auditory-focused';
    } else {
      return 'kinesthetic-focused';
    }
  }

  private adaptActivitiesForLearningStyle(
    activities: LessonActivity[],
    preferences: NELIESessionConfig['learningPreferences']
  ): LessonActivity[] {
    return activities.map(activity => {
      const adaptedActivity = { ...activity };
      
      if (preferences.visual > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          text: adaptedActivity.content.text || ''
        };
      }
      
      if (preferences.auditory > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          text: adaptedActivity.content.text || ''
        };
      }
      
      if (preferences.kinesthetic > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          text: adaptedActivity.content.text || ''
        };
      }
      
      return adaptedActivity;
    });
  }

  private generateFallbackSession(config: NELIESessionConfig, sessionId: string): NELIESession {
    const basicActivity: LessonActivity = {
      id: `${sessionId}_basic`,
      type: 'introduction',
      phase: 'introduction',
      title: `Welcome to ${config.subject}`,
      duration: 300,
      phaseDescription: `Basic introduction to ${config.subject}`,
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea
      },
      content: {
        text: `Welcome to your ${config.subject} lesson, ${config.studentName}!`
      }
    };

    return {
      sessionId,
      config,
      activities: [basicActivity],
      estimatedDuration: 300,
      personalizedElements: this.createPersonalizedElements(config)
    };
  }

  generateQuickSession(subject: string, skillArea: string, studentName: string = 'Student'): Promise<NELIESession> {
    const quickConfig: NELIESessionConfig = {
      subject,
      skillArea,
      studentName,
      sessionDuration: 900,
      gradeLevel: 6,
      learningPreferences: {
        visual: 5,
        auditory: 5,
        kinesthetic: 5
      }
    };

    return this.generatePersonalizedSession(quickConfig);
  }
}

// Create NELIEHelpers object with lesson generation methods
export const NELIEHelpers = {
  generateMathLesson: (gradeLevel: number, learningStyle: string) => ({
    lesson: {
      totalDuration: 1200,
      metadata: { skillArea: 'mathematics' },
      phases: [{
        content: {
          learningStyleAdaptation: {
            contentFormat: `${learningStyle} focused content`,
            activityType: `${learningStyle} activities`
          },
          curriculum: ['Grade appropriate math concepts'],
          uniqueTheme: `Math theme ${Date.now()}`
        }
      }]
    }
  }),
  
  generateBodyLabLesson: (gradeLevel: number, learningStyle: string, sessionId: string) => ({
    lesson: {
      title: 'BodyLab: Healthy Living',
      subject: 'bodyLab',
      skillArea: 'health',
      gradeLevel,
      learningStyle,
      sessionId,
      overview: 'Interactive health and wellness lesson',
      phases: [{
        id: 'bodylab_intro',
        type: 'introduction',
        phase: 'introduction',
        title: 'Welcome to BodyLab',
        duration: 300,
        phaseDescription: 'Introduction to healthy living',
        metadata: { subject: 'bodyLab', skillArea: 'health' },
        content: { text: 'Welcome to your healthy living lesson!' }
      }],
      estimatedTotalDuration: 1200,
      learningObjectives: ['Learn about healthy living'],
      materials: ['Interactive content'],
      assessmentMethods: ['Interactive exercises'],
      keywords: ['health', 'wellness'],
      estimatedDuration: 1200,
      objectives: ['Learn about healthy living'],
      difficulty: 2,
      prerequisites: [],
      assessmentCriteria: ['Understanding of concepts'],
      extensions: ['Practice exercises']
    }
  }),

  generateGlobalGeographyLesson: (gradeLevel: number, learningStyle: string, sessionId: string) => ({
    lesson: {
      title: 'Global Geography Explorer',
      subject: 'globalGeography',
      skillArea: 'geography',
      gradeLevel,
      learningStyle,
      sessionId,
      overview: 'Interactive geography lesson',
      phases: [{
        id: 'geography_intro',
        type: 'introduction',
        phase: 'introduction',
        title: 'Welcome to Geography',
        duration: 300,
        phaseDescription: 'Introduction to world geography',
        metadata: { subject: 'globalGeography', skillArea: 'geography' },
        content: { text: 'Welcome to your geography lesson!' }
      }],
      estimatedTotalDuration: 1200,
      learningObjectives: ['Learn about world geography'],
      materials: ['Interactive content'],
      assessmentMethods: ['Interactive exercises'],
      keywords: ['geography', 'world'],
      estimatedDuration: 1200,
      objectives: ['Learn about world geography'],
      difficulty: 2,
      prerequisites: [],
      assessmentCriteria: ['Understanding of concepts'],
      extensions: ['Practice exercises']
    }
  }),

  generateLifeEssentialsLesson: (gradeLevel: number, learningStyle: string, sessionId: string) => ({
    lesson: {
      title: 'Life Essentials: Navigating Adulthood',
      subject: 'lifeEssentials',
      skillArea: 'lifeskills',
      gradeLevel,
      learningStyle,
      sessionId,
      overview: 'Interactive life skills lesson',
      phases: [{
        id: 'life_intro',
        type: 'introduction',
        phase: 'introduction',
        title: 'Welcome to Life Essentials',
        duration: 300,
        phaseDescription: 'Introduction to life skills',
        metadata: { subject: 'lifeEssentials', skillArea: 'lifeskills' },
        content: { text: 'Welcome to your life skills lesson!' }
      }],
      estimatedTotalDuration: 1200,
      learningObjectives: ['Learn essential life skills'],
      materials: ['Interactive content'],
      assessmentMethods: ['Interactive exercises'],
      keywords: ['life skills', 'adulthood'],
      estimatedDuration: 1200,
      objectives: ['Learn essential life skills'],
      difficulty: 3,
      prerequisites: [],
      assessmentCriteria: ['Understanding of concepts'],
      extensions: ['Practice exercises']
    }
  }),

  generateWorldHistoryReligionsLesson: (gradeLevel: number, learningStyle: string, sessionId: string) => ({
    lesson: {
      title: 'World History & Global Religions',
      subject: 'worldHistoryReligions',
      skillArea: 'history',
      gradeLevel,
      learningStyle,
      sessionId,
      overview: 'Interactive history and religions lesson',
      phases: [{
        id: 'history_intro',
        type: 'introduction',
        phase: 'introduction',
        title: 'Welcome to World History',
        duration: 300,
        phaseDescription: 'Introduction to world history',
        metadata: { subject: 'worldHistoryReligions', skillArea: 'history' },
        content: { text: 'Welcome to your history lesson!' }
      }],
      estimatedTotalDuration: 1200,
      learningObjectives: ['Learn about world history'],
      materials: ['Interactive content'],
      assessmentMethods: ['Interactive exercises'],
      keywords: ['history', 'religion'],
      estimatedDuration: 1200,
      objectives: ['Learn about world history'],
      difficulty: 3,
      prerequisites: [],
      assessmentCriteria: ['Understanding of concepts'],
      extensions: ['Practice exercises']
    }
  }),

  formatDuration: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  }
};

// Export singleton instance
export const nelieSessionGenerator = new NELIESessionGenerator();

// Export for backwards compatibility
export const generateNELIESession = (
  subject: string,
  skillArea: string,
  studentName: string = 'Student'
): Promise<NELIESession> => {
  return nelieSessionGenerator.generateQuickSession(subject, skillArea, studentName);
};

export default NELIESessionGenerator;
