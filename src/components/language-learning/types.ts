// Defines the structure for an individual language available in the Language Lab
export interface LanguageLabLanguage {
  code: string;          // e.g., "en", "es"
  name: string;          // e.g., "English", "Spanish"
  flag: string;          // e.g., "🇬🇧", "🇪🇸" (emoji)
  color: string;         // e.g., "bg-sky-500" (Tailwind CSS class)
  k12Applicability: ("elementary" | "middle" | "high")[]; // Target K-12 levels
  curriculumPath: string; // Path to the curriculum JSON file, relative to public/data/
}

// Defines the overall structure for a language curriculum
export interface LanguageLabCurriculum {
  languageCode: string;      // e.g., "en"
  languageName: string;      // e.g., "English"
  levels: CurriculumLevel[]; // Array of learning levels
}

// Defines a learning level within a curriculum
export interface CurriculumLevel {
  levelId: string;           // e.g., "en_level1"
  title: string;             // e.g., "Beginner English (A1)"
  description: string;       // Brief description of the level
  k12Grades?: number[];      // Optional specific K-12 grades this level is suitable for
  units: CurriculumUnit[];   // Array of units within this level
}

// Defines a unit within a learning level
export interface CurriculumUnit {
  unitId: string;                 // e.g., "en_l1_unit1"
  title: string;                  // e.g., "Greetings & Basics"
  lessons: CurriculumLessonLink[]; // Array of lesson links within this unit
}

// Defines a link to a specific lesson, found within a unit
export interface CurriculumLessonLink {
  lessonId: string;       // e.g., "en_l1_u1_lesson1"
  title: string;          // e.g., "Hello and Numbers"
  lessonPath: string;     // Path to the lesson JSON file, relative to public/data/
}

// Defines the structure for an individual lesson
export interface LanguageLabLesson {
  lessonId: string;
  languageCode: string;
  title: string;
  learningObjectives: string[];
  sections: LessonSection[];
}

// Defines a section within a lesson (e.g., vocabulary, grammar, exercises)
export interface LessonSection {
  type: "vocabulary" | "grammar" | "exercises" | "dialogue" | "cultureNote"; // Added more types
  title: string;
  // Depending on the type, different content fields will be populated
  items?: VocabularyItem[];      // For 'vocabulary' type
  explanation?: string;          // For 'grammar' or 'cultureNote'
  rules?: GrammarRule[];         // For 'grammar'
  questions?: ExerciseQuestion[];// For 'exercises'
  lines?: DialogueLine[];        // For 'dialogue'
}

// TODO: Consider a 'cultureNote' section type within LessonSection for cultural insights.
// interface CultureNoteSection extends LessonSectionBase { type: 'cultureNote'; content: { title: string; text: string; imageUrl?: string; }[]; }

// Defines a vocabulary item
export interface VocabularyItem {
  term: string;
  translation: string;
  audio?: string; // Path to audio file
  image?: string; // Path to image file
  exampleSentence?: string;
}

// Defines a grammar rule (can be simple or more structured)
export interface GrammarRule {
  rule: string;
  example: string;
  explanation?: string;
}

// Defines a line in a dialogue
export interface DialogueLine {
  speaker: string; // e.g., "Character A", "Narrator"
  line: string;
  translation?: string;
  audio?: string;
}

// Defines the structure for an exercise question
export interface ExerciseQuestion {
  questionId: string;
  type: "multipleChoice" | "fillInBlank" | "translate" | "matchingPairs" | "listeningComprehension" | "speakingPractice";
  prompt: string;
  textToTranslate?: string;       // For 'translate' type (source text)
  targetLanguageText?: string;  // For 'translate' type (expected answer if not open input)
  options?: string[];             // For 'multipleChoice'
  correctOptionIndex?: number;    // For 'multipleChoice'
  correctAnswers?: string[];      // For 'fillInBlank' if multiple blanks or variations
  pairs?: { term: string; definition: string }[]; // For 'matchingPairs'
  audioPrompt?: string;           // For 'listeningComprehension' or adding audio to any question
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  hint?: string;
}

// TODO: Future ExerciseQuestion types:
// type: 'speaking' (requires speech-to-text integration)
// type: 'listeningComprehension' (requires dedicated audio and comprehension questions)
// type: 'sentenceConstruction' (drag-and-drop or reordering words)
// type: 'dialogueCompletion' (fill in blanks in a conversation)

// TODO: Consider adding more structured grammar rule type, e.g.:
// interface GrammarRuleStructured { title: string; explanation: string; examples: { correct: string; incorrect?: string; note?: string }[]; }

// TODO: For Spaced Repetition System (SRS):
// Consider adding SRS metadata to VocabularyItem and possibly Lesson/Unit:
// lastReviewed?: string; // ISO date
// nextReviewDate?: string; // ISO date
// easeFactor?: number;
// intervalDays?: number;

// Props for the main LanguageLearning component
export interface LanguageLearningProps {
  initialLanguage?: string; // e.g., "en", "es" - to directly open a language
}

// Props for the ProgressHeader (example, might need adjustment)
export interface ProgressHeaderProps {
  hearts: number;
  streak: number;
  xp: number;
  languageName?: string; // Added to show current language
  onLanguageSelect: () => void; // Function to go back to language selection
}

// Props for QuestionCard (example, might need adjustment based on new ExerciseQuestion)
export interface QuestionCardProps {
  questionData: ExerciseQuestion; // Updated to use new ExerciseQuestion type
  onAnswer: (isCorrect: boolean, userAnswer?: string | number) => void;
  currentLanguage: string; // To help with TTS if needed
}

// Props for ResultCard (example)
export interface ResultCardProps {
  isCorrect: boolean;
  correctAnswer: string | undefined; // Correct answer might be a string or undefined if not applicable
  userAnswer?: string | number;
  feedback?: string;
  onNext: () => void;
}
