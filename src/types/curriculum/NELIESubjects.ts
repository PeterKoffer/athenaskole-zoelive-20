/**
 * Enum representing the 12 core subjects for NELIE.
 */
export enum NELIESubject {
  MATH = "Math",
  ENGLISH = "English", // Primary language arts for English-speaking contexts
  OTHER_LANGUAGES = "Other Languages", // For foreign language learning, or primary language arts in non-English contexts
  SCIENCE = "Science",
  MENTAL_WELLNESS = "Mental Wellness",
  COMPUTER_SCIENCE = "Computer Science",
  CREATIVE_ARTS = "Creative Arts",
  MUSIC = "Music",
  HISTORY_RELIGION = "History & Religion",
  GEOGRAPHY = "Geography",
  BODY_LAB = "Body Lab (Physical Education)",
  LIFE_ESSENTIALS = "Life Essentials",
}

/**
 * Helper type for subject names if needed.
 */
export type NELIESubjectType = keyof typeof NELIESubject;
