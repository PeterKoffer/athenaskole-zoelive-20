
/**
 * Subject mapping utilities
 */
export const NELIE_SUBJECTS = {
  MATHEMATICS: 'Mathematics',
  ENGLISH: 'English Language Arts', 
  OTHER_LANGUAGES: 'World Languages',
  SCIENCE: 'Science',
  MENTAL_WELLNESS: 'Mental Wellness',
  COMPUTER_SCIENCE: 'Computer Science',
  CREATIVE_ARTS: 'Creative Arts',
  MUSIC: 'Music',
  HISTORY_RELIGION: 'History & Religion',
  GEOGRAPHY: 'Geography',
  BODY_LAB: 'Physical Education',
  LIFE_ESSENTIALS: 'Life Essentials'
} as const;

export type NelieSubject = typeof NELIE_SUBJECTS[keyof typeof NELIE_SUBJECTS];
