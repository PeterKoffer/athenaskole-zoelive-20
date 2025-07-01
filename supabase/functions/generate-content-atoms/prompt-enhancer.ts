
// Enhanced Prompt Generation and Creativity Boosters

import { createMathPrompt } from './prompt_generator.ts';

export function createEnhancedPrompt(
  kcId: string,
  userId: string,
  contentTypes: string[],
  maxAtoms: number,
  providerName: string,
  attemptNumber: number
): string {
  const diversityPrompts = [
    "Create completely unique questions with fresh scenarios and different numbers",
    "Use creative real-world applications and engaging story contexts",
    "Design innovative problem-solving approaches with varied difficulty",
    "Generate original mathematical scenarios with practical applications",
    "Create engaging word problems with diverse characters and situations"
  ];
  
  const randomDiversityPrompt = diversityPrompts[Math.floor(Math.random() * diversityPrompts.length)];
  const basePrompt = createMathPrompt(kcId, userId, contentTypes, maxAtoms);
  
  return `${basePrompt}

CREATIVITY ENHANCEMENT (Attempt #${attemptNumber}):
${randomDiversityPrompt}

UNIQUENESS REQUIREMENTS:
- Use completely different numbers and scenarios from typical examples
- Create original word problems with unique contexts
- Vary mathematical operations and problem presentation
- Make content engaging and age-appropriate
- Ensure educational value while being creative

GENERATION CONTEXT:
- Provider: ${providerName}
- Attempt: ${attemptNumber}
- Session: ${Date.now()}
- Randomization: ${Math.random().toString(36).substring(7)}

Generate HIGH-QUALITY, CREATIVE, and EDUCATIONALLY VALUABLE content!`;
}
