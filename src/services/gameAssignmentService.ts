import { supabase } from '@/integrations/supabase/client';

export interface GameAssignment {
  id?: string;
  teacher_id: string;
  game_id: string;
  subject: string;
  skill_area?: string;
  learning_objective?: string;
  lesson_id?: string;
  assigned_to_class?: string;
  assigned_to_students?: string[];
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface GameSession {
  id?: string;
  user_id: string;
  game_id: string;
  assignment_id?: string;
  subject: string;
  skill_area?: string;
  start_time?: string;
  end_time?: string;
  duration_seconds?: number;
  score?: number;
  completion_status?: 'in_progress' | 'completed' | 'abandoned';
  learning_objectives_met?: string[];
  engagement_metrics?: any;
  performance_data?: any;
}

export class GameAssignmentService {
  // Teacher methods for managing game assignments
  async createAssignment(assignment: Omit<GameAssignment, 'id' | 'created_at' | 'updated_at'>): Promise<GameAssignment | null> {
    try {
      const { data, error } = await supabase
        .from('game_assignments')
        .insert(assignment)
        .select()
        .single();

      if (error) {
        console.error('Error creating game assignment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating game assignment:', error);
      return null;
    }
  }

  async getTeacherAssignments(teacherId: string): Promise<GameAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('game_assignments')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher assignments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      return [];
    }
  }

  async updateAssignment(id: string, updates: Partial<GameAssignment>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('game_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating game assignment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating game assignment:', error);
      return false;
    }
  }

  async deleteAssignment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('game_assignments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting game assignment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting game assignment:', error);
      return false;
    }
  }

  async getStudentAssignments(studentId: string): Promise<GameAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('game_assignments')
        .select('*')
        .contains('assigned_to_students', [studentId])
        .eq('is_active', true)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching student assignments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      return [];
    }
  }

  // Student methods for game sessions
  async startGameSession(session: Omit<GameSession, 'id' | 'start_time'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          ...session,
          start_time: new Date().toISOString(),
          completion_status: 'in_progress'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error starting game session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error starting game session:', error);
      return null;
    }
  }

  async endGameSession(
    sessionId: string, 
    score: number, 
    learningObjectivesMet: string[] = [],
    engagementMetrics: any = {},
    performanceData: any = {}
  ): Promise<boolean> {
    try {
      // Get start time to calculate duration
      const { data: sessionData, error: fetchError } = await supabase
        .from('game_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return false;
      }

      const endTime = new Date();
      const startTime = new Date(sessionData.start_time);
      const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

      const { error } = await supabase
        .from('game_sessions')
        .update({
          end_time: endTime.toISOString(),
          duration_seconds: durationSeconds,
          score,
          completion_status: 'completed',
          learning_objectives_met: learningObjectivesMet,
          engagement_metrics: engagementMetrics,
          performance_data: performanceData
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending game session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error ending game session:', error);
      return false;
    }
  }

  async abandonGameSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('game_sessions')
        .update({
          end_time: new Date().toISOString(),
          completion_status: 'abandoned'
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error abandoning game session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error abandoning game session:', error);
      return false;
    }
  }

  // Analytics methods
  async getGameAnalytics(teacherId?: string, gameId?: string, timeframe: number = 30): Promise<any> {
    try {
      const fromDate = new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000).toISOString();
      
      let query = supabase
        .from('game_sessions')
        .select(`
          *,
          game_assignments!inner(teacher_id, game_id, subject, learning_objective)
        `)
        .gte('start_time', fromDate);

      if (teacherId) {
        query = query.eq('game_assignments.teacher_id', teacherId);
      }
      
      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching game analytics:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          averageScore: 0,
          averageDuration: 0,
          completionRate: 0,
          subjectBreakdown: {},
          objectiveProgress: {}
        };
      }

      const completedSessions = data.filter(s => s.completion_status === 'completed');
      
      return {
        totalSessions: data.length,
        completedSessions: completedSessions.length,
        averageScore: completedSessions.length > 0 
          ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length 
          : 0,
        averageDuration: completedSessions.length > 0
          ? completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / completedSessions.length
          : 0,
        completionRate: data.length ? (completedSessions.length / data.length) * 100 : 0,
        subjectBreakdown: data.reduce((acc, s) => {
          acc[s.subject] = (acc[s.subject] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        objectiveProgress: completedSessions.reduce((acc, s) => {
          (s.learning_objectives_met || []).forEach((obj: string) => {
            acc[obj] = (acc[obj] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('Error calculating game analytics:', error);
      return null;
    }
  }

  async getStudentProgress(studentId: string, gameId?: string): Promise<any> {
    try {
      let query = supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', studentId)
        .order('start_time', { ascending: false });

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching student progress:', error);
        return null;
      }

      const sessions = data || [];
      const completedSessions = sessions.filter(s => s.completion_status === 'completed');

      return {
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        averageScore: completedSessions.length > 0 
          ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length 
          : 0,
        bestScore: completedSessions.length > 0 
          ? Math.max(...completedSessions.map(s => s.score || 0))
          : 0,
        totalTimeSpent: completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0),
        recentSessions: sessions.slice(0, 10),
        learningObjectivesAchieved: [...new Set(
          completedSessions.flatMap(s => s.learning_objectives_met || [])
        )]
      };
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return null;
    }
  }
}

export const gameAssignmentService = new GameAssignmentService();