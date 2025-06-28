
import { QuestionGenerationRequest } from './types.ts';

export function generatePrompts(request: QuestionGenerationRequest): { systemPrompt: string; userPrompt: string } {
  const { subject, skillArea, difficultyLevel, promptVariation = 'basic' } = request;
  
  let systemPrompt = '';
  let userPrompt = '';

  if (skillArea.includes('fraction') && skillArea.includes('like denominators')) {
    if (skillArea.includes('addition')) {
      systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} fraction addition problems. Create problems that are age-appropriate and educationally sound.`;
      
      if (promptVariation === 'word_problem') {
        userPrompt = `Create a word problem about adding fractions with like denominators. Include a real-world scenario that ${difficultyLevel}th graders can relate to (like pizza slices, cake pieces, or toy collections). The fractions should have the same denominator and the sum should be less than 1.`;
      } else if (promptVariation === 'mixed') {
        userPrompt = `Create a mixed fraction addition problem with like denominators. Include both a direct math problem and a brief word context.`;
      } else {
        userPrompt = `Create a fraction addition problem with like denominators. Use fractions where both have the same denominator (like 6, 8, 10, or 12) and the sum is less than 1.`;
      }
    } else if (skillArea.includes('subtraction')) {
      systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} fraction subtraction problems. Create problems that are age-appropriate and educationally sound.`;
      
      if (promptVariation === 'word_problem') {
        userPrompt = `Create a word problem about subtracting fractions with like denominators. Include a real-world scenario that ${difficultyLevel}th graders can relate to. The first fraction should be larger than the second.`;
      } else {
        userPrompt = `Create a fraction subtraction problem with like denominators. Use fractions where both have the same denominator and the first fraction is larger than the second.`;
      }
    }
  } else if (skillArea.includes('decimal multiplication')) {
    systemPrompt = `You are an expert math teacher creating Grade ${difficultyLevel} decimal multiplication problems.`;
    userPrompt = `Create a decimal multiplication problem appropriate for Grade ${difficultyLevel}. Use decimals with 1-2 decimal places each.`;
  } else {
    // Generic math problem
    systemPrompt = `You are an expert teacher creating Grade ${difficultyLevel} ${subject} problems for ${skillArea}.`;
    userPrompt = `Create an educational ${subject} problem about ${skillArea} appropriate for Grade ${difficultyLevel} students.`;
  }

  const fullPrompt = `${userPrompt}

CRITICAL INSTRUCTIONS: 
1. Calculate the correct answer step by step before creating options
2. Make sure the "correct" field matches the index of the mathematically correct answer
3. Double-check your math before finalizing

Return ONLY a valid JSON object with this exact structure:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation of why the answer is correct"
}

Requirements:
- The "correct" field should be the index (0-3) of the correct answer
- Make exactly 4 multiple choice options
- Ensure the correct answer is actually correct mathematically
- Make wrong answers plausible but clearly incorrect
- Use age-appropriate language for Grade ${difficultyLevel}
- Include step-by-step explanation
- VERIFY: The option at index "correct" must be the mathematically correct answer`;

  return { systemPrompt, userPrompt: fullPrompt };
}
