
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import MathematicsWelcome from './welcome/MathematicsWelcome';
import EnglishWelcome from './welcome/EnglishWelcome';
import ScienceWelcome from './welcome/ScienceWelcome';
import ComputerScienceWelcome from './welcome/ComputerScienceWelcome';
import MusicWelcome from './welcome/MusicWelcome';
import CreativeArtsWelcome from './welcome/CreativeArtsWelcome';
import AILearningModule from '@/components/adaptive-learning/AILearningModule';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({ subject, skillArea, studentName, onBackToProgram }: UnifiedLessonManagerProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user } = useAuth();
  const classroomConfig = getClassroomConfig(subject);

  const handleStartLesson = () => {
    setShowWelcome(false);
  };

  const renderWelcome = () => {
    const welcomeProps = {
      onStartLesson: handleStartLesson,
      studentName: user?.user_metadata?.first_name || studentName
    };

    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
        return <MathematicsWelcome {...welcomeProps} />;
      case 'english':
        return <EnglishWelcome {...welcomeProps} />;
      case 'science':
        return <ScienceWelcome {...welcomeProps} />;
      case 'computer_science':
      case 'computer-science':
        return <ComputerScienceWelcome {...welcomeProps} />;
      case 'music':
        return <MusicWelcome {...welcomeProps} />;
      case 'creative_arts':
      case 'creative-arts':
        return <CreativeArtsWelcome {...welcomeProps} />;
      default:
        return <MathematicsWelcome {...welcomeProps} />;
    }
  };

  if (showWelcome) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center">
          {renderWelcome()}
        </div>
      </ClassroomEnvironment>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AILearningModule 
        subject={subject} 
        skillArea={skillArea} 
        difficultyLevel={1}
        onBack={onBackToProgram}
      />
    </div>
  );
};

export default UnifiedLessonManager;
