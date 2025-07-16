import { OpenAIService } from '@/services/OpenAIService';
import { vi } from 'vitest';

// Mock the OpenAIService to avoid actual API calls during tests
vi.mock('@/services/OpenAIService', () => ({
  OpenAIService: {
    getInstance: () => ({
      generateUniverse: vi.fn().mockResolvedValue({
        title: 'Mock Universe',
        description: 'A universe generated for testing purposes.',
        content: [],
      }),
    }),
  },
}));

describe('OpenAIService', () => {
  it('should have OpenAI service available', () => {
    const service = OpenAIService.getInstance();
    expect(service).toBeDefined();
  });

  it('should handle universe generation with mock', async () => {
    const service = OpenAIService.getInstance();
    const universe = await service.generateUniverse('A test prompt');
    expect(universe).toBeDefined();
    expect(universe.title).toBe('Mock Universe');
  });
});
