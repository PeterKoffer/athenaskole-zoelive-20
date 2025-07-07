
// Subject Question Service (Mock Implementation)

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
  private mockTemplates: SubjectQuestionTemplate[] = [
    {
      id: 'math_addition_1',
      subject: 'Mathematics',
      skill_area: 'Addition',
      question_template: 'What is {a} + {b}?',
      options_template: ['{result}', '{result+1}', '{result-1}', '{result+2}'],
      correct_answer: 0,
      explanation_template: '{a} + {b} = {result}',
      difficulty_level: 1
    },
    {
      id: 'science_biology_1',
      subject: 'Science',
      skill_area: 'Biology',
      question_template: 'What is the powerhouse of the cell?',
      options_template: ['Mitochondria', 'Nucleus', 'Ribosome', 'Cytoplasm'],
      correct_answer: 0,
      explanation_template: 'Mitochondria are known as the powerhouse of the cell because they produce ATP.',
      difficulty_level: 2
    }
  ];

  async getQuestionTemplates(subject?: string): Promise<SubjectQuestionTemplate[]> {
    try {
      console.log('📚 [SubjectQuestionService] Getting question templates for:', subject || 'all subjects');
      
      let templates = this.mockTemplates;
      
      if (subject) {
        templates = templates.filter(template => 
          template.subject.toLowerCase() === subject.toLowerCase()
        );
      }
      
      console.log('✅ [SubjectQuestionService] Retrieved templates:', templates.length);
      return templates;
    } catch (error) {
      console.error('❌ [SubjectQuestionService] Failed to get templates:', error);
      return [];
    }
  }

  async generateQuestionFromTemplate(templateId: string, variables: Record<string, any>): Promise<any> {
    try {
      console.log('🔄 [SubjectQuestionService] Generating question from template:', templateId);
      
      const template = this.mockTemplates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }
      
      // Simple variable substitution
      let question = template.question_template;
      let explanation = template.explanation_template;
      
      // Calculate result for math templates
      if (template.id === 'math_addition_1' && variables.a && variables.b) {
        variables.result = variables.a + variables.b;
      }
      
      Object.entries(variables).forEach(([key, value]) => {
        question = question.replace(new RegExp(`{${key}}`, 'g'), String(value));
        explanation = explanation.replace(new RegExp(`{${key}}`, 'g'), String(value));
      });
      
      const options = template.options_template.map(option => {
        let processedOption = option;
        Object.entries(variables).forEach(([key, value]) => {
          processedOption = processedOption.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
        return processedOption;
      });
      
      const generatedQuestion = {
        id: `gen_${templateId}_${Date.now()}`,
        question,
        options,
        correct: template.correct_answer,
        explanation,
        subject: template.subject,
        skillArea: template.skill_area,
        difficulty: template.difficulty_level
      };
      
      console.log('✅ [SubjectQuestionService] Question generated:', generatedQuestion.id);
      return generatedQuestion;
    } catch (error) {
      console.error('❌ [SubjectQuestionService] Failed to generate question:', error);
      return null;
    }
  }

  async getRandomQuestionForSubject(subject: string): Promise<any> {
    const templates = await this.getQuestionTemplates(subject);
    if (templates.length === 0) return null;
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const variables = {
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1,
      result: 0 // Will be calculated in the template
    };
    
    return this.generateQuestionFromTemplate(randomTemplate.id, variables);
  }

  async createDynamicQuestion(subject: string, difficulty: number): Promise<any> {
    const templates = await this.getQuestionTemplates(subject);
    const filteredTemplates = templates.filter(t => t.difficulty_level === difficulty);
    
    if (filteredTemplates.length === 0) {
      return this.getRandomQuestionForSubject(subject);
    }
    
    const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
    const variables = {
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1,
      result: 0
    };
    
    return this.generateQuestionFromTemplate(template.id, variables);
  }
}

export const subjectQuestionService = new SubjectQuestionService();
