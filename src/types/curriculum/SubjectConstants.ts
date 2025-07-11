
export const NELIE_SUBJECTS = {
  MATHEMATICS: 'Mathematics',
  ENGLISH_LANGUAGE_ARTS: 'English Language Arts',
  SCIENCE: 'Science',
  SOCIAL_STUDIES: 'Social Studies',
  PHYSICAL_EDUCATION: 'Physical Education',
  ART: 'Art',
  MUSIC: 'Music',
  WORLD_LANGUAGES: 'World Languages',
  COMPUTER_SCIENCE: 'Computer Science',
  HEALTH: 'Health'
} as const;

export type NelieSubject = typeof NELIE_SUBJECTS[keyof typeof NELIE_SUBJECTS];
