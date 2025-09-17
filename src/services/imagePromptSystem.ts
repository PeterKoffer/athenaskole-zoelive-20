// ONE CENTRALIZED IMAGE PROMPT SYSTEM
export function buildAdventureImagePrompt(title: string, gradeLevel?: number): string {
  return `Professional modern environment for "${title}" adventure. Cinematic lighting, realistic props, inspiring atmosphere, no text overlay, no classroom elements.`;
}

export function buildCoverImagePrompt(universeId: string): string {
  return `Professional environment cover image for adventure "${universeId}". Modern workspace, cinematic lighting, realistic props, inspiring mood, no classroom setting.`;
}