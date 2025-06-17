
import { LessonActivity } from '../types/LessonTypes';

interface QuestionTopic {
  title: string;
  skillArea: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Subject-specific question generators
const getSubjectQuestions = (subject: string): QuestionTopic[] => {
  const questionSets: Record<string, QuestionTopic[]> = {
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
      }
    ]
  };

  return questionSets[subject] || questionSets.mathematics;
};

const getSubjectScenario = (subject: string): string => {
  const scenarios: Record<string, string> = {
    mathematics: 'What if you were running a pizza shop and needed to calculate how many pizzas to make for different sized parties?',
    science: 'What if you were a scientist discovering a new planet? What would you want to learn about it first?',
    english: 'What if you were writing a story about a magical adventure? What characters and setting would you create?'
  };
  return scenarios[subject] || scenarios.mathematics;
};

const getSubjectApplicationScenario = (subject: string): string => {
  const scenarios: Record<string, string> = {
    mathematics: 'Your family is planning a picnic for 24 people. Each person will eat 2 sandwiches and drink 3 cups of juice. How much food and drink do you need to buy?',
    science: 'You notice your houseplant is wilting. Using what you know about plant needs, what steps would you take to help it grow healthy again?',
    english: 'You need to write a thank-you letter to your grandmother. How would you organize your thoughts and express your feelings clearly?'
  };
  return scenarios[subject] || scenarios.mathematics;
};

export const useSubjectQuestionGenerator = () => {
  return {
    getSubjectQuestions,
    getSubjectScenario,
    getSubjectApplicationScenario
  };
};
