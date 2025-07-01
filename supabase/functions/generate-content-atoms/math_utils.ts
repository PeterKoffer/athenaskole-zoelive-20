// deno-lint-ignore-file no-explicit-any
// Helper function to find greatest common divisor (GCD)
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Helper function to simplify a fraction string "num/den"
export function simplifyFractionStr(fractionStr: string): string {
  const parts = fractionStr.split('/');
  if (parts.length !== 2) return fractionStr; // Not a simple fraction
  let num = parseInt(parts[0]);
  let den = parseInt(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return fractionStr;

  if (num === 0) return "0";

  const common = gcd(Math.abs(num), Math.abs(den));
  num /= common;
  den /= common;

  if (den < 0) { // Ensure denominator is positive
      num = -num;
      den = -den;
  }

  return den === 1 ? `${num}` : `${num}/${den}`;
}

// Helper function to parse a string that might be a fraction or a number
export function parseNumericString(s: string): number | { num: number, den: number } {
  s = s.trim();
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return { num, den };
      }
    }
  }
  const val = parseFloat(s);
  return isNaN(val) ? NaN : val;
}

// Helper function to compare two numeric values (could be fractions or numbers)
// Tolerates small differences for floating point comparisons.
export function areNumericallyEquivalent(val1: any, val2: any, tolerance = 1e-9): boolean {
  const num1 = typeof val1 === 'object' && val1 !== null && val1.den !== undefined ? val1.num / val1.den : parseFloat(val1);
  const num2 = typeof val2 === 'object' && val2 !== null && val2.den !== undefined ? val2.num / val2.den : parseFloat(val2);

  if (isNaN(num1) || isNaN(num2)) return false;
  return Math.abs(num1 - num2) < tolerance;
}

export function validateMathAnswer(question: string, options: string[], correctAnswerIndex: number): number {
  console.log(`🔍 Validating math answer for: "${question}"`);
  console.log(`📝 Options:`, options);
  console.log(`🎯 Original correctAnswer index:`, correctAnswerIndex);

  let calculatedCorrectValue: number | { num: number, den: number } | null = null;

  // Handle fraction addition: "a/b + c/d"
  const fractionAddMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)/);
  if (fractionAddMatch) {
    const [, n1, d1, n2, d2] = fractionAddMatch.map(Number);
    if (d1 !== 0 && d2 !== 0) {
      const num = n1 * d2 + n2 * d1;
      const den = d1 * d2;
      calculatedCorrectValue = { num, den };
      console.log(`🧮 Calculated fraction addition: ${num}/${den} from question: "${question}"`);
    }
  }

  // Handle fraction subtraction: "a/b - c/d"
  if (!calculatedCorrectValue) {
    const fractionSubMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionSubMatch) {
      const [, n1, d1, n2, d2] = fractionSubMatch.map(Number);
      if (d1 !== 0 && d2 !== 0) {
        const num = n1 * d2 - n2 * d1;
        const den = d1 * d2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction subtraction: ${num}/${den} from question: "${question}"`);
      }
    }
  }

  // Handle fraction multiplication: "a/b * c/d" or "a/b x c/d"
  if (!calculatedCorrectValue) {
    const fractionMultMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*[×*]\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionMultMatch) {
      const [, n1, d1, n2, d2] = fractionMultMatch.map(Number);
      if (d1 !== 0 && d2 !== 0) {
        const num = n1 * n2;
        const den = d1 * d2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction multiplication: ${num}/${den} from question: "${question}"`);
      }
    }
  }

  // Handle fraction division: "a/b ÷ c/d" or "a/b / c/d" (ensure not to conflict with date-like strings if relevant)
  if (!calculatedCorrectValue) {
    // More specific regex for fraction division to avoid general slash use
    const fractionDivMatch = question.match(/(\d+)\s*\/\s*(\d+)\s*(?:÷|\/)\s*(\d+)\s*\/\s*(\d+)/);
    if (fractionDivMatch) {
      const [, n1, d1, n2, d2] = fractionDivMatch.map(Number);
      if (d1 !== 0 && d2 !== 0 && n2 !== 0) { // Denominators and numerator of divisor cannot be zero
        const num = n1 * d2;
        const den = d1 * n2;
        calculatedCorrectValue = { num, den };
        console.log(`🧮 Calculated fraction division: ${num}/${den} from question: "${question}"`);
      } else if (n2 === 0) {
        console.warn(`Division by zero fraction detected in question: "${question}"`);
      }
    }
  }

  // Handle basic multiplication of numbers (integers or decimals): "N1 x N2" or "N1 * N2"
  // Uses a more general regex for numbers, including potential negative signs.
  if (!calculatedCorrectValue) {
    const multMatch = question.match(/(-?\d+(?:\.\d+)?)\s*[×*]\s*(-?\d+(?:\.\d+)?)/);
    if (multMatch) {
      const [, num1Str, num2Str] = multMatch;
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);
      if (!isNaN(num1) && !isNaN(num2)) {
        calculatedCorrectValue = num1 * num2;
        console.log(`🧮 Calculated multiplication: ${calculatedCorrectValue} from question: "${question}"`);
      }
    }
  }

  // Handle basic division of numbers (integers or decimals): "N1 ÷ N2" or "N1 / N2"
  // Avoid matching fractions here by checking for prior fraction operation matches.
  // Uses a more general regex for numbers, including potential negative signs.
  const fractionMatched = fractionAddMatch || fractionSubMatch || fractionMultMatch || fractionDivMatch;
  if (!calculatedCorrectValue && (question.includes('÷') || (question.includes('/') && !fractionMatched))) {
    const divMatch = question.match(/(-?\d+(?:\.\d+)?)\s*[÷/]\s*(-?\d+(?:\.\d+)?)/);
    if (divMatch) {
      const [, num1Str, num2Str] = divMatch;
      const num1 = parseFloat(num1Str);
      const num2 = parseFloat(num2Str);
      if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
        calculatedCorrectValue = num1 / num2;
        console.log(`🧮 Calculated division: ${calculatedCorrectValue} from question: "${question}"`);
      } else if (num2 === 0) {
        console.warn(`Division by zero detected in question: "${question}"`);
      }
    }
  }

  if (calculatedCorrectValue !== null) {
    let correctValueStr = "";
    if (typeof calculatedCorrectValue === 'object' && calculatedCorrectValue.num !== undefined) {
      // It's a fraction object {num, den}
      correctValueStr = simplifyFractionStr(`${calculatedCorrectValue.num}/${calculatedCorrectValue.den}`);
      console.log(`Simplified correct fraction: ${correctValueStr}`);
    } else {
      // It's a number (potentially a float from multiplication/division)
      correctValueStr = calculatedCorrectValue.toString();
      console.log(`Calculated correct number: ${correctValueStr}`);
    }

    for (let i = 0; i < options.length; i++) {
      const optionVal = parseNumericString(options[i]);
      const calculatedValToCompare = parseNumericString(correctValueStr); // re-parse in case it was simplified to "0" etc.

      if (areNumericallyEquivalent(optionVal, calculatedValToCompare)) {
        console.log(`✅ Found numerically equivalent answer "${options[i]}" (parsed: ${JSON.stringify(optionVal)}) at index ${i}. Original index: ${correctAnswerIndex}.`);
        return i;
      }
    }
    console.log(`⚠️ Calculated correct value "${correctValueStr}" not found in options:`, options);
  } else {
    console.log(`ℹ️ No specific math operation matched for validation logic for question: "${question}"`);
  }

  console.log(`⚠️ Defaulting to original AI-provided index: ${correctAnswerIndex} for question "${question}"`);
  return correctAnswerIndex;
// Math Answer Validation and Calculation Utilities

export function validateMathAnswer(question: string, options: string[], suggestedCorrectAnswer: number): number {
  console.log(`🔍 Validating math question: "${question}"`);
  console.log(`📋 Options:`, options);
  console.log(`🎯 Suggested answer index: ${suggestedCorrectAnswer}`);
  
  // Extract numbers and operation from the question
  const numberMatches = question.match(/(\d+\.?\d*)/g);
  
  if (!numberMatches || numberMatches.length < 2) {
    console.log('❌ Could not extract enough numbers from question');
    return suggestedCorrectAnswer;
  }
  
  const numbers = numberMatches.map(n => parseFloat(n));
  console.log(`🔢 Extracted numbers:`, numbers);
  
  let correctValue = null;
  
  // Determine operation and calculate
  if (question.includes('×') || question.includes('multiply') || question.includes('times')) {
    correctValue = numbers[0] * numbers[1];
    console.log(`✖️ Multiplication: ${numbers[0]} × ${numbers[1]} = ${correctValue}`);
  } else if (question.includes('÷') || question.includes('divide') || question.includes('/')) {
    correctValue = numbers[0] / numbers[1];
    console.log(`➗ Division: ${numbers[0]} ÷ ${numbers[1]} = ${correctValue}`);
  } else if (question.includes('+') || question.includes('add') || question.includes('plus')) {
    correctValue = numbers[0] + numbers[1];
    console.log(`➕ Addition: ${numbers[0]} + ${numbers[1]} = ${correctValue}`);
  } else if (question.includes('-') || question.includes('subtract') || question.includes('minus')) {
    correctValue = numbers[0] - numbers[1];
    console.log(`➖ Subtraction: ${numbers[0]} - ${numbers[1]} = ${correctValue}`);
  }
  
  if (correctValue === null) {
    console.log('❓ Could not determine operation type');
    return suggestedCorrectAnswer;
  }
  
  // Find the option that matches the correct value
  for (let i = 0; i < options.length; i++) {
    const optionNumbers = options[i].match(/(\d+\.?\d*)/g);
    if (optionNumbers) {
      const optionValue = parseFloat(optionNumbers[0]);
      if (Math.abs(optionValue - correctValue) < 0.01) { // Allow for small floating point differences
        console.log(`✅ Found correct answer at index ${i}: ${options[i]}`);
        return i;
      }
    }
  }
  
  console.log(`⚠️ Correct value ${correctValue} not found in options, keeping suggested answer`);
  return suggestedCorrectAnswer;
}
