
import { Question } from '../hooks/types';
import { EnhancedFallbackGenerator } from './enhancedFallbackGenerator';

export const generateFallbackQuestion = (subject: string, skillArea: string, difficultyLevel: number = 3): Question => {
  console.log('🔄 Generating enhanced fallback question for:', { subject, skillArea, difficultyLevel });
  
  // Use the enhanced fallback generator for better content
  return EnhancedFallbackGenerator.generateFallbackQuestion(subject, skillArea, difficultyLevel);
};

export const createFallbackQuestion = (): Question => {
  return {
    id: `fallback-${Date.now()}`,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1,
    explanation: 'The sum of 2 + 2 equals 4.',
    learningObjectives: ['Basic arithmetic'],
    estimatedTime: 30,
    conceptsCovered: ['addition']
  };
};
