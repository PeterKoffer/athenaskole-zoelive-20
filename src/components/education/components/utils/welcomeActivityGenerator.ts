
import { LessonActivity } from '../types/LessonTypes';

export const createWelcomeActivity = (subject: string): LessonActivity => {
  const welcomeMessages = {
    'mathematics': {
      title: 'Welcome to Mathematics with Nelie!',
      message: "Hello there, young mathematician! I'm Nelie, your AI learning companion, and I'm absolutely thrilled to explore the wonderful world of numbers with you today! We'll discover amazing patterns, solve exciting puzzles, and learn how math helps us understand everything around us. Are you ready for this mathematical adventure?"
    },
    'english': {
      title: 'Welcome to English with Nelie!',
      message: "Hello, my wonderful little reader! I'm Nelie, and I'm so excited to journey through the magical world of words and stories with you! Today we'll explore fascinating tales, learn new vocabulary, and discover how language can paint beautiful pictures in our minds. Let's begin this amazing literary adventure together!"
    },
    'science': {
      title: 'Welcome to Science with Nelie!',
      message: "Hello there, future scientist! I'm Nelie, your AI learning companion, and I'm absolutely excited to explore the incredible world of science with you! We'll discover how things work, conduct fun experiments, and uncover the amazing secrets of nature. Get ready to be amazed by the wonders around us!"
    },
    'music': {
      title: 'Welcome to Music with Nelie!',
      message: "Hello, my musical friend! I'm Nelie, and I'm so thrilled to explore the beautiful world of music with you today! We'll discover different sounds, learn about rhythm and melody, and create wonderful musical experiences together. Let's make some beautiful music and have fun learning!"
    },
    'computer-science': {
      title: 'Welcome to Computer Science with Nelie!',
      message: "Hello there, future programmer! I'm Nelie, your AI learning companion, and I'm absolutely excited to explore the fascinating world of technology and coding with you! We'll learn how computers think, solve problems like real programmers, and create amazing digital projects. Ready to become a tech wizard?"
    },
    'creative-arts': {
      title: 'Welcome to Creative Arts with Nelie!',
      message: "Hello, my creative artist! I'm Nelie, and I'm so excited to explore the wonderful world of art and creativity with you today! We'll learn about colors, shapes, and different art techniques while creating beautiful masterpieces together. Let's unleash your artistic imagination!"
    }
  };

  const subjectKey = subject.toLowerCase().replace(/[^a-z-]/g, '');
  const welcomeData = welcomeMessages[subjectKey as keyof typeof welcomeMessages] || welcomeMessages['mathematics'];

  return {
    id: `welcome-${subjectKey}`,
    type: 'introduction',
    phase: 'introduction',
    title: welcomeData.title,
    duration: 15,
    phaseDescription: 'Welcome to your learning adventure!',
    content: {
      hook: welcomeData.message
    }
  };
};
