
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
