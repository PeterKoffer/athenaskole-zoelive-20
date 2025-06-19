
import { LessonActivity } from '../types/LessonTypes';

// Helper Function for Seeded PRNG (Pseudo-Random Number Generator)
const seededRandom = (seedStr: string): (() => number) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) & 0xFFFFFFFF; // A simple hashing function
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (seed >>> 0) / 0xFFFFFFFF; // Convert to float between 0 and 1
  };
};

interface QuestionTopic {
  title: string;
  skillArea: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Expanded question pools
const questionSets: Record<string, QuestionTopic[]> = {
  science: [
    {
      title: 'Solar System Explorer',
        skillArea: 'astronomy',
        description: 'Journey through our solar system',
        question: 'Which planet is known as the "Red Planet"?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 0,
        explanation: 'Mars is called the Red Planet because of iron oxide (rust) on its surface!'
      },
      {
        title: 'Life Cycles Discovery',
        skillArea: 'biology',
        description: 'Explore how living things grow',
        question: 'What comes after the caterpillar stage in a butterfly\'s life cycle?',
        options: ['Chrysalis', 'Egg', 'Adult', 'Larva'],
        correctAnswer: 0,
        explanation: 'After the caterpillar stage, butterflies form a chrysalis (cocoon) before becoming adults!'
      },
      {
        title: 'Weather Wonders',
        skillArea: 'meteorology',
        description: 'Understand weather patterns',
        question: 'What type of cloud is most likely to produce rain?',
        options: ['Cumulus', 'Stratus', 'Cirrus', 'Nimbus'],
        correctAnswer: 3,
        explanation: 'Nimbus clouds are dark, thick clouds that bring rain and storms!'
      }
    ],
    mathematics: [
      {
        title: 'Addition Adventure',
        skillArea: 'addition',
        description: 'Master addition with fun scenarios',
        question: 'Sarah has 24 stickers and her friend gives her 18 more. How many stickers does Sarah have now?',
        options: ['42', '40', '44', '38'],
        correctAnswer: 0,
        explanation: 'Sarah started with 24 stickers and got 18 more. So 24 + 18 = 42 stickers total!'
      },
      {
        title: 'Subtraction Detective',
        skillArea: 'subtraction', 
        description: 'Solve subtraction mysteries',
        question: 'A library has 85 books. If 29 books are checked out, how many books remain?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'The library had 85 books and 29 were taken. So 85 - 29 = 56 books remain!'
      },
      {
        title: 'Multiplication Magic',
        skillArea: 'multiplication',
        description: 'Discover the power of multiplication',
        question: 'A garden has 7 rows of flowers with 8 flowers in each row. How many flowers are there?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'There are 7 rows with 8 flowers each. So 7 × 8 = 56 flowers total!'
      }
    ],
    english: [
      {
        title: 'Grammar Detective',
        skillArea: 'grammar',
        description: 'Master the rules of language',
        question: 'Which sentence uses the correct verb tense?',
        options: ['She walk to school yesterday', 'She walked to school yesterday', 'She walking to school yesterday', 'She walks to school yesterday'],
        correctAnswer: 1,
        explanation: 'For past events, we use past tense verbs. "Walked" is the past tense of "walk"!'
      },
      {
        title: 'Vocabulary Builder',
        skillArea: 'vocabulary',
        description: 'Expand your word power',
        question: 'What does the word "jubilant" mean?',
        options: ['Very happy', 'Very sad', 'Very tired', 'Very angry'],
        correctAnswer: 0,
        explanation: 'Jubilant means extremely happy and joyful, like celebrating a big victory!'
      },
      {
        title: 'Reading Comprehension',
        skillArea: 'reading',
        description: 'Understand what you read',
        question: 'In a story, what is the main character usually called?',
        options: ['Protagonist', 'Antagonist', 'Narrator', 'Author'],
        correctAnswer: 0,
        explanation: 'The protagonist is the main character who drives the story forward!'
      },
      {
        title: 'Figurative Language Fun',
        skillArea: 'literature',
        description: 'Understand metaphors and similes',
        question: 'Which is an example of a simile?',
        options: ['The sun is a golden ball.', 'He runs like the wind.', 'The cat meowed loudly.', 'Trees danced in the breeze.'],
        correctAnswer: 1,
        explanation: 'A simile compares two things using "like" or "as". "He runs like the wind" is a simile.'
      },
      {
        title: 'Sentence Structure Sleuth',
        skillArea: 'grammar',
        description: 'Identify different sentence types',
        question: 'What type of sentence is "Stop that!"?',
        options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
        correctAnswer: 2,
        explanation: 'An imperative sentence gives a command or makes a request. "Stop that!" is a command.'
      }
    ],
    // Adding more questions to mathematics
    mathematics: [
      {
        title: 'Addition Adventure',
        skillArea: 'addition',
        description: 'Master addition with fun scenarios',
        question: 'Sarah has 24 stickers and her friend gives her 18 more. How many stickers does Sarah have now?',
        options: ['42', '40', '44', '38'],
        correctAnswer: 0,
        explanation: 'Sarah started with 24 stickers and got 18 more. So 24 + 18 = 42 stickers total!'
      },
      {
        title: 'Subtraction Detective',
        skillArea: 'subtraction',
        description: 'Solve subtraction mysteries',
        question: 'A library has 85 books. If 29 books are checked out, how many books remain?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'The library had 85 books and 29 were taken. So 85 - 29 = 56 books remain!'
      },
      {
        title: 'Multiplication Magic',
        skillArea: 'multiplication',
        description: 'Discover the power of multiplication',
        question: 'A garden has 7 rows of flowers with 8 flowers in each row. How many flowers are there?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'There are 7 rows with 8 flowers each. So 7 × 8 = 56 flowers total!'
      },
      {
        title: 'Fraction Fun',
        skillArea: 'fractions',
        description: 'Understand parts of a whole',
        question: 'If you eat 1/4 of a pizza with 8 slices, how many slices did you eat?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 1,
        explanation: '1/4 of 8 slices is 8 divided by 4, which equals 2 slices.'
      },
      {
        title: 'Geometry Genius',
        skillArea: 'geometry',
        description: 'Explore shapes and their properties',
        question: 'How many sides does a hexagon have?',
        options: ['4', '5', '6', '8'],
        correctAnswer: 2,
        explanation: 'A hexagon is a polygon with 6 sides.'
      }
    ],
     science: [ // Adding more questions to science
      {
        title: 'Solar System Explorer',
        skillArea: 'astronomy',
        description: 'Journey through our solar system',
        question: 'Which planet is known as the "Red Planet"?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 0,
        explanation: 'Mars is called the Red Planet because of iron oxide (rust) on its surface!'
      },
      {
        title: 'Life Cycles Discovery',
        skillArea: 'biology',
        description: 'Explore how living things grow',
        question: 'What comes after the caterpillar stage in a butterfly\'s life cycle?',
        options: ['Chrysalis', 'Egg', 'Adult', 'Larva'],
        correctAnswer: 0,
        explanation: 'After the caterpillar stage, butterflies form a chrysalis (cocoon) before becoming adults!'
      },
      {
        title: 'Weather Wonders',
        skillArea: 'meteorology',
        description: 'Understand weather patterns',
        question: 'What type of cloud is most likely to produce rain?',
        options: ['Cumulus', 'Stratus', 'Cirrus', 'Nimbus'],
        correctAnswer: 3,
        explanation: 'Nimbus clouds are dark, thick clouds that bring rain and storms!'
      },
      {
        title: 'Energy Explorers',
        skillArea: 'physics',
        description: 'Learn about different forms of energy',
        question: 'Which of these is a renewable energy source?',
        options: ['Coal', 'Natural Gas', 'Solar Power', 'Oil'],
        correctAnswer: 2,
        explanation: 'Solar power comes from the sun and is a renewable source of energy, unlike fossil fuels.'
      },
      {
        title: 'Matter Investigators',
        skillArea: 'chemistry',
        description: 'Discover the states of matter',
        question: 'What happens when water boils?',
        options: ['It freezes into ice.', 'It condenses into liquid.', 'It evaporates into steam (gas).', 'It melts into liquid.'],
        correctAnswer: 2,
        explanation: 'When water boils, it changes from a liquid state to a gaseous state (steam) through evaporation.'
      }
    ]
};

// Subject-specific question generators
const getSubjectQuestions = (subject: string, sessionId: string): QuestionTopic[] => {
  const allQuestionsOriginal = questionSets[subject] || questionSets.mathematics;
  if (!allQuestionsOriginal || allQuestionsOriginal.length === 0) {
    console.warn(`[useSubjectQuestionGenerator] No questions for subject ${subject}, returning empty.`);
    return [];
  }

  // Create a mutable copy for shuffling
  const allQuestions = [...allQuestionsOriginal];

  const numToSelect = Math.min(allQuestions.length, 3); // Select up to 3 questions

  if (allQuestions.length === 0) return []; // Should be caught by previous check, but good safeguard

  // Shuffle even if returning a subset or all, so order changes per session if pool is small or numToSelect is high
  const random = seededRandom(sessionId);
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]]; // Swap
  }
  
  const selectedQuestions = allQuestions.slice(0, numToSelect);

  console.log(`[useSubjectQuestionGenerator] For session ${sessionId}, selected ${selectedQuestions.length} questions for ${subject} using seeded shuffle (Pool size: ${allQuestionsOriginal.length}, Selected: ${selectedQuestions.length}).`);
  return selectedQuestions;
};

const scienceScenarios = [
  "You are a botanist exploring a newly discovered island. What unique plants might you find, and how would you classify them?",
  "Imagine you're an engineer designing a rover for Mars. What instruments would be crucial for searching for signs of past life?",
  "As an ecologist, you're studying the impact of climate change on a coral reef. What changes would you monitor?"
];
const mathScenarios = [
  "You're an architect designing a new community park. How would you use geometry and measurement to plan the layout and features?",
  "You've won a lottery! How would you use percentages and budgeting skills to manage your winnings wisely?",
  "You're planning a road trip across the country. How can you use math to calculate travel time, fuel costs, and distances between stops?"
];
const englishScenarios = [
  "You're a journalist tasked with writing a compelling human-interest story. What elements would you include to engage your readers?",
  "Imagine you're a poet trying to capture the feeling of a a stormy day. What literary devices and imagery would you use?",
  "You need to write a persuasive speech to convince your school to adopt a new recycling program. What arguments and rhetorical techniques would be most effective?"
];

const scenariosRepo: Record<string, string[]> = {
  science: scienceScenarios,
  mathematics: mathScenarios,
  english: englishScenarios,
};

const getSubjectScenario = (subject: string, sessionId: string): string => {
  const subjectScenarios = scenariosRepo[subject] || scenariosRepo.science; // Fallback
  let scenarioIndex = 0;
  if (sessionId && subjectScenarios.length > 0) {
    for (let i = 0; i < sessionId.length; i++) {
      scenarioIndex = (scenarioIndex + sessionId.charCodeAt(i)) % subjectScenarios.length;
    }
  }
  const scenario = subjectScenarios[scenarioIndex] || `Default scenario for ${subject} if selection failed. Session: ${sessionId}`;
  console.log(`[useSubjectQuestionGenerator] For session ${sessionId}, selected scenario for ${subject}: "${scenario.substring(0,30)}..."`);
  return scenario;
};

const scienceAppScenarios = [
  "Your friend wants to know why the sky is blue. Explain the scientific reason in simple terms.",
  "Design a simple experiment to test which type of soil is best for growing beans.",
  "How can you reduce your family's energy consumption at home? List three practical steps."
];
const mathAppScenarios = [
  "You're baking cookies and the recipe calls for 2.5 cups of flour, but you only have a 0.5 cup measure. How many times will you need to fill it?",
  "A store is offering a 20% discount on a $50 video game. How much will the game cost after the discount?",
  "You want to build a rectangular fence for your dog. You have 40 meters of fencing. What are some possible dimensions for the fence?"
];
const englishAppScenarios = [
  "Write a short, descriptive paragraph about your favorite place, using at least three adjectives and one simile.",
  "Your younger sibling is struggling to understand the difference between 'there', 'their', and 'they're'. Explain it clearly with examples.",
  "Summarize the main plot of a book you recently read in three to five sentences."
];

const appScenariosRepo: Record<string, string[]> = {
  science: scienceAppScenarios,
  mathematics: mathAppScenarios,
  english: englishAppScenarios,
};

const getSubjectApplicationScenario = (subject: string, sessionId: string): string => {
  const subjectAppScenarios = appScenariosRepo[subject] || appScenariosRepo.science; // Fallback
  let scenarioIndex = 0;
  if (sessionId && subjectAppScenarios.length > 0) {
    for (let i = 0; i < sessionId.length; i++) {
      scenarioIndex = (scenarioIndex + sessionId.charCodeAt(i)) % subjectAppScenarios.length;
    }
  }
  const appScenario = subjectAppScenarios[scenarioIndex] || `Default application scenario for ${subject} if selection failed. Session: ${sessionId}`;
  console.log(`[useSubjectQuestionGenerator] For session ${sessionId}, selected application scenario for ${subject}: "${appScenario.substring(0,30)}..."`);
  return appScenario;
};

export const useSubjectQuestionGenerator = () => {
  return {
    getSubjectQuestions,
    getSubjectScenario,
    getSubjectApplicationScenario
  };
};
