
import { supabase } from '@/integrations/supabase/client';
import { DailyUniverse, LearningAtom } from './DailyUniverseGenerator';

export interface UniverseProgress {
  universeId: string;
  currentAtomIndex: number;
  completedAtoms: string[];
  startTime: string;
  totalTimeSpent: number;
  studentNotes: string[];
  isCompleted: boolean;
}

class UniverseSessionManager {
  private currentUniverse: DailyUniverse | null = null;
  private currentProgress: UniverseProgress | null = null;

  async getCurrentUniverse(userId: string): Promise<DailyUniverse | null> {
    return this.currentUniverse;
  }

  async saveUniverseProgress(userId: string, progress: UniverseProgress): Promise<void> {
    try {
      // Save to Supabase lesson_progress table (repurposing for universe progress)
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          subject: 'daily-universe',
          skill_area: 'integrated-learning',
          current_activity_index: progress.currentAtomIndex,
          total_activities: this.currentUniverse?.learningAtoms.length || 0,
          score: progress.completedAtoms.length,
          time_elapsed: progress.totalTimeSpent,
          is_completed: progress.isCompleted,
          lesson_data: {
            universeId: progress.universeId,
            completedAtoms: progress.completedAtoms,
            studentNotes: progress.studentNotes,
            startTime: progress.startTime
          }
        });

      if (error) {
        console.error('Error saving universe progress:', error);
      } else {
        this.currentProgress = progress;
        console.log('✅ Universe progress saved successfully');
      }
    } catch (error) {
      console.error('Failed to save universe progress:', error);
    }
  }

  async loadUniverseProgress(userId: string, universeId: string): Promise<UniverseProgress | null> {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', 'daily-universe')
        .eq('skill_area', 'integrated-learning')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.log('No existing universe progress found');
        return null;
      }

      const progress: UniverseProgress = {
        universeId: data.lesson_data?.universeId || universeId,
        currentAtomIndex: data.current_activity_index,
        completedAtoms: data.lesson_data?.completedAtoms || [],
        startTime: data.lesson_data?.startTime || new Date().toISOString(),
        totalTimeSpent: data.time_elapsed || 0,
        studentNotes: data.lesson_data?.studentNotes || [],
        isCompleted: data.is_completed || false
      };

      this.currentProgress = progress;
      return progress;
    } catch (error) {
      console.error('Failed to load universe progress:', error);
      return null;
    }
  }

  async completeAtom(
    userId: string, 
    atomId: string, 
    timeSpent: number, 
    studentNote?: string
  ): Promise<void> {
    if (!this.currentProgress) return;

    // Update progress
    this.currentProgress.completedAtoms.push(atomId);
    this.currentProgress.currentAtomIndex += 1;
    this.currentProgress.totalTimeSpent += timeSpent;
    
    if (studentNote) {
      this.currentProgress.studentNotes.push(studentNote);
    }

    // Check if universe is complete
    if (this.currentUniverse && 
        this.currentProgress.currentAtomIndex >= this.currentUniverse.learningAtoms.length) {
      this.currentProgress.isCompleted = true;
    }

    await this.saveUniverseProgress(userId, this.currentProgress);
  }

  setCurrentUniverse(universe: DailyUniverse): void {
    this.currentUniverse = universe;
  }

  getCurrentProgress(): UniverseProgress | null {
    return this.currentProgress;
  }

  async resetDailyProgress(userId: string): Promise<void> {
    this.currentProgress = null;
    this.currentUniverse = null;
    
    // Delete today's progress to start fresh
    try {
      await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', userId)
        .eq('subject', 'daily-universe')
        .eq('skill_area', 'integrated-learning');
      
      console.log('🔄 Daily universe progress reset');
    } catch (error) {
      console.error('Failed to reset daily progress:', error);
    }
  }
}

export default new UniverseSessionManager();
