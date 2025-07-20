import { describe, it, expect, vi } from 'vitest';
import { unifiedQuestionGenerationService } from '../../services/unifiedQuestionGeneration';
import { aiUniverseGenerator } from '../../services/AIUniverseGenerator';

vi.mock('../../services/AIUniverseGenerator', () => ({
  aiUniverseGenerator: {
    generateUniverse: vi.fn()
  }
}));

describe('UnifiedQuestionGenerationService', () => {
  it('returns a question object', async () => {
    (aiUniverseGenerator.generateUniverse as any).mockResolvedValue({
      activities: ['What is 2+2?']
    });
    const result = await unifiedQuestionGenerationService.generateQuestion('user1', { subject: 'Math' });
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('question');
  });
});
