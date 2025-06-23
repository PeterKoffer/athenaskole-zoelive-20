
import { LessonActivity } from '../types/LessonTypes';

export const englishLessons: LessonActivity[] = [
  {
    id: 'english-intro-1',
    title: 'Welcome to English Learning',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 180,
    phaseDescription: 'Introduction to English lesson',
    metadata: {
      subject: 'english',
      skillArea: 'general_english'
    },
    content: {
      text: 'Welcome to our English learning adventure! Today we will explore reading, writing, and language skills together.'
    }
  },
  {
    id: 'english-reading-1',
    title: 'Reading Comprehension',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    phaseDescription: 'Reading comprehension practice',
    metadata: {
      subject: 'english',
      skillArea: 'reading'
    },
    content: {
      question: 'What is the main idea of a story?',
      options: ['The most important point', 'The first sentence', 'The last word', 'The title'],
      correctAnswer: 0,
      explanation: 'The main idea is the most important point or message that the author wants to share with readers.'
    }
  },
  {
    id: 'english-writing-1',
    title: 'Creative Writing',
    type: 'creative-exploration',
    phase: 'creative-exploration',
    duration: 300,
    phaseDescription: 'Creative writing exercise',
    metadata: {
      subject: 'english',
      skillArea: 'writing'
    },
    content: {
      creativePrompt: 'Write a short story about a magical adventure in your neighborhood.'
    }
  }
];
