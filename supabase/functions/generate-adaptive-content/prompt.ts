
export function createPrompt(previousQuestions: string[]): string {
  let prompt = `Generate a math question about fractions suitable for elementary students.

Return ONLY a valid JSON object with this exact structure:
{
  "question": "What is 1/2 + 1/4?",
  "options": ["1/6", "2/6", "3/4", "3/6"],
  "correct": 2,
  "explanation": "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
  "learningObjectives": ["Adding fractions with different denominators", "Finding common denominators"]
}

Make sure:
- The question is about fractions (adding, subtracting, multiplying, or dividing)
- There are exactly 4 options
- The "correct" field is the index (0, 1, 2, or 3) of the correct answer
- The explanation clearly shows how to solve the problem
- Return ONLY the JSON, no markdown formatting or code blocks`;

  if (previousQuestions.length > 0) {
    prompt += `\n\nIMPORTANT: Do NOT generate any of these previous questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Create a completely different fraction problem that hasn't been asked before.`;
  }

  return prompt;
}
