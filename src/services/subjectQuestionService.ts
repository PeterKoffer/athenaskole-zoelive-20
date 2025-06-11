
import { supabase } from '@/integrations/supabase/client';

export interface SubjectQuestionTemplate {
  id: string;
  subject: string;
  skill_area: string;
  question_template: string;
  options_template: string[];
  correct_answer: number;
  explanation_template: string;
  difficulty_level: number;
}

export class SubjectQuestionService {
  static async getQuestionsForSubject(subject: string, skillArea?: string, count: number = 10): Promise<SubjectQuestionTemplate[]> {
    try {
      let query = supabase
        .from('subject_question_templates')
        .select('*')
        .eq('subject', subject);

      if (skillArea) {
        query = query.eq('skill_area', skillArea);
      }

      const { data, error } = await query.limit(count);

      if (error) {
        console.error('Error fetching subject questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsForSubject:', error);
      return [];
    }
  }

  static async getRandomQuestionForSubject(subject: string, skillArea?: string, excludeIds: string[] = []): Promise<SubjectQuestionTemplate | null> {
    try {
      let query = supabase
        .from('subject_question_templates')
        .select('*')
        .eq('subject', subject);

      if (skillArea) {
        query = query.eq('skill_area', skillArea);
      }

      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching random question:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // Return a random question from the results
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      console.error('Error in getRandomQuestionForSubject:', error);
      return null;
    }
  }

  static createDynamicQuestion(template: SubjectQuestionTemplate): any {
    return {
      id: `dynamic-${template.id}-${Date.now()}`,
      title: `${template.subject} Question`,
      type: 'activity',
      phase: 'interactive-game' as const,
      duration: 3,
      content: {
        question: template.question_template,
        options: template.options_template,
        correctAnswer: template.correct_answer,
        explanation: template.explanation_template
      },
      metadata: {
        subject: template.subject,
        skillArea: template.skill_area,
        difficultyLevel: template.difficulty_level,
        templateId: template.id
      }
    };
  }
}
