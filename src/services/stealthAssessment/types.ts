

// src/services/stealthAssessment/types.ts

export interface StealthAssessmentConfig {
  flushInterval: number;
  immediateFlushThreshold: number;
  testUserId: string;
  mockSessionId: string;
}

export interface EventQueueManager {
  addEvent(event: any): Promise<void>;
  flushEvents(): Promise<void>;
  getQueueSize(): number;
}
