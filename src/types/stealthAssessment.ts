// src/types/stealthAssessment.ts

/**
 * Defines the types of interaction events that can be logged.
 */
export enum InteractionEventType {
  QUESTION_ATTEMPT = 'QUESTION_ATTEMPT',
  HINT_USAGE = 'HINT_USAGE',
  GAME_INTERACTION = 'GAME_INTERACTION',
  TUTOR_QUERY = 'TUTOR_QUERY',
  CONTENT_VIEW = 'CONTENT_VIEW', // e.g., viewing an explanation atom
  TOOL_USAGE = 'TOOL_USAGE', // e.g., using a virtual whiteboard tool
  REVISION = 'REVISION', // e.g., student changes a previous answer
  PAUSE_RESUME = 'PAUSE_RESUME', // e.g., student pauses activity
  NAVIGATION = 'NAVIGATION', // e.g., student navigates between sections
  SESSION_START = 'SESSION_START',
  SESSION_END = 'SESSION_END',
}

/**
 * Base interface for all interaction events.
 */
export interface BaseInteractionEvent {
  eventId: string; // Unique ID for this specific event instance
  timestamp: number; // Unix timestamp (milliseconds)
  userId: string; // ID of the user performing the interaction
  sessionId?: string; // ID of the current learning session
  sourceComponentId?: string; // Identifier for the UI component originating the event (e.g., 'QuestionCard_123')
}

/**
 * Specific event payloads, extending the base event.
 */

export interface QuestionAttemptEvent extends BaseInteractionEvent {
  type: InteractionEventType.QUESTION_ATTEMPT;
  questionId: string;
  knowledgeComponentIds: string[]; // KCs associated with the question
  answerGiven: any; // Could be string, number, object depending on question type
  isCorrect: boolean;
  attemptsMade: number; // How many times this specific question has been attempted in this instance
  timeTakenMs?: number; // Time spent on this attempt
}

export interface HintUsageEvent extends BaseInteractionEvent {
  type: InteractionEventType.HINT_USAGE;
  questionId?: string; // Optional, if hint is tied to a specific question
  knowledgeComponentIds?: string[]; // KCs the hint relates to
  hintId: string;
  hintLevel?: number; // e.g., 1st hint, 2nd hint
}

export interface GameInteractionEvent extends BaseInteractionEvent {
  type: InteractionEventType.GAME_INTERACTION;
  gameId: string;
  knowledgeComponentIds?: string[];
  interactionType: string; // e.g., 'DRAG_DROP', 'LEVEL_COMPLETE', 'ITEM_COLLECTED'
  interactionValue?: any; // Specific data about the interaction
  scoreChange?: number;
  timeTakenMs?: number;
}

export interface TutorQueryEvent extends BaseInteractionEvent {
  type: InteractionEventType.TUTOR_QUERY;
  queryText: string;
  context?: any; // e.g., current lesson, current KC
  responseId?: string; // ID of NELIE's response
}

export interface ContentViewEvent extends BaseInteractionEvent {
  type: InteractionEventType.CONTENT_VIEW;
  contentAtomId: string;
  knowledgeComponentIds: string[];
  contentType: string; // e.g., 'EXPLANATION', 'EXAMPLE', 'VIDEO'
  timeViewedMs?: number;
}

export interface ToolUsageEvent extends BaseInteractionEvent {
  type: InteractionEventType.TOOL_USAGE;
  toolName: string; // e.g., 'virtual_whiteboard_pen', 'calculator'
  toolAction: string; // e.g., 'DRAW_LINE', 'CALCULATE_SUM'
  actionDetails?: any;
}

export interface RevisionEvent extends BaseInteractionEvent {
  type: InteractionEventType.REVISION;
  originalEventId?: string; // ID of the event being revised (e.g., a previous QuestionAttemptEvent)
  originalAnswer?: any;
  revisedAnswer: any;
  questionId?: string;
}

export interface PauseResumeEvent extends BaseInteractionEvent {
  type: InteractionEventType.PAUSE_RESUME;
  action: 'PAUSE' | 'RESUME';
  activityId?: string; // ID of the activity being paused/resumed
}

export interface NavigationEvent extends BaseInteractionEvent {
  type: InteractionEventType.NAVIGATION;
  fromPath?: string;
  toPath: string;
  navigationType: 'INTERNAL_LINK' | 'MENU_CLICK' | 'BROWSER_HISTORY';
}

export interface SessionStartEvent extends BaseInteractionEvent {
  type: InteractionEventType.SESSION_START;
  learningGoals?: string[]; // Optional learning goals for the session
}

export interface SessionEndEvent extends BaseInteractionEvent {
  type: InteractionEventType.SESSION_END;
  reason?: 'USER_INITIATED' | 'TIMEOUT' | 'COMPLETION';
  metrics?: Record<string, any>; // Summary metrics for the session
}


/**
 * A union type for all possible interaction events.
 */
export type InteractionEvent =
  | QuestionAttemptEvent
  | HintUsageEvent
  | GameInteractionEvent
  | TutorQueryEvent
  | ContentViewEvent
  | ToolUsageEvent
  | RevisionEvent
  | PauseResumeEvent
  | NavigationEvent
  | SessionStartEvent
  | SessionEndEvent;

/**
 * Interface for the service that handles logging of interaction events.
 */
export interface IStealthAssessmentService {
  logEvent(eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;


  // Specific helper methods for common event types for convenience
  logQuestionAttempt(details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logHintUsage(details: Omit<HintUsageEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logGameInteraction(details: Omit<GameInteractionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logTutorQuery(details: Omit<TutorQueryEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logContentView(details: Omit<ContentViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  // ... other helper methods can be added

  // Methods for debugging/testing the in-memory queue aspect
  getInMemoryEvents(): Promise<InteractionEvent[]>;
  clearInMemoryEvents(): Promise<void>;
}

/**
 * Context types for different interaction scenarios
 */
export type InteractionEventContext = 
  | 'adaptive_practice'
  | 'assessment'
  | 'tutorial'
  | 'free_play'
  | 'guided_practice'
  | 'review';
