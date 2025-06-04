
import { supabase } from '@/integrations/supabase/client';
import { Question } from './types';

export class QuestionHistoryService {
  static async getRecentQuestions(userId: string, subject: string, skillArea: string, limit: number = 50): Promise<string[]> {
    const { data: recentQuestions } = await supabase
      .from('user_question_history')
      .select('question_text')
      .eq('user_id', userId)
      .eq('subject', subject)
      .eq('skill_area', skillArea)
      .order('asked_at', { ascending: false })
      .limit(limit);

    return recentQuestions?.map(q => q.question_text) || [];
  }

  static async saveQuestionHistory(
    userId: string,
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    question: Question,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number,
    additionalContext?: any
  ): Promise<void> {
    try {
      await supabase.from('user_question_history').insert({
        user_id: userId,
        subject,
        skill_area: skillArea,
        question_text: question.question,
        difficulty_level: difficultyLevel,
        concepts_covered: question.conceptsCovered,
        user_answer: userAnswer.toString(),
        correct_answer: question.correct.toString(),
        is_correct: isCorrect,
        response_time_seconds: Math.round(responseTime / 1000),
        metadata: additionalContext
      });
    } catch (error) {
      console.warn('Could not save question history:', error);
    }
  }
}
