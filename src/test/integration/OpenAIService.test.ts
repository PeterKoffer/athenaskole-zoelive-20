
import { describe, it, expect, vi } from 'vitest';
import { openAIService } from '../../services/OpenAIService';

describe('OpenAI Service Integration', () => {
  it('should have OpenAI service available', () => {
    expect(openAIService).toBeDefined();
    expect(typeof openAIService.generateUniverse).toBe('function');
  });

  it('should handle universe generation with mock', async () => {
    // This test uses the mock from setup.ts
    const universe = await openAIService.generateUniverse('Test prompt');
    
    expect(universe).toBeDefined();
    expect(universe.title).toBe('Test Universe');
    expect(universe.description).toBe('Test description');
    expect(Array.isArray(universe.characters)).toBe(true);
    expect(Array.isArray(universe.locations)).toBe(true);
    expect(Array.isArray(universe.activities)).toBe(true);
  });
});
