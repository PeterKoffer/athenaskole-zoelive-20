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

  // Scenario-specific events
  SCENARIO_START = 'SCENARIO_START',
  SCENARIO_END = 'SCENARIO_END', // For when a scenario is completed or exited
  SCENARIO_NODE_VIEW = 'SCENARIO_NODE_VIEW',
  SCENARIO_DECISION = 'SCENARIO_DECISION',
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
  prompt_used?: string; // Added for AI-generated questions
  ai_estimated_difficulty?: number; // Added for AI-generated questions
  generated_question_text?: string; // Added for AI-generated questions (full text)
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

// Scenario-specific Event Interfaces

export interface ScenarioStartEvent extends BaseInteractionEvent {
  type: InteractionEventType.SCENARIO_START;
  scenarioId: string;
  scenarioTitle: string; // Title of the scenario for easier identification in logs
  // initialResources?: Record<string, number>; // Optional: if tracking resources
}

export interface ScenarioEndEvent extends BaseInteractionEvent {
  type: InteractionEventType.SCENARIO_END;
  scenarioId: string;
  scenarioTitle: string;
  reason: 'COMPLETED' | 'ABORTED_BY_USER' | 'FAILED_CONDITION'; // e.g., ran out of resources
  finalNodeId?: string; // The node ID where the scenario ended
  pathTaken?: string[]; // Array of node IDs visited
  // finalResources?: Record<string, number>; // Optional: final state of resources
  // performanceMetrics?: Record<string, any>; // Optional: scenario-specific KPIs
}

export interface ScenarioNodeViewEvent extends BaseInteractionEvent {
  type: InteractionEventType.SCENARIO_NODE_VIEW;
  scenarioId: string;
  nodeId: string;
  nodeTitle?: string;
  timeViewedMs?: number; // Optional: time spent on this node before making a decision or moving on
}

export interface ScenarioDecisionEvent extends BaseInteractionEvent {
  type: InteractionEventType.SCENARIO_DECISION;
  scenarioId: string;
  nodeId: string; // The node where the decision was made
  decisionText: string; // The text of the option chosen by the user
  choiceIndex?: number; // Optional: 0-based index of the choice made
  nextNodeId: string; // The node the user is transitioning to
  // resourcesAffected?: Record<string, number>; // Optional: resources changed by this decision
  // feedbackGiven?: string; // Optional: feedback shown to the user for this choice
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
  | SessionEndEvent
  | ScenarioStartEvent
  | ScenarioEndEvent
  | ScenarioNodeViewEvent
  | ScenarioDecisionEvent;

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

  // Scenario-specific helper methods
  logScenarioStart(details: Omit<ScenarioStartEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logScenarioEnd(details: Omit<ScenarioEndEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logScenarioNodeView(details: Omit<ScenarioNodeViewEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
  logScenarioDecision(details: Omit<ScenarioDecisionEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>, sourceComponentId?: string): Promise<void>;
}
