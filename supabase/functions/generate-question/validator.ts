
import { GeneratedQuestion } from './types.ts';

export function validateQuestionStructure(questionData: any): questionData is GeneratedQuestion {
  const isValid = questionData && 
         questionData.question && 
         Array.isArray(questionData.options) && 
         questionData.options.length === 4 &&
         typeof questionData.correct === 'number' &&
         questionData.correct >= 0 && 
         questionData.correct <= 3;

  if (!isValid) {
    console.error('❌ Invalid question structure:', questionData);
  }

  return isValid;
}
