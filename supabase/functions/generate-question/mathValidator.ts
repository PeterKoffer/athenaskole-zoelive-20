
import { GeneratedQuestion, QuestionValidationResult } from './types.ts';

export function validateMathAnswer(questionData: GeneratedQuestion, skillArea: string): QuestionValidationResult {
  if (!skillArea.includes('fraction')) {
    return { isValid: true };
  }

  console.log(`🔍 Validating fraction math for skill: ${skillArea}...`);
  const question = questionData.question;
  const correctOption = questionData.options[questionData.correct];
  
  // Enhanced fraction validation for addition and subtraction
  if (skillArea.includes('add') || skillArea.includes('subtract')) {
    // Extract fractions from question (enhanced pattern matching)
    const additionMatch = question.match(/(\d+)\/(\d+)\s*(?:and|plus|\+|gives?\s+another)\s*(\d+)\/(\d+)/i);
    const subtractionMatch = question.match(/(\d+)\/(\d+)\s*(?:and.*gives?\s*|minus|-)\s*(\d+)\/(\d+)/i);
    
    let match = additionMatch || subtractionMatch;
    let isAddition = !!additionMatch;
    
    if (!match) {
      console.log('⚠️ Could not parse fraction operation from question');
      return { isValid: true }; // Can't validate, assume correct
    }

    const [, num1, den1, num2, den2] = match;
    const denominator1 = parseInt(den1);
    const denominator2 = parseInt(den2);
    const numerator1 = parseInt(num1);
    const numerator2 = parseInt(num2);
    
    // Only validate like denominators for now
    if (denominator1 !== denominator2) {
      console.log('⚠️ Unlike denominators detected, skipping validation');
      return { isValid: true };
    }

    // Calculate the correct result
    let resultNumerator: number;
    if (isAddition) {
      resultNumerator = numerator1 + numerator2;
      console.log(`🧮 Addition: ${numerator1}/${denominator1} + ${numerator2}/${denominator2} = ${resultNumerator}/${denominator1}`);
    } else {
      resultNumerator = numerator1 - numerator2;
      console.log(`🧮 Subtraction: ${numerator1}/${denominator1} - ${numerator2}/${denominator2} = ${resultNumerator}/${denominator1}`);
    }
    
    const expectedAnswer = `${resultNumerator}/${denominator1}`;
    
    console.log(`🎯 Expected answer: ${expectedAnswer}`);
    console.log(`🤖 AI provided answer: ${correctOption}`);
    
    // Check if the AI's answer matches our calculation
    if (correctOption !== expectedAnswer) {
      console.error(`❌ Math validation failed! Expected ${expectedAnswer}, got ${correctOption}`);
      
      // Find the correct index in the options
      const correctIndex = questionData.options.findIndex(opt => opt === expectedAnswer);
      if (correctIndex !== -1) {
        console.log(`🔧 Found correct answer at index ${correctIndex}`);
        return { 
          isValid: false, 
          correctedIndex: correctIndex,
          error: `Math validation failed: expected ${expectedAnswer}, got ${correctOption}`
        };
      } else {
        // Try to find equivalent fractions
        const simplified = simplifyFraction(resultNumerator, denominator1);
        const simplifiedAnswer = `${simplified.numerator}/${simplified.denominator}`;
        const simplifiedIndex = questionData.options.findIndex(opt => opt === simplifiedAnswer);
        
        if (simplifiedIndex !== -1) {
          console.log(`🔧 Found simplified correct answer: ${simplifiedAnswer} at index ${simplifiedIndex}`);
          return {
            isValid: false,
            correctedIndex: simplifiedIndex,
            error: `Math validation failed: expected ${expectedAnswer} or ${simplifiedAnswer}, got ${correctOption}`
          };
        }
        
        console.error(`❌ Could not find correct answer in options. Expected: ${expectedAnswer}`);
        return { 
          isValid: false, 
          error: `Math validation failed and couldn't find correct answer in options. Expected: ${expectedAnswer}`
        };
      }
    }

    console.log(`✅ Math validation passed!`);
    return { isValid: true };
  }

  return { isValid: true };
}

// Helper function to simplify fractions
function simplifyFraction(numerator: number, denominator: number): { numerator: number, denominator: number } {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}
