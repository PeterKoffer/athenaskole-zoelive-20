import { describe, it, expect } from 'vitest';
import UnifiedQuestionGenerationService from '../../services/unifiedQuestionGeneration';

describe('UnifiedQuestionGenerationService', () => {
  it('returns a question object', async () => {
    const result = await UnifiedQuestionGenerationService.generateQuestion();
    expect(result).toHaveProperty('question');
  });
});
