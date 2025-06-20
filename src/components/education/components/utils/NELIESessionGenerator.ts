
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
}

class NELIESessionGenerator {
  private sessionCounter = 0;

  async generatePersonalizedSession(config: NELIESessionConfig): Promise<NELIESession> {
    this.sessionCounter++;
    const sessionId = `nelie_session_${config.subject}_${Date.now()}_${this.sessionCounter}`;

    try {
      // Generate enhanced lesson with both required parameters
      const enhancedLesson = await generateEnhancedLesson(config.subject, config.skillArea);
      
      // Create personalized elements
      const personalizedElements = this.createPersonalizedElements(config);
      
      // Adapt activities based on learning preferences
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
      
      // Fallback to basic session
      return this.generateFallbackSession(config, sessionId);
    }
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
      
      // Add learning style specific adaptations
      if (preferences.visual > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          visualAids: true,
          useImages: true
        };
      }
      
      if (preferences.auditory > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          audioEmphasis: true,
          verbalExplanations: true
        };
      }
      
      if (preferences.kinesthetic > 7) {
        adaptedActivity.content = {
          ...adaptedActivity.content,
          interactiveElements: true,
          handsonActivities: true
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
        skillArea: config.skillArea,
        gradeLevel: config.gradeLevel
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
      sessionDuration: 900, // 15 minutes
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
