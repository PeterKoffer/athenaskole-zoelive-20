
export interface UserProgress {
  user_id: string;
  subject: string;
  skill_area: string;
  attempts_count: number;
  accuracy_rate: number;
  current_level: number;
  last_assessment: string;
  // Add missing properties for backward compatibility
  accuracy?: number;
  attempts?: number;
  currentLevel?: number;
  overall_accuracy?: number;
}

export interface SessionData {
  user_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  start_time: string;
  end_time?: string;
  time_spent: number;
  score: number;
  completed: boolean;
}

export interface AdaptiveContentRecord {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  content_type: string;
  generated_content: any;
  difficulty_level: number;
  created_at: string;
}

export interface GeneratedContent {
  id: string;
  content: any;
  metadata: any;
  created_at: string;
}

export class ProgressPersistence {
  async getUserProgress(userId: string, subject: string, skillArea: string): Promise<UserProgress | null> {
    try {
      // Mock implementation
      return {
        user_id: userId,
        subject,
        skill_area: skillArea,
        attempts_count: 10,
        accuracy_rate: 75,
        current_level: 2,
        last_assessment: new Date().toISOString(),
        // Backward compatibility aliases
        accuracy: 75,
        attempts: 10,
        currentLevel: 2,
        overall_accuracy: 75
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async updateUserProgress(userId: string, subject: string, skillArea: string, progressData: any): Promise<boolean> {
    try {
      // Mock implementation
      console.log('Updating user progress:', { userId, subject, skillArea, progressData });
      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
  }

  async saveSession(sessionData: SessionData): Promise<string | null> {
    try {
      // Mock implementation - in real app would save to database
      const sessionId = `session_${Date.now()}`;
      console.log('Saving session:', { sessionId, sessionData });
      return sessionId;
    } catch (error) {
      console.error('Error saving session:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
    try {
      // Mock implementation - in real app would update database
      console.log('Updating session:', { sessionId, updates });
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }
}

export const progressPersistence = new ProgressPersistence();
