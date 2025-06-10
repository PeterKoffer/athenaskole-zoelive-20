
import { Question } from './useInteractiveLessonState';

export const useInteractiveLessonQuestions = (subject: string): Question[] => {
  const getQuestions = (): Question[] => {
    if (subject === 'mathematics') {
      return [
        {
          id: 1,
          question: "What is 7 + 5?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "When we add 7 + 5, we count forward: 7, 8, 9, 10, 11, 12. So the answer is 12!"
        },
        {
          id: 2,
          question: "Which number is greater: 15 or 9?",
          options: ["15", "9", "They are equal", "Cannot tell"],
          correctAnswer: 0,
          explanation: "15 is greater than 9. When comparing numbers, the one with more digits or the larger value is greater."
        },
        {
          id: 3,
          question: "What is 20 - 8?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "When we subtract 8 from 20, we count backward: 20, 19, 18, 17, 16, 15, 14, 13, 12. So 20 - 8 = 12!"
        }
      ];
    }
    return [];
  };

  return getQuestions();
};
