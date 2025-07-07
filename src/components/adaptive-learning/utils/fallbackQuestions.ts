
import { Question } from '../hooks/useReliableQuestionGeneration';

export const generateFallbackQuestion = (subject: string, skillArea: string): Question => {
  return {
    id: `fallback-${Date.now()}`,
    question: `What is an important concept in ${subject} ${skillArea}?`,
    options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
    correct: 0,
    explanation: `This is a fundamental concept in ${subject} ${skillArea}.`,
    learningObjectives: [`Understanding ${subject} ${skillArea} concepts`],
    estimatedTime: 60,
    conceptsCovered: [skillArea]
  };
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
