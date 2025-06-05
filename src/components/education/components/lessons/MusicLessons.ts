
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createMusicLesson = (): LessonActivity[] => [
  createWelcomeActivity('music'),
  {
    id: 'music-explanation-1',
    type: 'explanation',
    title: 'Understanding Rhythm',
    duration: 10,
    content: {
      text: 'Rhythm is the beat in music - like a heartbeat! It helps us know when to clap, dance, or play instruments. Every song has its own special rhythm pattern.'
    }
  },
  {
    id: 'music-question-1',
    type: 'question',
    title: 'Musical Instruments',
    duration: 30,
    content: {
      question: 'Which instrument do you hit to make music?',
      options: ['Piano', 'Drums', 'Flute', 'Guitar'],
      correctAnswer: 1,
      explanation: 'Perfect! Drums are percussion instruments - you hit them with sticks or your hands to make rhythmic sounds!'
    }
  }
];
