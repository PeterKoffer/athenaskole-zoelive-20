
import MathInteractiveTemplate from './MathInteractiveTemplate';
import ScienceInteractiveTemplate from './ScienceInteractiveTemplate';
import EnglishInteractiveTemplate from './EnglishInteractiveTemplate';
import InteractiveLessonTemplate, { InteractiveActivity } from './InteractiveLessonTemplate';

// Generic template for any subject
const createGenericInteractiveLesson = (subject: string, topic: string, gradeLevel: number): InteractiveActivity[] => {
  return [
    {
      id: `${subject.toLowerCase()}-intro`,
      type: 'exploration',
      title: `Welcome to ${topic}`,
      description: `Let's explore the exciting world of ${topic}!`,
      duration: 180,
      difficulty: Math.min(gradeLevel, 3),
      points: 15,
      instructions: `Discover key concepts and ideas about ${topic}`,
      successCriteria: 'Complete the introduction exploration',
      content: {
        explorationTask: `Interactive introduction to ${topic} with engaging multimedia content`
      }
    },
    {
      id: `${subject.toLowerCase()}-practice`,
      type: 'quiz',
      title: `${topic} Knowledge Check`,
      description: 'Test what you\'ve learned so far!',
      duration: 240,
      difficulty: 2,
      points: 20,
      instructions: 'Answer questions to check your understanding',
      successCriteria: 'Score 70% or higher',
      content: {
        question: `What is an important concept in ${topic}?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
        correctAnswer: 3,
        explanation: `${topic} involves multiple interconnected concepts that work together.`
      }
    },
    {
      id: `${subject.toLowerCase()}-creative`,
      type: 'creative',
      title: `${topic} Creative Project`,
      description: 'Express your learning through creativity!',
      duration: 300,
      difficulty: 2,
      points: 30,
      instructions: `Create something original that demonstrates your understanding of ${topic}`,
      successCriteria: 'Complete a creative project showing understanding',
      content: {
        creativePrompt: `Use various tools and media to create a project about ${topic}`
      }
    },
    {
      id: `${subject.toLowerCase()}-challenge`,
      type: 'puzzle',
      title: `${topic} Master Challenge`,
      description: 'Put your knowledge to the ultimate test!',
      duration: 360,
      difficulty: Math.min(gradeLevel, 4),
      points: 40,
      instructions: 'Solve complex problems using everything you\'ve learned',
      successCriteria: 'Successfully complete the master challenge',
      content: {
        puzzleDescription: `Advanced challenge combining multiple ${topic} concepts`
      }
    }
  ];
};

interface SubjectTemplateFactoryProps {
  subject: string;
  topic: string;
  gradeLevel: number;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const SubjectTemplateFactory = ({ 
  subject, 
  topic, 
  gradeLevel, 
  onComplete, 
  onBack 
}: SubjectTemplateFactoryProps) => {
  // Route to specific subject templates
  switch (subject.toLowerCase()) {
    case 'math':
    case 'mathematics':
      return (
        <MathInteractiveTemplate 
          topic={topic}
          gradeLevel={gradeLevel}
          onComplete={onComplete}
          onBack={onBack}
        />
      );
      
    case 'science':
      return (
        <ScienceInteractiveTemplate 
          topic={topic}
          gradeLevel={gradeLevel}
          onComplete={onComplete}
          onBack={onBack}
        />
      );
      
    case 'english':
    case 'english language arts':
    case 'ela':
      return (
        <EnglishInteractiveTemplate 
          topic={topic}
          gradeLevel={gradeLevel}
          onComplete={onComplete}
          onBack={onBack}
        />
      );
      
    // Add more subjects as needed
    case 'history':
    case 'social studies':
    case 'geography':
    case 'art':
    case 'music':
    case 'physical education':
    case 'computer science':
    default:
      // Use generic template for any subject not specifically implemented
      const activities = createGenericInteractiveLesson(subject, topic, gradeLevel);
      return (
        <InteractiveLessonTemplate
          subject={subject}
          topic={topic}
          activities={activities}
          onComplete={onComplete}
          onBack={onBack}
        />
      );
  }
};

export default SubjectTemplateFactory;
