
export interface LessonActivity {
  id: string;
  type: 'welcome' | 'explanation' | 'question' | 'game';
  title: string;
  duration: number;
  content: {
    message?: string;
    text?: string;
    question?: string;
    options?: string[];
    correctAnswer?: number;
    correct?: number; // Alternative property name used in some components
    explanation?: string;
    examples?: string[]; // For explanation activities
    story?: string; // For question activities with story context
  };
}

const createWelcomeActivity = (subject: string): LessonActivity => {
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

export const createMathematicsLesson = (): LessonActivity[] => [
  createWelcomeActivity('mathematics'),
  {
    id: 'math-explanation-1',
    type: 'explanation',
    title: 'Understanding Addition',
    duration: 10,
    content: {
      text: 'Addition is when we combine numbers to find their total. When we add 2 + 3, we get 5. Think of it like putting groups of objects together!'
    }
  },
  {
    id: 'math-question-1',
    type: 'question',
    title: 'Simple Addition',
    duration: 30,
    content: {
      question: 'What is 4 + 6?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 2,
      explanation: 'Great! 4 + 6 = 10. You can count: 4, 5, 6, 7, 8, 9, 10!'
    }
  },
  {
    id: 'math-game-1',
    type: 'game',
    title: 'Number Pattern Detective Game',
    duration: 45,
    content: {
      text: 'Look at this pattern: 2, 4, 6, 8, ?. What number comes next?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Excellent! The pattern adds 2 each time, so 8 + 2 = 10!'
    }
  },
  {
    id: 'math-question-2',
    type: 'question',
    title: 'Math Story Adventure',
    duration: 30,
    content: {
      question: 'Maya went to the zoo and saw 12 monkeys playing in the trees. Then 4 monkeys went inside for lunch. How many monkeys were still playing outside?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      explanation: 'Perfect! 12 - 4 = 8 monkeys were still playing outside!'
    }
  }
];

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

export const createScienceLesson = (): LessonActivity[] => [
  createWelcomeActivity('science'),
  {
    id: 'science-explanation-1',
    type: 'explanation',
    title: 'Animal Habitats',
    duration: 10,
    content: {
      text: 'A habitat is where an animal lives and finds everything it needs - food, water, shelter, and space. Different animals need different types of homes!'
    }
  },
  {
    id: 'science-question-1',
    type: 'question',
    title: 'Where Do Animals Live?',
    duration: 30,
    content: {
      question: 'Where would you most likely find a polar bear?',
      options: ['Desert', 'Arctic ice', 'Rainforest', 'Ocean depths'],
      correctAnswer: 1,
      explanation: 'Fantastic! Polar bears live in the Arctic where there is lots of ice and snow. That\'s their perfect habitat!'
    }
  },
  {
    id: 'science-question-2',
    type: 'question',
    title: 'Plant Needs',
    duration: 30,
    content: {
      question: 'What do plants need to grow healthy and strong?',
      options: ['Only water', 'Only sunlight', 'Water, sunlight, and nutrients', 'Only soil'],
      correctAnswer: 2,
      explanation: 'Great job! Plants need water, sunlight, and nutrients from soil to grow big and healthy!'
    }
  }
];

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

export const createComputerScienceLesson = (): LessonActivity[] => [
  createWelcomeActivity('computer-science'),
  {
    id: 'cs-explanation-1',
    type: 'explanation',
    title: 'What is Programming?',
    duration: 10,
    content: {
      text: 'Programming is like giving instructions to a computer! We write step-by-step directions that tell the computer exactly what to do, just like following a recipe.'
    }
  },
  {
    id: 'cs-question-1',
    type: 'question',
    title: 'Computer Logic',
    duration: 30,
    content: {
      question: 'If you want a robot to make a sandwich, what should be the first step?',
      options: ['Eat the sandwich', 'Get the bread', 'Put on the roof', 'Dance'],
      correctAnswer: 1,
      explanation: 'Excellent thinking! Just like in programming, we need to start with the first logical step - getting the bread!'
    }
  }
];

export const createCreativeArtsLesson = (): LessonActivity[] => [
  createWelcomeActivity('creative-arts'),
  {
    id: 'art-explanation-1',
    type: 'explanation',
    title: 'Primary Colors',
    duration: 10,
    content: {
      text: 'Primary colors are red, blue, and yellow! These are special colors because we can mix them together to create all other colors. They are like the building blocks of art!'
    }
  },
  {
    id: 'art-question-1',
    type: 'question',
    title: 'Color Mixing',
    duration: 30,
    content: {
      question: 'What color do you get when you mix red and yellow?',
      options: ['Purple', 'Orange', 'Green', 'Pink'],
      correctAnswer: 1,
      explanation: 'Wonderful! Red and yellow make orange - just like a beautiful sunset or a pumpkin!'
    }
  }
];
