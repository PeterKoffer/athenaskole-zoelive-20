
import { StableQuestionTemplate, PrecompiledQuestion } from './types';
import { mathTemplates } from './templates';
import { QuestionGenerator } from './questionGenerator';

export class StableQuestionTemplateSystem {
  private precompiledQuestions = new Map<string, PrecompiledQuestion[]>();
  private sessionQuestions = new Map<string, Set<string>>();
  private batchSize = 50;
  private questionGenerator = new QuestionGenerator();
  private templates: StableQuestionTemplate[] = mathTemplates;

  constructor() {
    this.precompileAllQuestions();
  }

  private precompileAllQuestions(): void {
    console.log('🏭 Pre-compiling stable question templates...');
    
    for (const template of this.templates) {
      const questions: PrecompiledQuestion[] = [];
      
      for (let i = 0; i < this.batchSize; i++) {
        const question = this.questionGenerator.generateFromTemplate(template, i);
        questions.push(question);
      }
      
      this.precompiledQuestions.set(template.id, questions);
      console.log(`✅ Pre-compiled ${questions.length} questions for template: ${template.id}`);
    }
    
    console.log(`🎯 Total pre-compiled questions: ${this.getTotalPrecompiledCount()}`);
  }

  getStableQuestion(
    subject: string,
    skillArea: string,
    sessionId: string,
    difficultyLevel: number = 1
  ): PrecompiledQuestion | null {
    console.log(`🎯 Getting stable question for ${subject}/${skillArea} (Session: ${sessionId})`);
    
    if (!this.sessionQuestions.has(sessionId)) {
      this.sessionQuestions.set(sessionId, new Set());
    }
    const usedQuestions = this.sessionQuestions.get(sessionId)!;

    const availableTemplates = this.templates.filter(template => 
      template.subject === subject &&
      (skillArea === 'general_math' || template.skillArea === skillArea) &&
      template.difficultyLevel <= difficultyLevel
    );

    if (availableTemplates.length === 0) {
      console.warn('⚠️ No matching templates found');
      return null;
    }

    for (const template of availableTemplates) {
      const precompiledQuestions = this.precompiledQuestions.get(template.id) || [];
      const availableQuestions = precompiledQuestions.filter(q => !usedQuestions.has(q.id));
      
      if (availableQuestions.length > 0) {
        const selectedQuestion = availableQuestions[0];
        usedQuestions.add(selectedQuestion.id);
        
        console.log(`✅ Retrieved stable question: ${selectedQuestion.question.substring(0, 50)}...`);
        return selectedQuestion;
      }
    }

    console.log('🔄 All questions used, resetting session');
    usedQuestions.clear();
    return this.getStableQuestion(subject, skillArea, sessionId, difficultyLevel);
  }

  clearSession(sessionId: string): void {
    this.sessionQuestions.delete(sessionId);
    console.log(`🧹 Cleared stable question session: ${sessionId}`);
  }

  getTotalPrecompiledCount(): number {
    let total = 0;
    for (const questions of this.precompiledQuestions.values()) {
      total += questions.length;
    }
    return total;
  }

  getStats(): Record<string, any> {
    return {
      totalTemplates: this.templates.length,
      totalPrecompiledQuestions: this.getTotalPrecompiledCount(),
      activeSessions: this.sessionQuestions.size,
      questionsPerTemplate: this.batchSize
    };
  }
}

export const stableQuestionTemplateSystem = new StableQuestionTemplateSystem();
export type { StableQuestionTemplate, PrecompiledQuestion };
