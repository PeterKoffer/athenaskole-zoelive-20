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
 

