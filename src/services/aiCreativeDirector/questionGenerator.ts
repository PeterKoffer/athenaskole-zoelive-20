
import type { EducationalContext, GeneratedQuestion } from './types';

export class QuestionGenerator {
  private questionCache = new Map<string, any[]>();
  private usedQuestions = new Set<string>();

  async generatePersonalizedQuestions(
    educationalContext: EducationalContext,
    userId: string,
    count: number = 3
  ): Promise<GeneratedQuestion[]> {
    try {
      console.log(`🎓 Generating ${count} PERSONALIZED K-12 questions for Grade ${educationalContext.gradeLevel} ${educationalContext.subject}/${educationalContext.skillArea}`);
      
      const questions: GeneratedQuestion[] = [];
      
      for (let i = 0; i < count; i++) {
        try {
          console.log(`📡 Calling enhanced K-12 question API for question ${i + 1}...`);
          
          const response = await fetch('https://tgjudtnjhtumrfthegis.supabase.co/functions/v1/generate-question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnanVkdG5qaHR1bXJmdGhlZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTk4NjEsImV4cCI6MjA2NDQzNTg2MX0.1OexubPIEWxM3sZ4ds3kSeWxNslKXbJo5GzCDOZRHcQ`
            },
            body: JSON.stringify({
              subject: educationalContext.subject,
              skillArea: educationalContext.skillArea,
              difficultyLevel: educationalContext.difficultyLevel,
              gradeLevel: educationalContext.gradeLevel,
              userId,
              questionIndex: i,
              promptVariation: i === 0 ? 'basic' : i === 1 ? 'word_problem' : 'mixed',
              specificContext: 'personalized K-12 learning',
              teacherRequirements: educationalContext.teacherRequirements,
              schoolStandards: educationalContext.schoolStandards,
              studentAdaptation: educationalContext.studentAdaptation
            }),
          });

          if (response.ok) {
            const questionData = await response.json();
            
            if (questionData.error || !questionData.question) {
              throw new Error(questionData.error || 'Invalid response structure');
            }
            
            if (this.validateQuestion(questionData) && !this.isDuplicateQuestion(questionData.question)) {
              this.usedQuestions.add(questionData.question);
              questions.push({
                question: questionData.question,
                options: questionData.options,
                correct: questionData.correct,
                explanation: questionData.explanation || "Great job!",
                isAiGenerated: true,
                isPersonalized: true,
                source: 'openai-k12-personalized',
                educationalNotes: questionData.educationalNotes
              });
            } else {
              questions.push(this.createFallbackQuestion(educationalContext, i));
            }
          } else {
            questions.push(this.createFallbackQuestion(educationalContext, i));
          }
        } catch (questionError) {
          console.error(`❌ Failed to generate personalized question ${i + 1}:`, questionError);
          questions.push(this.createFallbackQuestion(educationalContext, i));
        }
      }

      return questions;
    } catch (error) {
      console.error('❌ Error in generatePersonalizedQuestions:', error);
      return [this.createFallbackQuestion(educationalContext, 0)];
    }
  }

  private validateQuestion(questionData: any): boolean {
    return questionData && 
           questionData.question && 
           Array.isArray(questionData.options) && 
           questionData.options.length === 4 &&
           typeof questionData.correct === 'number' &&
           questionData.correct >= 0 && 
           questionData.correct <= 3;
  }

  private isDuplicateQuestion(question: string): boolean {
    const questionKey = question.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.usedQuestions.has(questionKey);
  }

  private createFallbackQuestion(educationalContext: EducationalContext, index: number): GeneratedQuestion {
    if (educationalContext.skillArea.includes('fraction') && educationalContext.skillArea.includes('like denominators')) {
      return this.createFractionFallback(index);
    }
    
    if (educationalContext.skillArea.includes('decimal multiplication')) {
      return this.createDecimalFallback(index);
    }

    const timestamp = Date.now().toString().slice(-4);
    return {
      question: `What is an important concept in Grade ${educationalContext.gradeLevel} ${educationalContext.subject}? (Question ${index + 1}-${timestamp})`,
      options: [`Concept A-${timestamp}`, `Concept B-${timestamp}`, `Concept C-${timestamp}`, `Concept D-${timestamp}`],
      correct: 0,
      explanation: `This helps you practice ${educationalContext.skillArea} skills.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'fallback'
    };
  }

  private createFractionFallback(index: number): GeneratedQuestion {
    const denominators = [6, 8, 10, 12];
    const denominator = denominators[index % denominators.length];
    const numerator1 = 1 + index;
    const numerator2 = 1 + (index % 2);
    const correctSum = numerator1 + numerator2;
    
    if (correctSum >= denominator) {
      return this.createFractionFallback((index + 1) % 4);
    }
    
    const correctAnswer = `${correctSum}/${denominator}`;
    const wrongOptions = [
      `${correctSum + 1}/${denominator}`,
      `${correctSum}/${denominator + denominator}`,
      `${correctSum - 1}/${denominator}`
    ];
    
    return {
      question: `What is ${numerator1}/${denominator} + ${numerator2}/${denominator}?`,
      options: [correctAnswer, ...wrongOptions],
      correct: 0,
      explanation: `When adding fractions with the same denominator, add the numerators: ${numerator1} + ${numerator2} = ${correctSum}. The answer is ${correctAnswer}.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'fallback'
    };
  }

  private createDecimalFallback(index: number): GeneratedQuestion {
    const factor1 = (1.2 + index * 0.3).toFixed(1);
    const factor2 = (2.1 + index * 0.2).toFixed(1);
    const product = (parseFloat(factor1) * parseFloat(factor2)).toFixed(2);
    
    return {
      question: `What is ${factor1} × ${factor2}?`,
      options: [
        product,
        (parseFloat(product) + 1).toFixed(2),
        (parseFloat(product) - 0.5).toFixed(2),
        (parseFloat(factor1) + parseFloat(factor2)).toFixed(2)
      ],
      correct: 0,
      explanation: `To multiply decimals: ${factor1} × ${factor2} = ${product}.`,
      isAiGenerated: false,
      isPersonalized: false,
      source: 'fallback'
    };
  }
}
