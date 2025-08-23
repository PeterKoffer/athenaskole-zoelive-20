// @ts-nocheck
import { GeneratedQuestion, QuestionValidationResult } from './types.ts';

export function validateForEquivalentAnswers(questionData: GeneratedQuestion, skillArea: string): QuestionValidationResult {
  console.log(`🔍 Checking for equivalent answers in ${skillArea} question...`);
  
  // Fraction equivalence checking
  if (skillArea.includes('fraction')) {
    return validateFractionEquivalence(questionData);
  }
  
  // Decimal equivalence checking
  if (skillArea.includes('decimal')) {
    return validateDecimalEquivalence(questionData);
  }
  
  // Percentage equivalence checking
  if (skillArea.includes('percentage') || skillArea.includes('percent')) {
    return validatePercentageEquivalence(questionData);
  }
  
  return { isValid: true };
}

function validateFractionEquivalence(questionData: GeneratedQuestion): QuestionValidationResult {
  const options = questionData.options;
  const correctIndex = questionData.correct;
  
  // Parse fractions from options
  const fractionValues: number[] = [];
  const fractionStrings: string[] = [];
  
  for (const option of options) {
    const fractionMatch = option.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch) {
      const numerator = parseInt(fractionMatch[1]);
      const denominator = parseInt(fractionMatch[2]);
      if (denominator !== 0) {
        fractionValues.push(numerator / denominator);
        fractionStrings.push(option);
      } else {
        fractionValues.push(NaN);
        fractionStrings.push(option);
      }
    } else {
      // Try to parse as decimal
      const decimal = parseFloat(option);
      if (!isNaN(decimal)) {
        fractionValues.push(decimal);
        fractionStrings.push(option);
      } else {
        fractionValues.push(NaN);
        fractionStrings.push(option);
      }
    }
  }
  
  const correctValue = fractionValues[correctIndex];
  if (isNaN(correctValue)) {
    return { isValid: true }; // Can't validate, assume okay
  }
  
  // Check for equivalent values (within small tolerance for floating point)
  const tolerance = 0.0001;
  const equivalentIndices: number[] = [];
  
  for (let i = 0; i < fractionValues.length; i++) {
    if (i !== correctIndex && !isNaN(fractionValues[i])) {
      if (Math.abs(fractionValues[i] - correctValue) < tolerance) {
        equivalentIndices.push(i);
      }
    }
  }
  
  if (equivalentIndices.length > 0) {
    console.error(`❌ Equivalent fractions detected! Correct answer ${options[correctIndex]} (${correctValue}) has equivalents:`, 
      equivalentIndices.map(i => `${options[i]} (${fractionValues[i]})`));
    
    return {
      isValid: false,
      error: `Multiple equivalent answers detected: ${options[correctIndex]} and ${equivalentIndices.map(i => options[i]).join(', ')} are equivalent`
    };
  }
  
  console.log(`✅ No equivalent fractions found`);
  return { isValid: true };
}

function validateDecimalEquivalence(questionData: GeneratedQuestion): QuestionValidationResult {
  const options = questionData.options;
  const correctIndex = questionData.correct;
  
  const decimalValues = options.map(opt => parseFloat(opt)).filter(val => !isNaN(val));
  const correctValue = parseFloat(options[correctIndex]);
  
  if (isNaN(correctValue)) {
    return { isValid: true };
  }
  
  const tolerance = 0.0001;
  const equivalents = options.filter((opt, i) => 
    i !== correctIndex && Math.abs(parseFloat(opt) - correctValue) < tolerance
  );
  
  if (equivalents.length > 0) {
    return {
      isValid: false,
      error: `Equivalent decimal answers detected: ${options[correctIndex]} and ${equivalents.join(', ')}`
    };
  }
  
  return { isValid: true };
}

function validatePercentageEquivalence(questionData: GeneratedQuestion): QuestionValidationResult {
  // Similar logic for percentages, fractions, and decimals that might be equivalent
  const options = questionData.options;
  const correctIndex = questionData.correct;
  
  // Convert all options to decimal values for comparison
  const values: number[] = [];
  
  for (const option of options) {
    if (option.includes('%')) {
      const percent = parseFloat(option.replace('%', ''));
      values.push(percent / 100);
    } else if (option.includes('/')) {
      const parts = option.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        values.push(den !== 0 ? num / den : NaN);
      } else {
        values.push(NaN);
      }
    } else {
      values.push(parseFloat(option));
    }
  }
  
  const correctValue = values[correctIndex];
  if (isNaN(correctValue)) {
    return { isValid: true };
  }
  
  const tolerance = 0.0001;
  const equivalentIndices = values
    .map((val, i) => ({ val, i }))
    .filter(({ val, i }) => i !== correctIndex && Math.abs(val - correctValue) < tolerance)
    .map(({ i }) => i);
  
  if (equivalentIndices.length > 0) {
    return {
      isValid: false,
      error: `Equivalent percentage/fraction/decimal answers detected`
    };
  }
  
  return { isValid: true };
}
