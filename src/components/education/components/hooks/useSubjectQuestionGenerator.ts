
import { LessonActivity } from '../types/LessonTypes';

interface QuestionTopic {
  title: string;
  description: string;
  skillArea: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const useSubjectQuestionGenerator = () => {
  const getSubjectQuestions = (subject: string, sessionId: string): QuestionTopic[] => {
    console.log(`🎯 Generating questions for ${subject} (session: ${sessionId})`);
    
    const questionSets: Record<string, QuestionTopic[]> = {
      mathematics: [
        {
          title: "Number Patterns",
          description: "Explore mathematical patterns and sequences",
          skillArea: "pattern_recognition",
          question: "What comes next in this pattern: 2, 4, 6, 8, ?",
          options: ["9", "10", "11", "12"],
          correctAnswer: 1,
          explanation: "This is an even number pattern, so 10 comes next!"
        },
        {
          title: "Basic Addition",
          description: "Practice fundamental addition skills",
          skillArea: "addition",
          question: "What is 7 + 5?",
          options: ["11", "12", "13", "14"],
          correctAnswer: 1,
          explanation: "7 + 5 = 12. Great job!"
        },
        {
          title: "Shape Recognition",
          description: "Identify geometric shapes and their properties",
          skillArea: "geometry",
          question: "How many sides does a triangle have?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "A triangle has exactly 3 sides!"
        }
      ],
      english: [
        {
          title: "Vowel Sounds",
          description: "Practice identifying vowel sounds in words",
          skillArea: "phonics",
          question: "Which word has the long 'a' sound?",
          options: ["cat", "cake", "cap", "can"],
          correctAnswer: 1,
          explanation: "Cake has the long 'a' sound - great listening!"
        },
        {
          title: "Reading Comprehension",
          description: "Understanding what we read",
          skillArea: "comprehension",
          question: "In the sentence 'The big dog ran fast', what describes the dog?",
          options: ["ran", "fast", "big", "the"],
          correctAnswer: 2,
          explanation: "'Big' is the adjective that describes the dog!"
        },
        {
          title: "Sentence Structure",
          description: "Learn how sentences are built",
          skillArea: "grammar",
          question: "Which is a complete sentence?",
          options: ["Running fast", "The cat sleeps", "Under the tree", "Very happy"],
          correctAnswer: 1,
          explanation: "'The cat sleeps' has both a subject and a verb!"
        }
      ],
      science: [
        {
          title: "Weather Patterns",
          description: "Explore different types of weather",
          skillArea: "earth_science",
          question: "What do we call water falling from clouds?",
          options: ["Wind", "Rain", "Snow", "Thunder"],
          correctAnswer: 1,
          explanation: "Rain is water that falls from clouds!"
        },
        {
          title: "Animal Habitats",
          description: "Learn where different animals live",
          skillArea: "biology",
          question: "Where do fish live?",
          options: ["In trees", "In water", "In caves", "On land"],
          correctAnswer: 1,
          explanation: "Fish live in water - that's their natural habitat!"
        },
        {
          title: "Simple Machines",
          description: "Discover how simple machines help us",
          skillArea: "physics",
          question: "Which is an example of a simple machine?",
          options: ["Computer", "Lever", "Car", "Phone"],
          correctAnswer: 1,
          explanation: "A lever is a simple machine that helps us lift things!"
        }
      ]
    };

    return questionSets[subject] || questionSets.mathematics;
  };

  const getSubjectScenario = (subject: string, sessionId: string): string => {
    console.log(`🎭 Generating scenario for ${subject} (session: ${sessionId})`);
    
    const scenarios: Record<string, string> = {
      mathematics: "Imagine you're a number detective solving mysterious math puzzles to help your friends!",
      english: "You're an author writing an amazing story that will inspire readers around the world!",
      science: "You're a young scientist exploring the wonders of nature and making exciting discoveries!"
    };

    return scenarios[subject] || scenarios.mathematics;
  };

  const getSubjectApplicationScenario = (subject: string, sessionId: string): string => {
    console.log(`🌍 Generating application scenario for ${subject} (session: ${sessionId})`);
    
    const applications: Record<string, string> = {
      mathematics: "Help plan a birthday party by calculating how many balloons, cake slices, and games you'll need for all your friends!",
      english: "Write a letter to your favorite author telling them why you love their books and what stories you'd like to see next!",
      science: "Design a simple experiment to test which materials float or sink, and explain what you discover!"
    };

    return applications[subject] || applications.mathematics;
  };

  return {
    getSubjectQuestions,
    getSubjectScenario,
    getSubjectApplicationScenario
  };
};
