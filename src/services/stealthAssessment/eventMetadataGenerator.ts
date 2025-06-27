
// src/services/stealthAssessment/eventMetadataGenerator.ts

import { v4 as uuidv4 } from 'uuid';
import { BaseInteractionEvent, InteractionEvent } from '@/types/stealthAssessment';
import { getCurrentSessionId } from './userUtils';

export const generateEventMetadata = (sourceComponentId?: string): Omit<BaseInteractionEvent, 'userId' | 'timestamp' | 'eventId'> => {
  return {
    sessionId: getCurrentSessionId(),
    sourceComponentId,
  };
};

export const createFullEvent = async (
  eventData: Omit<InteractionEvent, 'eventId' | 'timestamp' | 'userId' | 'sessionId' | 'sourceComponentId'>,
  userId: string,
  sourceComponentId?: string
): Promise<InteractionEvent> => {
  return {
    eventId: uuidv4(),
    timestamp: Date.now(),
    userId,
    sessionId: getCurrentSessionId(),
    sourceComponentId,
    ...eventData,
  } as InteractionEvent;
};
