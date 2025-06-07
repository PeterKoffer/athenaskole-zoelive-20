
import { LessonActivity } from '../types/LessonTypes';

export const createMusicLesson = (): LessonActivity[] => [
  {
    id: 'music-introduction',
    type: 'introduction',
    phase: 'introduction',
    title: 'Welcome to Musical Adventures',
    duration: 150,
    phaseDescription: 'Discover the wonderful world of rhythm and sound',
    content: {
      hook: "Music is all around us! From the rhythm of your heartbeat to the melody of your favorite song, music connects us to emotions and memories in amazing ways.",
      realWorldExample: "Every time you clap along to a beat, hum a tune, or dance to music, you're experiencing the mathematical patterns and emotional power of musical expression!",
      thoughtQuestion: "Have you ever noticed how different types of music can make you feel happy, excited, calm, or energized? That's the magic we'll explore today!"
    }
  },
  {
    id: 'music-content-delivery',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Understanding Rhythm and Beat',
    duration: 180,
    phaseDescription: 'Learn the foundational elements of music',
    content: {
      segments: [
        {
          concept: "Rhythm is the Heartbeat of Music",
          explanation: "Rhythm is like a musical heartbeat that keeps music organized. It's the pattern of beats that helps us know when to clap, dance, or play instruments. Every song has its own special rhythm pattern!",
          checkQuestion: {
            question: "When you clap along to your favorite song, what are you following?",
            options: ["The melody", "The rhythm", "The words", "The volume"],
            correctAnswer: 1,
            explanation: "Perfect! You're following the rhythm - the steady beat that gives music its pulse and energy!"
          }
        }
      ]
    }
  },
  {
    id: 'music-interactive-game',
    type: 'interactive-game',
    phase: 'interactive-game',
    title: 'Musical Instrument Game',
    duration: 270,
    phaseDescription: 'Fun interactive learning about instruments',
    content: {
      gameType: 'matching',
      gameInstructions: "Let's play a musical instrument matching game! Listen carefully and think about how different instruments make their sounds.",
      question: 'Which instrument do you hit to make music?',
      options: ['Piano', 'Drums', 'Flute', 'Guitar'],
      correctAnswer: 1,
      explanation: 'Excellent! Drums are percussion instruments - you hit them with sticks or your hands to make rhythmic sounds that form the backbone of many songs!'
    }
  }
];
