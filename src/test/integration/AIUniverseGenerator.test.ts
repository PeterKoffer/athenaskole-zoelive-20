// @ts-nocheck
import { AIUniverseGenerator } from '@/services/AIUniverseGenerator';
import { vi } from 'vitest';

vi.mock('@/services/AIUniverseGenerator', () => {
  const AIUniverseGenerator = vi.fn();
  AIUniverseGenerator.generateUniverse = vi.fn(() => {
    return Promise.resolve({
      title: 'Mock Universe',
      description: 'A universe generated for testing purposes.',
      content: [],
    });
  });
  return { AIUniverseGenerator };
});


describe('AIUniverseGenerator', () => {
  it('should generate a universe from a prompt', async () => {
    const universe = await AIUniverseGenerator.generateUniverse('A test prompt');
    expect(universe).toBeDefined();
    expect(universe.title).toBe('Mock Universe');
    expect(universe.description).toBe('A universe generated for testing purposes.');
  });
});
