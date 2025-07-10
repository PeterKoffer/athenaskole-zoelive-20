
// src/services/stealthAssessment/config.ts

export const STEALTH_ASSESSMENT_CONFIG = {
  flushInterval: 30000, // 30 seconds
  immediateFlushThreshold: 10, // Flush when 10 events queued
  testUserId: 'mock-user-123',
  mockSessionId: `session-${Date.now()}`
};
