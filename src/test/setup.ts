
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock OpenAI
vi.mock('openai', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [
                            {
                                message: {
                                    content: JSON.stringify({
                                        title: 'Test Universe',
                                        description: 'Test description',
                                        characters: ['Test Character'],
                                        locations: ['Test Location'],
                                        activities: ['Test Activity']
                                    })
                                }
                            }
                        ]
                    })
                }
            }
        }))
    };
});

// Mock environment variables
vi.stubEnv('OPENAI_API_KEY', 'test-api-key');

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
