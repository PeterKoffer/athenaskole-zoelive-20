# Unified Question Generation System

## Overview

The Unified Question Generation System provides centralized, guaranteed unique question generation across all sessions and users. This system replaces the previous fragmented approach with a single, coherent interface.

## Key Features

- **Global Uniqueness Tracking**: Questions are tracked globally across all users and sessions
- **Guaranteed Unique IDs**: Every question gets a unique identifier for tracking
- **Unified Interface**: Single interface for all question generation needs
- **Enhanced Fallbacks**: Improved fallback generators with better variety and progression
- **Persistent Tracking**: Questions are tracked both in memory and database
- **Backward Compatibility**: Existing hooks continue to work with enhanced functionality

## Main Components

### 1. GlobalQuestionUniquenessService
`/src/services/globalQuestionUniquenessService.ts`

- Manages global question uniqueness across all sessions
- Generates guaranteed unique question IDs
- Tracks questions by user, subject, and skill area
- Provides statistics and management functions

### 2. UnifiedQuestionGenerationService  
`/src/services/unifiedQuestionGeneration.ts`

- Main orchestrator for question generation
- Attempts AI generation first, falls back to enhanced generators
- Guarantees uniqueness through multiple validation layers
- Handles all generation strategies in one place

### 3. useUnifiedQuestionGeneration Hook
`/src/hooks/useUnifiedQuestionGeneration.ts`

- React hook interface for the unified system
- Provides generation statistics and state management
- Compatible with existing React patterns

## Usage Examples

### Basic Usage (New Code)
```typescript
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';

const MyComponent = () => {
  const {
    generateUniqueQuestion,
    saveQuestionHistory,
    isGenerating,
    currentQuestion,
    generationStats
  } = useUnifiedQuestionGeneration({
    subject: 'Math',
    skillArea: 'Addition',
    difficultyLevel: 3,
    userId: 'user123',
    gradeLevel: 5
  });

  const handleGenerateQuestion = async () => {
    try {
      const question = await generateUniqueQuestion();
      console.log('Generated:', question);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateQuestion} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Question'}
      </button>
      {currentQuestion && (
        <div>
          <h3>Question ID: {currentQuestion.id}</h3>
          <p>{currentQuestion.question}</p>
        </div>
      )}
    </div>
  );
};
```

### Legacy Compatibility (Existing Code)
```typescript
// Existing code continues to work unchanged
import { useDiverseQuestionGeneration } from '@/components/adaptive-learning/hooks/useDiverseQuestionGeneration';

const ExistingComponent = () => {
  const {
    generateDiverseQuestion,
    saveQuestionHistory,
    isGenerating,
    generationStats // Now includes additional unified stats
  } = useDiverseQuestionGeneration({
    subject: 'Math',
    skillArea: 'Addition', 
    difficultyLevel: 3,
    userId: 'user123',
    gradeLevel: 5
  });

  // Existing code works exactly the same
  // But now benefits from unified uniqueness tracking
};
```

## Migration Guide

### For New Components
Use `useUnifiedQuestionGeneration` hook directly:

```typescript
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';

// Configure the hook with your parameters
const questionGeneration = useUnifiedQuestionGeneration({
  subject: 'Your Subject',
  skillArea: 'Your Skill Area',
  difficultyLevel: 1-5,
  userId: 'current-user-id',
  gradeLevel: 1-12 // optional
});
```

### For Existing Components
No changes required - existing hooks automatically use the unified system:

- `useDiverseQuestionGeneration` - Enhanced with unified tracking
- `useReliableQuestionGeneration` - Can be gradually migrated
- `useQuestionGeneration` - Can be gradually migrated

## Enhanced Features

### Question ID Structure
Questions now have guaranteed unique IDs:
```
q_[timestamp]_[userHash]_[subjectHash]_[skillHash]_[random]
Example: q_1734724800000_a1b2c3d4_math_add1_xyz789abc
```

### Statistics and Monitoring
```typescript
const stats = generationStats;
console.log({
  totalGenerated: stats.totalGenerated,
  aiGenerated: stats.aiGenerated,
  fallbackGenerated: stats.fallbackGenerated,
  successRate: stats.successRate,
  aiSuccessRate: stats.aiSuccessRate
});
```

### Global Service Access
```typescript
import { globalQuestionUniquenessService } from '@/services/globalQuestionUniquenessService';

// Get usage statistics
const globalStats = globalQuestionUniquenessService.getUsageStats();

// Clear old questions (memory management)
globalQuestionUniquenessService.clearOldQuestions(24 * 60 * 60 * 1000); // 24 hours

// Check if question would be unique
const isUnique = await globalQuestionUniquenessService.isQuestionUnique(
  questionText, 
  userId, 
  subject
);
```

## Implementation Benefits

1. **Guaranteed Uniqueness**: No more duplicate questions across any session
2. **Better Performance**: Intelligent caching and memory management
3. **Enhanced Variety**: Improved fallback generators with more scenarios
4. **Global Tracking**: Questions tracked across all users and sessions
5. **Statistics**: Rich generation statistics for monitoring and optimization
6. **Backward Compatible**: Existing code works without changes
7. **Extensible**: Easy to add new generation strategies

## Configuration Options

```typescript
interface QuestionGenerationConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: any;
  questionContext?: any;
  maxAttempts?: number; // Default: 5
  enablePersistence?: boolean; // Default: true
}
```

## Monitoring and Debugging

The system provides extensive logging:
- `🎯` - Generation start
- `🤖` - AI generation attempts  
- `🎲` - Fallback generation
- `✅` - Successful generation
- `❌` - Failed attempts
- `📊` - Statistics and IDs
- `⚠️` - Uniqueness warnings

## Best Practices

1. **Use the unified hook for new components**
2. **Monitor generation statistics for optimization**
3. **Configure appropriate grade levels for better content**
4. **Use question contexts for enhanced generation**
5. **Save question history for learning analytics**
6. **Clear old questions periodically for memory management**

## Troubleshooting

### Common Issues
1. **High fallback rate**: Check AI service availability
2. **Memory usage**: Configure question cleanup intervals
3. **Generation failures**: Verify user authentication and parameters
4. **Duplicate detection**: Check uniqueness service configuration

### Debug Information
Enable console logging to see detailed generation flow:
```javascript
// Generation attempts, uniqueness checks, and fallback triggers
// are automatically logged with emojis for easy identification
```