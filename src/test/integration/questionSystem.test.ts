
import { describe, it, expect, beforeEach } from 'vitest';
import { scalableQuestionGeneration } from '@/services/scalableQuestionGeneration';

describe('Question System Integration', () => {
  beforeEach(() => {
    // Setup test environment
  });

  it('should generate questions at scale', async () => {
    const config = {
      subject: 'Mathematics',
      skillArea: 'algebra',
      difficultyLevel: 2,
      userId: 'test-user',
      batchSize: 10
    };

    const questions = await scalableQuestionGeneration.generateQuestionBatch(config);
    expect(Array.isArray(questions)).toBe(true);
  });

  it('should monitor system performance', async () => {
    const systemLoad = await scalableQuestionGeneration.getSystemLoad();
    expect(systemLoad).toHaveProperty('cpu');
    expect(systemLoad).toHaveProperty('memory');
    expect(systemLoad).toHaveProperty('activeUsers');
  });

  it('should provide system statistics', () => {
    const stats = scalableQuestionGeneration.getSystemStats();
    expect(stats).toHaveProperty('cachedQuestions');
    expect(stats).toHaveProperty('activeUsers');
    expect(stats).toHaveProperty('cacheHitRate');
    expect(stats).toHaveProperty('systemLoad');
  });
});
