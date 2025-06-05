
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createEnglishLesson = (): LessonActivity[] => [
  createWelcomeActivity('english'),
  {
    id: 'english-explanation-1',
    type: 'explanation',
    title: 'Reading Comprehension',
    duration: 10,
    content: {
      text: 'Reading comprehension means understanding what we read. We look for the main idea, important details, and think about what the author wants to tell us.'
    }
  },
  {
    id: 'english-question-1',
    type: 'question',
    title: 'Story Understanding',
    duration: 30,
    content: {
      question: 'Read this sentence: "The brave little mouse saved the day by finding the hidden cheese." What word describes the mouse?',
      options: ['little', 'brave', 'hidden', 'cheese'],
      correctAnswer: 1,
      explanation: 'Excellent! "Brave" is the word that describes how courageous the mouse was!'
    }
  },
  {
    id: 'english-question-2',
    type: 'question',
    title: 'Vocabulary Builder',
    duration: 30,
    content: {
      question: 'Which word means the same as "happy"?',
      options: ['sad', 'angry', 'joyful', 'tired'],
      correctAnswer: 2,
      explanation: 'Perfect! "Joyful" means the same as happy - both describe feeling good and cheerful!'
    }
  }
];
