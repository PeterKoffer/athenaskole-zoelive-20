
export interface Language {
  code: string;
  name: string;
  flag: string;
  color: string;
}

export interface Question {
  type: "translate" | "multiple" | "fill";
  question: string;
  options: string[];
  correct: number;
  audio?: string;
}

export interface Lesson {
  title: string;
  questions: Question[];
}

export interface LanguageLessons {
  [key: string]: Lesson[];
}

export interface LanguageLearningProps {
  initialLanguage?: string;
}
