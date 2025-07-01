
// Content Validation and Math Answer Checking

import { validateMathAnswer } from './math_utils.ts';

export function validateAndCorrectAIContent(atoms: any[]): void {
  atoms.forEach((atom: any, atomIndex: number) => {
    if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && atom.content) {
      const { question, options, correctAnswer } = atom.content;
      
      console.log(`🔍 Validating AI question ${atomIndex + 1}: "${question.substring(0, 50)}..."`);
      
      // Math validation
      if (question.includes('÷') || question.includes('×') || question.includes('+') || question.includes('-') || question.includes('/')) {
        const validatedCorrectAnswer = validateMathAnswer(question, options, correctAnswer);
        
        if (validatedCorrectAnswer !== correctAnswer) {
          console.log(`🔧 AI Content: Correcting answer from ${correctAnswer} to ${validatedCorrectAnswer}`);
          atom.content.correctAnswer = validatedCorrectAnswer;
        } else {
          console.log(`✅ AI Content: Answer validation passed for question ${atomIndex + 1}`);
        }
      }
      
      // Bounds check
      if (atom.content.correctAnswer < 0 || atom.content.correctAnswer >= options.length) {
        console.warn(`⚠️ Invalid correctAnswer index ${atom.content.correctAnswer}. Setting to 0.`);
        atom.content.correctAnswer = 0;
      }
    }
  });
}
