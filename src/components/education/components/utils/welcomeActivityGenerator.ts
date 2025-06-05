
import { LessonActivity } from '../types/LessonTypes';

const welcomeMessages = {
  mathematics: {
    title: "Welcome to Mathematics Class!",
    message: "Get ready for an exciting math adventure! Today we'll explore numbers, solve puzzles, and discover the magic of mathematics together. I'm here to help you every step of the way!"
  },
  english: {
    title: "Welcome to English Class!",
    message: "Welcome to our wonderful world of words! Today we'll read amazing stories, learn new vocabulary, and improve our language skills. Let's embark on this literary journey together!"
  },
  science: {
    title: "Welcome to Science Class!",
    message: "Welcome, young scientist! Today we'll explore the fascinating world around us, conduct experiments, and discover how things work. Get ready for some amazing scientific discoveries!"
  },
  music: {
    title: "Welcome to Music Class!",
    message: "Welcome to our musical adventure! Today we'll explore rhythm, melody, and harmony. We'll learn about different instruments and create beautiful music together. Let's make some magical sounds!"
  },
  'computer-science': {
    title: "Welcome to Computer Science Class!",
    message: "Welcome to the exciting world of technology! Today we'll learn about coding, problem-solving, and how computers work. Get ready to think like a programmer and create amazing digital projects!"
  },
  'creative-arts': {
    title: "Welcome to Creative Arts Class!",
    message: "Welcome to our creative studio! Today we'll explore art, design, and imagination. We'll create beautiful artwork, learn about colors and shapes, and express ourselves through creative projects!"
  }
};

export const createWelcomeActivity = (subject: string): LessonActivity => {
  const config = welcomeMessages[subject.toLowerCase() as keyof typeof welcomeMessages] || welcomeMessages.mathematics;

  return {
    id: 'welcome-1',
    type: 'welcome',
    title: config.title,
    duration: 8,
    content: {
      message: config.message
    }
  };
};
