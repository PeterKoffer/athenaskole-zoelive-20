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
  languageName?: string;
}

// Defines a section within a lesson (e.g., vocabulary, grammar, exercises)
export interface LessonSection {
  type: "vocabulary" | "grammar" | "exercises" | "dialogue" | "cultureNote";
  title: string;
  items?: VocabularyItem[];
  explanation?: string;
  rules?: GrammarRule[];
  questions?: ExerciseQuestion[];
  lines?: DialogueLine[];
}

// Defines a vocabulary item
export interface VocabularyItem {
  term: string;
  translation: string;
  audio?: string;
  image?: string;
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
  speaker: string;
  line: string;
  translation?: string;
  audio?: string;
}

// Defines the structure for an exercise question
export interface ExerciseQuestion {
  questionId: string;
  type: "multipleChoice" | "fillInBlank" | "translate" | "matchingPairs" | "listeningComprehension" | "speakingPractice";
  prompt: string;
  textToTranslate?: string;
  targetLanguageText?: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswers?: string[];
  pairs?: { term: string; definition: string }[];
  audioPrompt?: string;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  hint?: string;
}

// Legacy types for compatibility
export interface Lesson {
  title: string;
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correct: number;
  audio?: string;
}

// Props for the main LanguageLearning component
export interface LanguageLearningProps {
  initialLanguage?: string; // e.g., "en", "es" - to directly open a language
}

// Props for the ProgressHeader (example, might need adjustment)
export interface ProgressHeaderProps {
  hearts: number;
  xp: number;
  currentLesson: Lesson;
  currentQuestion: number;
  onBack: () => void;
  languageName?: string; // Added to show current language
  onLanguageSelect: () => void; // Function to go back to language selection
}

// Props for QuestionCard (example, might need adjustment based on new ExerciseQuestion)
export interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  selectedLanguage: string;
  onAnswerSelect: (answerIndex: number) => void;
  onCheckAnswer: () => void;
  questionData?: ExerciseQuestion;
  onAnswer?: (isCorrect: boolean, userAnswer?: string | number) => void;
  currentLanguage?: string;
}

// Props for ResultCard (example)
export interface ResultCardProps {
  isCorrect: boolean;
  correctAnswer?: string; // Correct answer might be a string or undefined if not applicable
  userAnswer?: string | number;
  feedback?: string;
  onNext: () => void;
}
