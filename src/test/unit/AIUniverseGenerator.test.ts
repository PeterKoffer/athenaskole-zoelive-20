// @ts-nocheck
import { aiUniverseGenerator } from '../../services/AIUniverseGenerator';
import { openAIService } from '../../services/OpenAIService';
import { vi } from 'vitest';

vi.mock('../../services/OpenAIService', () => ({
  openAIService: {
    generateUniverse: vi.fn(),
  },
}));

describe('AIUniverseGenerator', () => {
  it('should return a universe from the OpenAI service', async () => {
    const mockUniverse = {
      title: 'Test Universe',
      description: 'A universe for testing',
      objectives: [],
    };
    (openAIService.generateUniverse as any).mockResolvedValue(JSON.stringify(mockUniverse));

    const studentProfile = {
      name: 'Test Student',
      gradeLevel: 4,
      interests: ['testing'],
      abilities: { math: 'beginner' },
    };
    const universeString = await aiUniverseGenerator.generateUniverse(studentProfile);
    const universe = JSON.parse(universeString);

    expect(universe).toEqual(mockUniverse);
  });
});
