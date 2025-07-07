
import { Question } from '../hooks/useReliableQuestionGeneration';

export const generateFallbackQuestion = (subject: string, skillArea: string): Question => {
  return {
    id: `fallback-${Date.now()}`,
    question: `What is an important concept in ${subject} ${skillArea}?`,
    options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
    correct: 0,
    explanation: `This is a fundamental concept in ${subject} ${skillArea}.`
  };
};
