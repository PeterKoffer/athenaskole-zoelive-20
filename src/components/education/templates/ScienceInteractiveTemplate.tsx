
import InteractiveLessonTemplate, { InteractiveActivity } from './InteractiveLessonTemplate';

export const createScienceInteractiveLesson = (topic: string, gradeLevel: number): InteractiveActivity[] => {
  const activities: InteractiveActivity[] = [];

  switch (topic.toLowerCase()) {
    case 'solar system':
    case 'space':
      activities.push(
        {
          id: 'planet-explorer',
          type: 'exploration',
          title: 'Planet Explorer Mission',
          description: 'Journey through our solar system and discover each planet!',
          duration: 300,
          difficulty: 2,
          points: 25,
          instructions: 'Click on each planet to learn about its unique characteristics!',
          successCriteria: 'Visit all 8 planets and complete their challenges',
          content: {
            explorationTask: 'Interactive solar system with clickable planets, each revealing facts, videos, and mini-challenges'
          }
        },
        {
          id: 'space-lab',
          type: 'simulation',
          title: 'Virtual Space Laboratory',
          description: 'Conduct experiments in zero gravity!',
          duration: 240,
          difficulty: 3,
          points: 30,
          instructions: 'Run virtual experiments to understand how space affects different materials and processes!',
          successCriteria: 'Complete 3 space experiments successfully',
          content: {
            simulationDescription: 'Interactive lab with gravity controls, material testing, and space phenomena'
          }
        },
        {
          id: 'rocket-builder',
          type: 'creative',
          title: 'Design Your Space Mission',
          description: 'Build and launch your own space mission!',
          duration: 360,
          difficulty: 4,
          points: 40,
          instructions: 'Design a rocket, choose your destination, and plan your mission timeline!',
          successCriteria: 'Create a complete mission plan with working rocket design',
          content: {
            creativePrompt: 'Use drag-and-drop tools to build rockets, select crew, and plan exploration routes'
          }
        }
      );
      break;

    case 'human body':
    case 'anatomy':
      activities.push(
        {
          id: 'body-systems',
          type: 'exploration',
          title: 'Amazing Body Systems',
          description: 'Explore how your body systems work together!',
          duration: 300,
          difficulty: 2,
          points: 25,
          instructions: 'Navigate through different body systems and discover their functions!',
          successCriteria: 'Learn about all major body systems',
          content: {
            explorationTask: '3D interactive human body with layered systems'
          }
        },
        {
          id: 'heart-simulator',
          type: 'simulation',
          title: 'Heart Beat Simulator',
          description: 'See how your heart pumps blood through your body!',
          duration: 180,
          difficulty: 3,
          points: 20,
          instructions: 'Control heart rate and observe blood flow changes!',
          successCriteria: 'Successfully demonstrate 3 different heart rate scenarios',
          content: {
            simulationDescription: 'Interactive heart model with controllable parameters'
          }
        }
      );
      break;

    case 'plants':
    case 'botany':
      activities.push(
        {
          id: 'plant-growth',
          type: 'simulation',
          title: 'Virtual Garden Lab',
          description: 'Grow plants and discover what they need to thrive!',
          duration: 300,
          difficulty: 2,
          points: 25,
          instructions: 'Adjust water, sunlight, and nutrients to grow healthy plants!',
          successCriteria: 'Successfully grow 3 different types of plants',
          content: {
            simulationDescription: 'Time-lapse plant growth with environmental controls'
          }
        },
        {
          id: 'ecosystem-builder',
          type: 'creative',
          title: 'Build Your Ecosystem',
          description: 'Create a balanced ecosystem with plants and animals!',
          duration: 400,
          difficulty: 3,
          points: 35,
          instructions: 'Choose organisms and arrange them to create a stable food web!',
          successCriteria: 'Create 2 different balanced ecosystems',
          content: {
            creativePrompt: 'Drag and drop organisms to build food chains and energy flows'
          }
        }
      );
      break;

    default:
      activities.push(
        {
          id: 'science-mystery',
          type: 'puzzle',
          title: `${topic} Mystery Challenge`,
          description: `Solve scientific puzzles about ${topic}`,
          duration: 240,
          difficulty: Math.min(Math.max(gradeLevel, 1), 4) as 1 | 2 | 3 | 4,
          points: 20,
          instructions: `Use scientific thinking to solve ${topic} challenges!`,
          successCriteria: 'Solve the scientific mystery',
          content: {
            puzzleDescription: `Interactive puzzle combining ${topic} concepts`
          }
        }
      );
  }

  return activities;
};

interface ScienceInteractiveTemplateProps {
  topic: string;
  gradeLevel: number;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const ScienceInteractiveTemplate = ({ topic, gradeLevel, onComplete, onBack }: ScienceInteractiveTemplateProps) => {
  const activities = createScienceInteractiveLesson(topic, gradeLevel);

  return (
    <InteractiveLessonTemplate
      subject="Science"
      topic={topic}
      activities={activities}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
};

export default ScienceInteractiveTemplate;
