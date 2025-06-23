
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
  content?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

export class SubjectQuestionService {
  static async getQuestionsForSubject(
    subject: string,
    skillArea?: string,
    count: number = 10
  ): Promise<SubjectQuestionTemplate[]> {
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

      return (data || []).map(item => ({
        id: item.id,
        subject: item.subject,
        skill_area: item.skill_area,
        question_template: item.question_template,
        options_template: Array.isArray(item.options_template)
          ? item.options_template
          : typeof item.options_template === 'string'
            ? JSON.parse(item.options_template)
            : [],
        correct_answer: item.correct_answer,
        explanation_template: item.explanation_template,
        difficulty_level: item.difficulty_level
      }));
    } catch (error) {
      console.error('Error in getQuestionsForSubject:', error);
      return [];
    }
  }

  static async getRandomQuestionForSubject(
    subject: string,
    skillArea?: string,
    excludeIds: string[] = []
  ): Promise<SubjectQuestionTemplate | null> {
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

      const randomIndex = Math.floor(Math.random() * data.length);
      const item = data[randomIndex];

      return {
        id: item.id,
        subject: item.subject,
        skill_area: item.skill_area,
        question_template: item.question_template,
        options_template: Array.isArray(item.options_template)
          ? item.options_template
          : typeof item.options_template === 'string'
            ? JSON.parse(item.options_template)
            : [],
        correct_answer: item.correct_answer,
        explanation_template: item.explanation_template,
        difficulty_level: item.difficulty_level
      };
    } catch (error) {
      console.error('Error in getRandomQuestionForSubject:', error);
      return null;
    }
  }

  static async createDynamicQuestion(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    usedQuestions: string[] = []
  ): Promise<SubjectQuestionTemplate | null> {
    try {
      console.log('🎯 Creating dynamic question for:', { subject, skillArea, difficultyLevel });
      
      // Try to get existing template first
      const template = await this.getRandomQuestionForSubject(subject, skillArea, usedQuestions);
      
      if (template) {
        // Add content property to match expected interface
        template.content = {
          question: template.question_template,
          options: template.options_template,
          correct: template.correct_answer,
          explanation: template.explanation_template
        };
        return template;
      }

      // If no template found, create a basic fallback question
      const fallbackQuestion: SubjectQuestionTemplate = {
        id: `dynamic_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        subject,
        skill_area: skillArea,
        question_template: `What is an important concept in ${skillArea}?`,
        options_template: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_answer: 0,
        explanation_template: `This is a practice question for ${skillArea}.`,
        difficulty_level: difficultyLevel,
        content: {
          question: `What is an important concept in ${skillArea}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: `This is a practice question for ${skillArea}.`
        }
      };

      console.log('✅ Created fallback dynamic question');
      return fallbackQuestion;
      
    } catch (error) {
      console.error('Error creating dynamic question:', error);
      return null;
    }
  }

  static createDynamicQuestion(template: SubjectQuestionTemplate): SubjectQuestionTemplate {
    // Overloaded method for backward compatibility
    return {
      ...template,
      content: {
        question: template.question_template,
        options: template.options_template,
        correct: template.correct_answer,
        explanation: template.explanation_template
      }
    };
  }
}
