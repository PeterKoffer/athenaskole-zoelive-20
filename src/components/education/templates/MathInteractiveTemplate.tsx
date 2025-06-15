
import InteractiveLessonTemplate, { InteractiveActivity } from './InteractiveLessonTemplate';

export const createMathInteractiveLesson = (topic: string, gradeLevel: number): InteractiveActivity[] => {
  const activities: InteractiveActivity[] = [];

  // Dynamic content based on topic and grade level
  switch (topic.toLowerCase()) {
    case 'addition':
      activities.push(
        {
          id: 'math-warm-up',
          type: 'mini-game',
          title: 'Number Race Warm-up',
          description: 'Quick mental math to get your brain ready!',
          duration: 120,
          difficulty: Math.min(gradeLevel, 3),
          points: 10,
          instructions: 'Solve as many addition problems as you can in 2 minutes!',
          successCriteria: 'Get 5 correct answers',
          content: {
            gameDescription: 'Race against the clock to solve addition problems!',
            problems: generateAdditionProblems(gradeLevel)
          }
        },
        {
          id: 'addition-strategies',
          type: 'exploration',
          title: 'Addition Strategy Explorer',
          description: 'Discover different ways to add numbers',
          duration: 180,
          difficulty: 2,
          points: 20,
          instructions: 'Explore different addition strategies and choose your favorite!',
          successCriteria: 'Try at least 3 different strategies',
          content: {
            explorationTask: 'Learn about counting on, number bonds, and doubles strategies',
            strategies: ['Counting On', 'Number Bonds', 'Doubles', 'Make 10']
          }
        },
        {
          id: 'addition-puzzle',
          type: 'puzzle',
          title: 'Magic Addition Square',
          description: 'Complete the magic square puzzle using addition',
          duration: 240,
          difficulty: 3,
          points: 30,
          instructions: 'Fill in the missing numbers so each row, column, and diagonal adds up to the same sum!',
          successCriteria: 'Complete the magic square correctly',
          content: {
            puzzleDescription: 'A 3x3 grid where all rows, columns, and diagonals have the same sum',
            grid: generateMagicSquare(gradeLevel)
          }
        },
        {
          id: 'word-problems',
          type: 'quiz',
          title: 'Real-World Addition',
          description: 'Solve addition word problems from everyday life',
          duration: 180,
          difficulty: Math.min(gradeLevel, 4),
          points: 25,
          instructions: 'Read each problem carefully and choose the correct answer',
          successCriteria: 'Get at least 3 out of 4 problems correct',
          content: {
            question: 'Sarah has 15 stickers. Her friend gives her 8 more stickers. How many stickers does Sarah have now?',
            options: ['21', '23', '25', '27'],
            correctAnswer: 1,
            explanation: 'Sarah had 15 stickers and got 8 more: 15 + 8 = 23 stickers'
          }
        },
        {
          id: 'creative-math',
          type: 'creative',
          title: 'Addition Story Creator',
          description: 'Create your own addition story problem',
          duration: 300,
          difficulty: 2,
          points: 35,
          instructions: 'Write and illustrate your own addition word problem!',
          successCriteria: 'Create a complete story with numbers and solution',
          content: {
            creativePrompt: 'Think of a fun situation where someone needs to add numbers together. Write the story and solve it!'
          }
        }
      );
      break;

    case 'multiplication':
      activities.push(
        {
          id: 'times-table-game',
          type: 'mini-game',
          title: 'Multiplication Madness',
          description: 'Master your times tables with this exciting game!',
          duration: 180,
          difficulty: Math.min(gradeLevel - 1, 4),
          points: 15,
          instructions: 'Answer multiplication questions as fast as you can!',
          successCriteria: 'Get 10 correct answers',
          content: {
            gameDescription: 'Practice times tables with increasing difficulty',
            tables: [2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, gradeLevel)
          }
        },
        {
          id: 'array-builder',
          type: 'simulation',
          title: 'Array Builder Challenge',
          description: 'Build arrays to visualize multiplication',
          duration: 240,
          difficulty: 2,
          points: 20,
          instructions: 'Drag and drop objects to create arrays that match the multiplication problem!',
          successCriteria: 'Build 5 correct arrays',
          content: {
            simulationDescription: 'Use visual arrays to understand multiplication as repeated addition'
          }
        }
      );
      break;

    case 'fractions':
      activities.push(
        {
          id: 'pizza-fractions',
          type: 'simulation',
          title: 'Pizza Fraction Party',
          description: 'Learn fractions by sharing pizzas!',
          duration: 300,
          difficulty: 3,
          points: 25,
          instructions: 'Cut pizzas into equal parts and serve the right fractions to each guest!',
          successCriteria: 'Serve 5 guests correctly',
          content: {
            simulationDescription: 'Interactive pizza cutting to understand fractions visually'
          }
        },
        {
          id: 'fraction-art',
          type: 'creative',
          title: 'Fraction Art Gallery',
          description: 'Create beautiful art using fractions',
          duration: 360,
          difficulty: 2,
          points: 30,
          instructions: 'Design patterns and shapes using different fractions!',
          successCriteria: 'Create 3 different fraction-based designs',
          content: {
            creativePrompt: 'Use circles, squares, and triangles divided into fractions to make art!'
          }
        }
      );
      break;

    default:
      // Generic math activities
      activities.push(
        {
          id: 'math-explorer',
          type: 'exploration',
          title: `${topic} Explorer`,
          description: `Discover the world of ${topic}`,
          duration: 240,
          difficulty: Math.min(gradeLevel, 3),
          points: 20,
          instructions: `Learn about ${topic} through interactive examples!`,
          successCriteria: 'Complete all exploration tasks',
          content: {
            explorationTask: `Interactive exploration of ${topic} concepts`
          }
        }
      );
  }

  return activities;
};

const generateAdditionProblems = (gradeLevel: number) => {
  const problems = [];
  const maxNumber = gradeLevel <= 2 ? 20 : gradeLevel <= 4 ? 100 : 1000;
  
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * maxNumber);
    const b = Math.floor(Math.random() * maxNumber);
    problems.push({ a, b, answer: a + b });
  }
  
  return problems;
};

const generateMagicSquare = (gradeLevel: number) => {
  // Simple 3x3 magic square for demonstration
  const baseSquare = [
    [2, 7, 6],
    [9, 5, 1],
    [4, 3, 8]
  ];
  
  // Scale based on grade level
  const multiplier = gradeLevel <= 3 ? 1 : gradeLevel <= 5 ? 2 : 3;
  return baseSquare.map(row => row.map(cell => cell * multiplier));
};

interface MathInteractiveTemplateProps {
  topic: string;
  gradeLevel: number;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const MathInteractiveTemplate = ({ topic, gradeLevel, onComplete, onBack }: MathInteractiveTemplateProps) => {
  const activities = createMathInteractiveLesson(topic, gradeLevel);

  return (
    <InteractiveLessonTemplate
      subject="Mathematics"
      topic={topic}
      activities={activities}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
};

export default MathInteractiveTemplate;
