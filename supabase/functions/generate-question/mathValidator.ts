
import { GeneratedQuestion, QuestionValidationResult } from './types.ts';

export function validateMathAnswer(questionData: GeneratedQuestion, skillArea: string): QuestionValidationResult {
  if (!skillArea.includes('fraction') || !skillArea.includes('subtraction')) {
    return { isValid: true };
  }

  console.log(`🔍 Validating fraction subtraction math...`);
  const question = questionData.question;
  const correctOption = questionData.options[questionData.correct];
  
  // Extract fractions from question (basic pattern matching)
  const fractionMatch = question.match(/(\d+)\/(\d+)\s*-\s*(\d+)\/(\d+)/);
  if (!fractionMatch) {
    return { isValid: true }; // Can't validate, assume correct
  }

  const [, num1, den1, num2, den2] = fractionMatch;
  if (den1 !== den2) {
    return { isValid: true }; // Not like denominators, can't validate
  }

  // Like denominators - validate the math
  const result = parseInt(num1) - parseInt(num2);
  const expectedAnswer = `${result}/${den1}`;
  
  console.log(`🧮 Math check: ${num1}/${den1} - ${num2}/${den2} = ${expectedAnswer}`);
  console.log(`🎯 AI says correct answer is: ${correctOption}`);
  
  // Verify the correct option matches our calculation
  if (correctOption !== expectedAnswer) {
    console.error(`❌ Math validation failed! Expected ${expectedAnswer}, got ${correctOption}`);
    
    // Find the correct index
    const correctIndex = questionData.options.findIndex(opt => opt === expectedAnswer);
    if (correctIndex !== -1) {
      console.log(`🔧 Found correct answer at index ${correctIndex}`);
      return { 
        isValid: false, 
        correctedIndex: correctIndex,
        error: `Math validation failed: expected ${expectedAnswer}, got ${correctOption}`
      };
    }
    
    return { 
      isValid: false, 
      error: `Math validation failed and couldn't find correct answer in options`
    };
  }

  console.log(`✅ Math validation passed!`);
  return { isValid: true };
}
