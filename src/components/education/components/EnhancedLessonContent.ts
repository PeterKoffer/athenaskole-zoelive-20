
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
    explanation?: string;
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
