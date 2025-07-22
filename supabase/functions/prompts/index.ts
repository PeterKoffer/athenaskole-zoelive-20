export function createDailyProgramPrompt(theme: string, grade: number, learningStyle: string = 'mixed'): string {
  return `Create a daily learning universe for grade ${grade} with the theme "${theme}".
Provide a short title and description followed by 3-4 cross-subject activities.
Adapt the tone for a ${learningStyle} learner.
Return JSON with { "title": "", "description": "", "characters": [], "locations": [], "activities": [] }`;
}

export function createSubjectPrompt(subject: string, skillArea: string, grade: number, contentTypes: string[], maxAtoms: number): string {
  return `Generate ${maxAtoms} ${subject} learning atoms about ${skillArea} for Grade ${grade}.
Use types: ${contentTypes.join(', ')}.
Ensure all questions include correct answers and clear explanations.
Return JSON with { "atoms": [] }`;
}
