import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// Import types, but not the service instance directly at the top level
import type ActualStealthAssessmentService from './StealthAssessmentService';
import type { EventQueue as EventQueueType } from './eventQueue';
import type { SupabaseEventLogger as SupabaseEventLoggerType } from './supabaseEventLogger';
import * as eventMetadataGenerator from './eventMetadataGenerator';
import * as userUtils from './userUtils';
import { InteractionEvent, InteractionEventType, QuestionAttemptEvent } from '@/types/stealthAssessment';

// Declare variables to hold our mock instances
let mockEventQueueInstance: vi.Mocked<EventQueueType>;
let mockSupabaseLoggerInstance: vi.Mocked<SupabaseEventLoggerType>;

// Mock the modules. The factory function will be called when these modules are imported.
vi.mock('./eventQueue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./eventQueue')>();
  mockEventQueueInstance = {
    // Provide all methods expected by StealthAssessmentService from EventQueue
    addEvent: vi.fn(),
    flush: vi.fn(),
    getQueueSize: vi.fn().mockReturnValue(0),
    destroy: vi.fn(),
    getEvents: vi.fn().mockReturnValue([]), // Added for testing
    clearEvents: vi.fn(),                 // Added for testing
  } as vi.Mocked<EventQueueType>;
  return {
    ...actual,
    EventQueue: vi.fn(() => mockEventQueueInstance),
  };
});

vi.mock('./supabaseEventLogger', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./supabaseEventLogger')>();
  mockSupabaseLoggerInstance = {
    // Provide all methods expected by StealthAssessmentService from SupabaseEventLogger
    logInteractionEvent: vi.fn(),
    flushEventBatch: vi.fn(),
  } as vi.Mocked<SupabaseEventLoggerType>;
  return {
    ...actual,
    SupabaseEventLogger: vi.fn(() => mockSupabaseLoggerInstance),
  };
});

vi.mock('./eventMetadataGenerator');
vi.mock('./userUtils');

describe('StealthAssessmentService', () => {
  let serviceInstance: typeof ActualStealthAssessmentService;

  beforeEach(async () => {
    // Reset modules to ensure StealthAssessmentService gets fresh mocks when imported
    vi.resetModules();

    // Re-apply mocks for helper functions as resetModules clears them
    vi.mock('./eventMetadataGenerator');
    vi.mock('./userUtils');
    (userUtils.getCurrentUserId as vi.Mock).mockResolvedValue('test-user-id');
    (eventMetadataGenerator.createFullEvent as vi.Mock).mockImplementation(
      async (eventData: any, userId: string, sourceComponentId?: string) => ({
        ...eventData,
        eventId: 'mock-event-id',
        timestamp: Date.now(),
        userId: userId,
        sessionId: 'mock-session-id',
        sourceComponentId: sourceComponentId || 'unknown-source',
      } as InteractionEvent)
    );

    // Clear calls on our manually created mock instances
    // (mockEventQueueInstance and mockSupabaseLoggerInstance are re-created by the vi.mock factory above for each module load cycle)
    // So, we need to ensure our test-scoped variables point to the ones created by the LATEST mock execution
    // This is handled because the factories for vi.mock assign to the higher-scoped variables.
    // We just need to clear any prior interactions on these specific instances if they persisted across resetModules (they shouldn't for method spies).
    // Or better, ensure they are fresh for each describe block or re-assigned if needed.
    // The current setup with vi.mock factory assigning to higher scope variable should be fine.
    // Let's clear mocks on the instances to be safe for each test run.
    if (mockEventQueueInstance) {
        Object.values(mockEventQueueInstance).forEach(mockFn => {
            if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
                (mockFn as vi.Mock).mockClear();
            }
        });
        // Reset return values if necessary
        mockEventQueueInstance.getEvents.mockReturnValue([]);
        mockEventQueueInstance.getQueueSize.mockReturnValue(0);

    }
    if (mockSupabaseLoggerInstance) {
      Object.values(mockSupabaseLoggerInstance).forEach(mockFn => {
            if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
                (mockFn as vi.Mock).mockClear();
            }
        });
    }


    // Dynamically import the service to get the instance created with the mocks
    serviceInstance = (await import('./StealthAssessmentService')).default;
  });

  afterEach(() => {
    if (serviceInstance && typeof serviceInstance.destroy === 'function') {
      serviceInstance.destroy();
    }
    vi.clearAllMocks(); // General cleanup
  });

  describe('logEvent', () => {
    it('should get user ID, create full event, and add to event queue', async () => {
      const eventData = { type: InteractionEventType.CONTENT_VIEW, payload: {contentAtomId: 'atom1', knowledgeComponentIds: ['kc1'], contentType: 'text'} } as Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId' | 'eventContext'> & {type: InteractionEventType.CONTENT_VIEW, payload: any}; // Adjusted type for eventData
      await serviceInstance.logEvent(eventData, 'TestComponent');

      expect(userUtils.getCurrentUserId).toHaveBeenCalled();
      expect(eventMetadataGenerator.createFullEvent).toHaveBeenCalledWith(eventData, 'test-user-id', 'TestComponent');
      expect(mockEventQueueInstance.addEvent).toHaveBeenCalledWith(expect.objectContaining({
        type: InteractionEventType.CONTENT_VIEW,
        userId: 'test-user-id',
        eventId: 'mock-event-id',
      }));
    });

    it('should log a warning and not add to queue if no user ID is found', async () => {
      (userUtils.getCurrentUserId as vi.Mock).mockResolvedValueOnce(null);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const eventData = { type: InteractionEventType.CONTENT_VIEW, payload: {contentAtomId: 'atom1', knowledgeComponentIds: ['kc1'], contentType: 'text'} } as Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId' | 'eventContext'> & {type: InteractionEventType.CONTENT_VIEW, payload: any};
      await serviceInstance.logEvent(eventData);

      expect(mockEventQueueInstance.addEvent).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('StealthAssessmentService: No user ID found. Event not logged.');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Convenience Methods', () => {
    it('logQuestionAttempt should call logEvent with correct type', async () => {
      const details: Omit<QuestionAttemptEvent, 'type' | 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId' | 'eventContext'> = { // Adjusted Omit
        questionId: 'q1',
        knowledgeComponentIds: ['kc1'],
        answerGiven: 'A',
        isCorrect: true,
        attemptsMade: 1,
      };
      // Spy on the instance's logEvent method for this test
      const logEventSpy = vi.spyOn(serviceInstance, 'logEvent');
      await serviceInstance.logQuestionAttempt(details, 'QuestionComponent');

      expect(logEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: InteractionEventType.QUESTION_ATTEMPT, ...details }),
        'QuestionComponent'
      );
      logEventSpy.mockRestore();
    });
  });

  describe('logInteractionEvent (Direct Supabase Logger)', () => {
    it('should call supabaseLogger.logInteractionEvent', async () => {
      const directEventData = {
        event_type: InteractionEventType.TOOL_USAGE, // This should match InteractionEventType from OUR types
        user_id: 'test-user-id',
        event_data: { tool: 'calculator' },
        kc_ids: ['kc-calc'],
      };
      await serviceInstance.logInteractionEvent(directEventData as any); // Cast as any if signature mismatches slightly
      expect(mockSupabaseLoggerInstance.logInteractionEvent).toHaveBeenCalledWith(directEventData);
    });
  });

  describe('Debug/Test methods for in-memory queue', () => {
    it('getInMemoryEvents should call eventQueue.getEvents', async () => {
      await serviceInstance.getInMemoryEvents();
      expect(mockEventQueueInstance.getEvents).toHaveBeenCalled();
    });

    it('clearInMemoryEvents should call eventQueue.clearEvents', async () => {
      await serviceInstance.clearInMemoryEvents();
      expect(mockEventQueueInstance.clearEvents).toHaveBeenCalled();
    });
  });
});
