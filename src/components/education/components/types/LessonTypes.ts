
export interface LessonActivity {
  id: string;
  type: 'welcome' | 'explanation' | 'question' | 'game';
  title: string;
  duration: number;
  content: {
    message?: string;
    text?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    correct?: number; // Alternative property name used in some components
    explanation?: string;
    examples?: string[]; // For explanation activities
    story?: string; // For question activities with story context
  };
}
