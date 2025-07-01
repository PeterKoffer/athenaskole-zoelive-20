export function createMathPrompt(kcId: string, userId: string, contentTypes: string[], maxAtoms: number): string {
  // Extract math topic from KC ID
  const kcParts = kcId.toLowerCase().split('_');
  const subject = kcParts[1] || 'math';
  const grade = kcParts[2] || 'g4';
  const gradeNumber = grade.replace('g', '');
  const topic = kcParts.slice(3).join(' ').replace(/_/g, ' ');

  let specificInstructions = "";

  if (topic.includes('equivalent_fractions')) {
    specificInstructions = `Create questions about equivalent fractions like "Which fraction is equivalent to 2/4?" with options like "1/2", "3/6", "4/8", "All of the above" (correct: All of the above)`;
  } else if (topic.includes('multiply_decimals')) {
    specificInstructions = `Create decimal multiplication questions like "What is 2.5 × 1.6?" with numerical answer choices`;
  } else if (topic.includes('area_rectangles')) {
    specificInstructions = `Create area questions like "A rectangle has length 8 units and width 5 units. What is its area?" with options like "40 square units", "13 square units", "26 square units", "35 square units"`;
  } else if (topic.includes('add_fractions')) {
    specificInstructions = `Create fraction addition questions like "What is 2/5 + 1/5?" with fraction answer options. CRITICAL: Make sure the correctAnswer index points to the mathematically correct sum.`;
  } else if (topic.includes('basic_division')) {
    specificInstructions = `Create basic division questions like "What is 24 ÷ 6?" with numerical answer choices. MAKE SURE the correctAnswer index points to the mathematically correct result.`;
  } else {
    specificInstructions = `Create grade ${gradeNumber} math questions about ${topic} with numerical problems and calculations`;
  }

  return `You are a Grade ${gradeNumber} math teacher creating educational content about ${topic}.

Generate ${maxAtoms} educational atoms with these exact types: ${contentTypes.join(', ')}.

${specificInstructions}

For TEXT_EXPLANATION atoms, explain the math concept clearly with examples.
For QUESTION_MULTIPLE_CHOICE atoms, create ACTUAL MATH PROBLEMS with numbers, not generic questions about concepts.

CRITICAL: For multiple choice questions, you MUST ensure the correctAnswer index points to the option that contains the mathematically correct answer.

Example for fraction addition: If the question is "What is 2/5 + 3/5?" and your options are ["4/5", "5/5", "1/2", "1/5"], then correctAnswer should be 1 (because "5/5" is at index 1 and 2/5 + 3/5 = 5/5).

Return JSON with this exact structure:
{
  "atoms": [
    {
      "atom_type": "TEXT_EXPLANATION",
      "content": {
        "title": "Understanding ${topic}",
        "explanation": "Clear explanation of the math concept with step-by-step process",
        "examples": ["Example: 3 × 4 = 12", "Example: Area = length × width"]
      }
    },
    {
      "atom_type": "QUESTION_MULTIPLE_CHOICE",
      "content": {
        "question": "What is 12 × 15?",
        "options": ["180", "170", "190", "200"],
        "correctAnswer": 0,
        "explanation": "12 × 15 = 180. You can solve this by multiplying 12 × 10 = 120, then 12 × 5 = 60, so 120 + 60 = 180."
      }
    }
  ]
}

DOUBLE-CHECK: Before finalizing your response, verify that the correctAnswer index matches the position of the mathematically correct answer in the options array. This is CRITICAL for the learning system to work properly.

IMPORTANT: Create real mathematical calculations, not questions about concepts. Use actual numbers and math problems appropriate for Grade ${gradeNumber}.`;
}
