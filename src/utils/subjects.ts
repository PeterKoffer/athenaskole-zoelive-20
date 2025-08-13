export const SUBJECTS_12 = [
  "Mathematics",
  "Science", 
  "English",
  "Social Studies",
  "Arts",
  "Music",
  "PE",
  "Technology",
  "Computer Science",
  "Foreign Language",
  "Civics",
  "Life Skills"
] as const;

export type Subject12 = typeof SUBJECTS_12[number];

// Map common subject names to canonical 12-subject names
export const SUBJECT_MAPPING: Record<string, string> = {
  "math": "Mathematics",
  "mathematics": "Mathematics",
  "science": "Science",
  "english": "English",
  "history": "Social Studies",
  "social studies": "Social Studies",
  "art": "Arts",
  "arts": "Arts",
  "music": "Music",
  "physical education": "PE",
  "pe": "PE",
  "phys ed": "PE",
  "technology": "Technology",
  "tech": "Technology",
  "computer science": "Computer Science",
  "cs": "Computer Science",
  "programming": "Computer Science",
  "foreign language": "Foreign Language",
  "foreign languages": "Foreign Language",
  "spanish": "Foreign Language",
  "french": "Foreign Language",
  "german": "Foreign Language",
  "civics": "Civics",
  "citizenship": "Civics",
  "life skills": "Life Skills",
  "health": "Life Skills"
};

export function normalizeSubject(subject: string): string {
  const lower = subject.toLowerCase().trim();
  return SUBJECT_MAPPING[lower] || subject;
}