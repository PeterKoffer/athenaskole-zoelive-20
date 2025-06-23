
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
    const templateId = this.findTemplateId(subject, skillArea, difficultyLevel);
    if (!templateId) {
      console.warn(`No template found for ${subject}-${skillArea}-${difficultyLevel}`);
      return null;
    }

    const questions = this.precompiledQuestions.get(templateId);
    if (!questions || questions.length === 0) {
      console.warn(`No questions available for template: ${templateId}`);
      return null;
    }

    if (!this.sessionQuestions.has(sessionId)) {
      this.sessionQuestions.set(sessionId, new Set());
    }
    const usedQuestions = this.sessionQuestions.get(sessionId)!;

    const availableQuestions = questions.filter(q => !usedQuestions.has(q.id));
    if (availableQuestions.length === 0) {
      console.warn(`All questions used for session ${sessionId}, template ${templateId}`);
      return questions[Math.floor(Math.random() * questions.length)];
    }

    const selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    usedQuestions.add(selectedQuestion.id);

    return selectedQuestion;
  }

  private findTemplateId(subject: string, skillArea: string, difficultyLevel: number): string | null {
    const template = this.templates.find(t => 
      t.subject === subject && 
      t.skillArea === skillArea && 
      t.difficultyLevel === difficultyLevel
    );
    return template?.id || null;
  }

  private getTotalPrecompiledCount(): number {
    let total = 0;
    for (const questions of this.precompiledQuestions.values()) {
      total += questions.length;
    }
    return total;
  }

  clearSessionQuestions(sessionId: string): void {
    this.sessionQuestions.delete(sessionId);
  }

  clearSession(sessionId: string): void {
    this.clearSessionQuestions(sessionId);
  }

  getSessionStats(sessionId: string): { used: number; available: number } {
    const usedQuestions = this.sessionQuestions.get(sessionId);
    const usedCount = usedQuestions ? usedQuestions.size : 0;
    const totalCount = this.getTotalPrecompiledCount();
    return { used: usedCount, available: totalCount - usedCount };
  }

  getStats(sessionId: string): { used: number; available: number } {
    return this.getSessionStats(sessionId);
  }
}

export const stableQuestionTemplateSystem = new StableQuestionTemplateSystem();
