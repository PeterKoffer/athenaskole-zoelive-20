// @ts-nocheck

import { supabase } from '@/lib/supabaseClient';
import { type GameAssignment, type GameSession } from '@/types/database';

export const gameAssignmentService = {
  // Teacher-facing methods
  async createAssignment(assignment: Omit<GameAssignment, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<GameAssignment> {
    const { data, error } = await supabase
      .from('game_assignments')
      .insert(assignment)
      .select()
      .single();
    
    if (error) throw new Error(`Error creating assignment: ${error.message}`);
    return data;
  },

  async getTeacherAssignments(teacherId: string): Promise<GameAssignment[]> {
    const { data, error } = await supabase
      .from('game_assignments')
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) throw new Error(`Error fetching teacher assignments: ${error.message}`);
    return data || [];
  },

  async deleteAssignment(assignmentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('game_assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) throw new Error(`Error deleting assignment: ${error.message}`);
    return true;
  },

  // Student-facing methods
  async getStudentAssignments(studentId: string): Promise<GameAssignment[]> {
    const { data, error } = await supabase
      .from('game_assignments')
      .select('*')
      .contains('assigned_to_students', [studentId])
      .eq('is_active', true);

    if (error) throw new Error(`Error fetching student assignments: ${error.message}`);
    return data || [];
  },

  async getStudentProgress(studentId: string, gameId: string): Promise<any> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('score, duration_seconds')
      .eq('user_id', studentId)
      .eq('game_id', gameId)
      .eq('completion_status', 'completed');

    if (error) throw new Error(`Error fetching student progress: ${error.message}`);

    if (!data || data.length === 0) {
      return {
        completedSessions: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
      };
    }

    const completedSessions = data.length;
    const totalScore = data.reduce((sum, session) => sum + (session.score || 0), 0);
    const bestScore = Math.max(...data.map(session => session.score || 0));
    const totalTimeSpent = data.reduce((sum, session) => sum + (session.duration_seconds || 0), 0);

    return {
      completedSessions,
      averageScore: completedSessions > 0 ? Math.round(totalScore / completedSessions) : 0,
      bestScore,
      totalTimeSpent,
    };
  },

  // Game session tracking
  async startGameSession(sessionData: Partial<GameSession>): Promise<string | null> {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(sessionData)
      .select('id')
      .single();

    if (error) throw new Error(`Error starting game session: ${error.message}`);
    return data?.id || null;
  },

  async endGameSession(sessionId: string, finalScore: number, objectivesMet: string[], metrics: any, performanceData: any): Promise<boolean> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        end_time: new Date().toISOString(),
        score: finalScore,
        completion_status: 'completed',
        learning_objectives_met: objectivesMet,
        engagement_metrics: metrics,
        performance_data: performanceData
      })
      .eq('id', sessionId);

    if (error) throw new Error(`Error ending game session: ${error.message}`);
    return true;
  },

  async abandonGameSession(sessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        end_time: new Date().toISOString(),
        completion_status: 'abandoned'
      })
      .eq('id', sessionId);

    if (error) throw new Error(`Error abandoning game session: ${error.message}`);
    return true;
  },

  // Analytics
  async getGameAnalytics(teacherId: string): Promise<any> {
    const { data: assignments, error: assignmentsError } = await this.getTeacherAssignments(teacherId);
    if (assignmentsError) throw new Error(`Error in analytics: ${assignmentsError}`);

    const assignmentIds = assignments.map(a => a.id);

    const { data: sessions, error: sessionsError } = await supabase
      .from('game_sessions')
      .select('assignment_id, score, completion_status')
      .in('assignment_id', assignmentIds);

    if (sessionsError) throw new Error(`Error fetching sessions for analytics: ${sessionsError.message}`);

    const totalAssignments = assignments.length;
    const completedAssignments = sessions?.filter(s => s.completion_status === 'completed').length || 0;
    const totalScore = sessions?.reduce((sum, s) => sum + (s.score || 0), 0) || 0;

    return {
      totalAssignments,
      completionRate: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0,
      averageScore: completedAssignments > 0 ? totalScore / completedAssignments : 0,
    };
  }
};

export type { GameAssignment } from "@/types/database";
