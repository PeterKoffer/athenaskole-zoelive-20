export interface UniverseBrief {
  title: string;
  synopsis: string;
  props: string[];
  imagePrompt: string;
  tags: string[];
  subject?: string;
  gradeLevel?: number;
}

export const UNIVERSE_BRIEF_PROMPT = `
You are designing a short, vivid, *daily-life* adventure for a middle/high school student.

Input:
- subject: {subject}
- gradeBand: {gradeBand}
- topInterests: {topInterestsCSV}

Constraints:
- Ground the story in real daily life (school, home, city, part-time jobs, clubs, sports, community events)
- Include 4–6 concrete props from that world that students interact with
- Make it relatable and practical, avoiding fantasy elements
- Keep it original and engaging
- The adventure should naturally incorporate learning opportunities

Return strict JSON:
{
  "title": "Brief, engaging title (max 6 words)",
  "synopsis": "2-3 sentence description of the daily-life setting and adventure",
  "props": ["prop1", "prop2", "prop3", "prop4"],
  "imagePrompt": "Detailed visual description for image generation - realistic, child-safe, no text in image",
  "tags": ["interest1", "interest2"]
}

Example tags to choose from: sports, cooking, music, art, technology, nature, science, history, animals, travel, gaming, health, fashion, cars, finance
Keep the adventure grounded in everyday experiences that students can relate to.
`.trim();

export function buildUniverseBriefPrompt(
  subject: string, 
  gradeBand: string, 
  topInterests: string[]
): string {
  return UNIVERSE_BRIEF_PROMPT
    .replace("{subject}", subject)
    .replace("{gradeBand}", gradeBand)
    .replace("{topInterestsCSV}", topInterests.join(", ") || "general learning");
}