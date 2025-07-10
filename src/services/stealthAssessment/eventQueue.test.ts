import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventQueue } from './eventQueue';
import { mockProfileService } from '@/services/learnerProfile/MockProfileService';
import { InteractionEvent, InteractionEventType, QuestionAttemptEvent } from '@/types/stealthAssessment';
import { KCMasteryUpdateData } from '@/types/learnerProfile';
import { STEALTH_ASSESSMENT_CONFIG } from './config';

// Mock dependencies
vi.mock('@/services/learnerProfile/MockProfileService', () => ({
  mockProfileService: {
    updateKCMastery: vi.fn().mockResolvedValue(undefined),
  }
}));

// Mock SupabaseEventLogger as EventQueue instantiates it
vi.mock('./supabaseEventLogger', () => ({
  SupabaseEventLogger: vi.fn(() => ({
    flushEventBatch: vi.fn().mockResolvedValue(undefined),
    logInteractionEvent: vi.fn().mockResolvedValue(undefined),
  })),
}));


const TEST_USER_ID = 'user-event-queue-123';
const TEST_EVENT_ID = 'evt-event-queue-456';
const TEST_SESSION_ID = 'sess-event-queue-789';
const TEST_KC_ID_1 = 'kc-eq-1';
const TEST_KC_ID_2 = 'kc-eq-2';

const createMockQuestionAttemptEvent = (
  isCorrect: boolean,
  kcIds: string[] = [TEST_KC_ID_1]
): QuestionAttemptEvent => ({
  eventId: TEST_EVENT_ID,
  timestamp: Date.now(),
  userId: TEST_USER_ID,
  sessionId: TEST_SESSION_ID,
  type: InteractionEventType.QUESTION_ATTEMPT,
  eventContext: 'adaptive_practice', // Added from base type, ensure it's defined
  sourceComponentId: 'TestQuestionCard', // Added from base type
  questionId: 'q-123',
  knowledgeComponentIds: kcIds,
  answerGiven: 'A',
  isCorrect: isCorrect,
  attemptsMade: 1,
  timeTakenMs: 5000,
});

describe('EventQueue - Integration with LearnerProfile', () => {
  let eventQueue: EventQueue;

  beforeEach(() => {
    vi.clearAllMocks();
    // Disable timers for flushing during tests unless specifically testing flush
    vi.useFakeTimers();
    eventQueue = new EventQueue();
    // Clear any events that might have been added by constructor's startFlushTimer if it ran early
    eventQueue.clearEvents(); // Assuming clearEvents empties the internal queue
    (mockProfileService.updateKCMastery as vi.Mock).mockClear(); // Clear calls to this mock
  });

  afterEach(() => {
    eventQueue.destroy(); // Clean up interval from EventQueue
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should call mockProfileService.updateKCMastery for each KC on QUESTION_ATTEMPT event', async () => {
    const event = createMockQuestionAttemptEvent(true, [TEST_KC_ID_1, TEST_KC_ID_2]);
    await eventQueue.addEvent(event);

    expect(mockProfileService.updateKCMastery).toHaveBeenCalledTimes(2);

    const expectedUpdateData1: KCMasteryUpdateData = {
      success: true,
      attemptsInInteraction: 1,
      timeTakenMs: 5000,
      hintsUsed: 0, // Default from current EventQueue logic
      timestamp: new Date(event.timestamp).toISOString(),
      eventType: InteractionEventType.QUESTION_ATTEMPT,
      details: { questionId: 'q-123', answerGiven: 'A' }
    };
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(TEST_USER_ID, TEST_KC_ID_1, expect.objectContaining(expectedUpdateData1));
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(TEST_USER_ID, TEST_KC_ID_2, expect.objectContaining(expectedUpdateData1));
  });

  it('should NOT call updateKCMastery for non-QUESTION_ATTEMPT events', async () => {
    const event: InteractionEvent = {
      eventId: 'evt-other',
      timestamp: Date.now(),
      userId: TEST_USER_ID,
      type: InteractionEventType.CONTENT_VIEW, // Different type
      eventContext: 'content_exploration',
      sourceComponentId: 'TestViewer',
      contentAtomId: 'atom-x',
      knowledgeComponentIds: [TEST_KC_ID_1],
      contentType: 'video'
    };
    await eventQueue.addEvent(event);
    expect(mockProfileService.updateKCMastery).not.toHaveBeenCalled();
  });

  it('should NOT call updateKCMastery if QUESTION_ATTEMPT event has no kcIds', async () => {
    const event = createMockQuestionAttemptEvent(true, []); // Empty kcIds
    await eventQueue.addEvent(event);
    expect(mockProfileService.updateKCMastery).not.toHaveBeenCalled();
  });

  it('should handle errors from updateKCMastery gracefully', async () => {
    (mockProfileService.updateKCMastery as vi.Mock).mockRejectedValueOnce(new Error('Profile update failed'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const event = createMockQuestionAttemptEvent(true, [TEST_KC_ID_1]);
    await eventQueue.addEvent(event);

    expect(mockProfileService.updateKCMastery).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `EventQueue: Error updating KC mastery for KC ${TEST_KC_ID_1}, User ${TEST_USER_ID}:`,
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  it('should pass correct success status to updateKCMastery', async () => {
    const eventSuccess = createMockQuestionAttemptEvent(true, [TEST_KC_ID_1]);
    const eventFailure = createMockQuestionAttemptEvent(false, [TEST_KC_ID_2]);

    await eventQueue.addEvent(eventSuccess);
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_KC_ID_1,
      expect.objectContaining({ success: true })
    );
    (mockProfileService.updateKCMastery as vi.Mock).mockClear(); // Clear for next assertion

    await eventQueue.addEvent(eventFailure);
    expect(mockProfileService.updateKCMastery).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_KC_ID_2,
      expect.objectContaining({ success: false })
    );
  });
});
