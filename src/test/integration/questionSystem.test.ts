import { describe, it, expect } from 'vitest';

describe('Stable Question System Integration', () => {
  it('should initialize the stable question template system', async () => {
    // Mock the dependencies
    vi.mock('@/services/stable-question-system/templates', () => ({
      mathTemplates: [
        {
          id: 'test-template',
          subject: 'mathematics',
          skillArea: 'arithmetic',
          difficulty: 1,
        }
      ],
    }));

    vi.mock('@/services/stable-question-system/questionGenerator', () => ({
      QuestionGenerator: vi.fn().mockImplementation(() => ({
        generateFromTemplate: vi.fn().mockReturnValue({
          id: 'test-question-1',
          question: 'What is 2 + 2?',
          answer: '4',
          templateId: 'test-template',
        }),
      })),
    }));

    const { StableQuestionTemplateSystem } = await import('@/services/stable-question-system/stableQuestionTemplateSystem');
    
    const system = new StableQuestionTemplateSystem();
    expect(system).toBeDefined();
    
    // Test that the system can provide stats
    const stats = system.getStats();
    expect(stats).toHaveProperty('totalTemplates');
    expect(stats).toHaveProperty('totalPrecompiledQuestions');
    expect(stats).toHaveProperty('activeSessions');
  });

  it('should handle session management', async () => {
    // Import after mocking
    const { StableQuestionTemplateSystem } = await import('@/services/stable-question-system/stableQuestionTemplateSystem');
    
    const system = new StableQuestionTemplateSystem();
    const sessionId = 'test-session-123';
    
    // Test session clearing
    system.clearSession(sessionId);
    
    // Verify the system handles session operations
    const stats = system.getStats();
    expect(stats.activeSessions).toBe(0);
  });
});