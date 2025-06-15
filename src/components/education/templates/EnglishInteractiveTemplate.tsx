
import InteractiveLessonTemplate, { InteractiveActivity } from './InteractiveLessonTemplate';

export const createEnglishInteractiveLesson = (topic: string, gradeLevel: number): InteractiveActivity[] => {
  const activities: InteractiveActivity[] = [];

  switch (topic.toLowerCase()) {
    case 'reading comprehension':
    case 'reading':
      activities.push(
        {
          id: 'story-adventure',
          type: 'exploration',
          title: 'Interactive Story Adventure',
          description: 'Choose your own adventure while practicing reading skills!',
          duration: 360,
          difficulty: Math.min(Math.max(gradeLevel, 1), 4) as 1 | 2 | 3 | 4,
          points: 30,
          instructions: 'Read carefully and make choices that affect the story outcome!',
          successCriteria: 'Complete the story and answer comprehension questions',
          content: {
            explorationTask: 'Interactive branching story with embedded comprehension questions'
          }
        },
        {
          id: 'character-analyzer',
          type: 'puzzle',
          title: 'Character Detective',
          description: 'Analyze characters and their motivations!',
          duration: 240,
          difficulty: 3,
          points: 25,
          instructions: 'Gather clues about characters from text evidence!',
          successCriteria: 'Successfully profile 3 different characters',
          content: {
            puzzleDescription: 'Text analysis game with character trait matching'
          }
        }
      );
      break;

    case 'writing':
    case 'creative writing':
      activities.push(
        {
          id: 'story-builder',
          type: 'creative',
          title: 'Digital Story Studio',
          description: 'Create multimedia stories with text, images, and sounds!',
          duration: 450,
          difficulty: 2,
          points: 40,
          instructions: 'Write a story and enhance it with multimedia elements!',
          successCriteria: 'Complete a story with beginning, middle, end, and multimedia',
          content: {
            creativePrompt: 'Drag-and-drop story builder with character templates, settings, and plot helpers'
          }
        },
        {
          id: 'grammar-game',
          type: 'mini-game',
          title: 'Grammar Ninja Challenge',
          description: 'Slice through grammar mistakes like a ninja!',
          duration: 180,
          difficulty: Math.min(Math.max(gradeLevel, 1), 3) as 1 | 2 | 3,
          points: 20,
          instructions: 'Find and fix grammar mistakes as quickly as possible!',
          successCriteria: 'Fix 15 grammar mistakes correctly',
          content: {
            gameDescription: 'Fast-paced grammar correction with ninja theme'
          }
        }
      );
      break;

    case 'vocabulary':
      activities.push(
        {
          id: 'word-explorer',
          type: 'exploration',
          title: 'Vocabulary Treasure Hunt',
          description: 'Discover new words and their meanings through context!',
          duration: 300,
          difficulty: 2,
          points: 25,
          instructions: 'Explore different scenarios to learn new vocabulary in context!',
          successCriteria: 'Learn and use 10 new vocabulary words correctly',
          content: {
            explorationTask: 'Interactive scenarios with vocabulary discovery and context clues'
          }
        },
        {
          id: 'word-artist',
          type: 'creative',
          title: 'Visual Vocabulary Creator',
          description: 'Create visual representations of vocabulary words!',
          duration: 240,
          difficulty: 2,
          points: 30,
          instructions: 'Draw, animate, or design visual meanings for new words!',
          successCriteria: 'Create visual representations for 8 vocabulary words',
          content: {
            creativePrompt: 'Digital art tools for creating word visualizations and memory aids'
          }
        }
      );
      break;

    default:
      activities.push(
        {
          id: 'english-quest',
          type: 'quiz',
          title: `${topic} Knowledge Quiz`,
          description: `Test your understanding of ${topic}`,
          duration: 180,
          difficulty: Math.min(Math.max(gradeLevel, 1), 4) as 1 | 2 | 3 | 4,
          points: 20,
          instructions: `Answer questions about ${topic} concepts!`,
          successCriteria: 'Score 80% or higher on the quiz',
          content: {
            question: `What is the main idea of ${topic}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: `The main idea involves understanding ${topic} fundamentals.`
          }
        }
      );
  }

  return activities;
};

interface EnglishInteractiveTemplateProps {
  topic: string;
  gradeLevel: number;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const EnglishInteractiveTemplate = ({ topic, gradeLevel, onComplete, onBack }: EnglishInteractiveTemplateProps) => {
  const activities = createEnglishInteractiveLesson(topic, gradeLevel);

  return (
    <InteractiveLessonTemplate
      subject="English Language Arts"
      topic={topic}
      activities={activities}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
};

export default EnglishInteractiveTemplate;
