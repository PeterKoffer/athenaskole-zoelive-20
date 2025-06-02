
import { sessionService } from './sessionService';
import { userProgressService, UserProgress as ServiceUserProgress } from './userProgressService';

// Use the UserProgress from userProgressService and add the missing id field
export interface UserProgress extends ServiceUserProgress {
  id: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  start_time: string;
  end_time?: string;
  time_spent: number;
  score: number;
  completed: boolean;
  content_id?: string;
  user_feedback?: any;
  ai_adjustments?: any;
}

class ProgressPersistenceService {
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    return sessionService.saveSession(sessionData);
  }

  async updateSession(sessionId: string, updates: Partial<LearningSession>): Promise<boolean> {
    return sessionService.updateSession(sessionId, updates);
  }

  async getUserProgress(userId: string, subject: string): Promise<UserProgress | null> {
    const progress = await userProgressService.getUserProgress(userId, subject);
    if (!progress) return null;
    
    // Add the missing id field
    return {
      ...progress,
      id: `${userId}-${subject}-${progress.skill_area}`
    };
  }

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    // Remove the id field before passing to userProgressService
    const { id, ...serviceProgressData } = progressData;
    return userProgressService.updateUserProgress(serviceProgressData);
  }

  async getRecentSessions(userId: string, limit: number = 10): Promise<LearningSession[]> {
    return sessionService.getRecentSessions(userId, limit);
  }

  async getPerformanceAnalytics(userId: string, subject: string, days: number = 30): Promise<any> {
    try {
      const sessions = await this.getRecentSessions(userId, 100);
      const filteredSessions = sessions.filter(session => 
        session.subject === subject &&
        new Date(session.start_time) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      );

      const analytics = {
        totalSessions: filteredSessions.length,
        totalTimeSpent: filteredSessions.reduce((sum, session) => sum + (session.time_spent || 0), 0),
        averageScore: filteredSessions.length > 0 
          ? filteredSessions.reduce((sum, session) => sum + (session.score || 0), 0) / filteredSessions.length 
          : 0,
        difficultyProgression: filteredSessions.map(session => ({
          date: session.start_time,
          level: session.difficulty_level
        })),
        dailyProgress: this.groupSessionsByDay(filteredSessions)
      };

      return analytics;
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return null;
    }
  }

  private groupSessionsByDay(sessions: LearningSession[]): any[] {
    const grouped = sessions.reduce((acc, session) => {
      const date = session.start_time.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          sessions: 0,
          totalTime: 0,
          totalScore: 0,
          sessionCount: 0
        };
      }
      acc[date].sessions++;
      acc[date].totalTime += session.time_spent || 0;
      acc[date].totalScore += session.score || 0;
      acc[date].sessionCount++;
      return acc;
    }, {} as any);

    return Object.values(grouped).map((day: any) => ({
      ...day,
      averageScore: day.sessionCount > 0 ? day.totalScore / day.sessionCount : 0
    }));
  }

  calculateLearningStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0;

    const today = new Date();
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    let streak = 0;
    let currentDate = today;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.start_time);
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak + 1) {
        break;
      }
    }

    return streak;
  }
}

export const progressPersistence = new ProgressPersistenceService();
