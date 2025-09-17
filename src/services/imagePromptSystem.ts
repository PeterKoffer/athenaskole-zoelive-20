// ====== SINGLE IMAGE PROMPT SYSTEM - NO OTHER PROMPTS ALLOWED ======
// All image generation MUST go through the image-ensure edge function
// This file exists only for backward compatibility and forwards to the edge function

export function buildAdventureImagePrompt(title: string, gradeLevel?: number): string {
  // This function is deprecated - all prompts now handled by image-ensure edge function
  return title; // Just return title, the edge function handles the actual prompt
}

export function buildCoverImagePrompt(universeId: string): string {
  // This function is deprecated - all prompts now handled by image-ensure edge function
  return universeId; // Just return ID, the edge function handles the actual prompt
}