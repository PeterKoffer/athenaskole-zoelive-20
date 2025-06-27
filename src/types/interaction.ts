
// src/types/interaction.ts

export interface QuestionAttemptEvent {
  questionId: string;
  kc_ids: string[];
  answerGiven: string | string[];
  isCorrect: boolean;
  timestamp: string;
}

export type InteractionEventType = 'QUESTION_ATTEMPT' | 'HINT_USAGE' | 'CONTENT_VIEW' | 'GAME_INTERACTION' | 'TUTOR_QUERY';
