
// Mock implementation for learner profile service
// Note: This replaces database operations for non-existent tables

export interface LearnerPreferences {
  preferredSubjects: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number;
  sessionDuration: number;
}

export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number;
  confidenceScore: number;
  lastAssessed: string;
  practiceCount: number;
}

export interface InteractionEvent {
  timestamp: string;
  eventType: string;
  context: Record<string, any>;
}

export interface LearnerProfile {
  userId: string;
  preferences: LearnerPreferences;
  knowledgeComponentMastery: KnowledgeComponentMastery[];
  learningHistory: InteractionEvent[];
  createdAt: string;
  updatedAt: string;
}

export class MockProfileService {
  static async getLearnerProfile(userId: string): Promise<LearnerProfile> {
    console.log('👤 Getting learner profile (mock implementation)');
    
    // Mock learner profile
    return {
      userId,
      preferences: {
        preferredSubjects: ['Mathematics', 'Science'],
        learningStyle: 'visual',
        difficultyPreference: 3,
        sessionDuration: 30
      },
      knowledgeComponentMastery: [
        {
          kcId: 'kc_math_addition',
          masteryLevel: 0.8,
          confidenceScore: 0.75,
          lastAssessed: new Date().toISOString(),
          practiceCount: 15
        }
      ],
      learningHistory: [
        {
          timestamp: new Date().toISOString(),
          eventType: 'question_answered',
          context: { questionId: 'q123', correct: true }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async updateKnowledgeComponentMastery(
    userId: string, 
    kcId: string, 
    isCorrect: boolean, 
    responseTime: number
  ): Promise<void> {
    console.log('📊 Updating KC mastery (mock implementation)', { userId, kcId, isCorrect, responseTime });
    
    // Mock implementation - would update mastery in database
  }

  static async getRecommendations(userId: string): Promise<any[]> {
    console.log('💡 Getting recommendations (mock implementation)');
    
    // Mock recommendations
    return [
      {
        type: 'practice',
        kcId: 'kc_math_fractions',
        reason: 'Low mastery detected',
        priority: 'high'
      }
    ];
  }

  static async recordInteraction(userId: string, eventType: string, context: any): Promise<void> {
    console.log('📝 Recording interaction (mock implementation)', { userId, eventType, context });
    
    // Mock implementation
  }
}
