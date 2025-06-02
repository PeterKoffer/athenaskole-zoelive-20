
import { Question } from '../hooks/useQuestionGeneration';

export const createFallbackQuestion = (): Question => {
  const fallbackQuestions = [
    {
      question: "What is 1/2 + 1/4?",
      options: ["1/6", "2/6", "3/4", "3/6"],
      correct: 2,
      explanation: "To add fractions, find a common denominator. 1/2 = 2/4, so 2/4 + 1/4 = 3/4",
      learningObjectives: ["Adding fractions with different denominators", "Finding common denominators"],
      estimatedTime: 30
    },
    {
      question: "What is 3/4 - 1/4?",
      options: ["2/4", "1/2", "Both A and B", "4/8"],
      correct: 2,
      explanation: "3/4 - 1/4 = 2/4, which simplifies to 1/2. So both A and B are correct.",
      learningObjectives: ["Subtracting fractions", "Simplifying fractions"],
      estimatedTime: 25
    },
    {
      question: "Which fraction is equivalent to 1/2?",
      options: ["2/4", "3/6", "4/8", "All of the above"],
      correct: 3,
      explanation: "All of these fractions equal 1/2 when simplified: 2/4 = 1/2, 3/6 = 1/2, 4/8 = 1/2",
      learningObjectives: ["Equivalent fractions", "Fraction simplification"],
      estimatedTime: 20
    }
  ];

  return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
};
