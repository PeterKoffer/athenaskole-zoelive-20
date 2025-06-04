import { generateContentWithOpenAI } from './contentGenerator.ts';

// Re-export for backward compatibility
export { generateContentWithOpenAI };

// Keep the old function exports for any existing imports
export { callOpenAI } from './apiClient.ts';
export { createGradeAlignedPrompt } from './promptBuilder.ts';
