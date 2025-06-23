
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
import ImprovedLearningSession from '@/components/adaptive-learning/components/ImprovedLearningSession';

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

  console.log('🎓 UnifiedLessonManager state:', {
    subject,
    skillArea,
    showWelcome,
    studentName: user?.user_metadata?.first_name || studentName,
    timestamp: new Date().toISOString()
  });

  const handleStartLesson = () => {
    console.log('🚀 Starting lesson - transitioning from welcome to main content');
    setShowWelcome(false);
  };

  const renderWelcome = () => {
    const welcomeProps = {
      onStartLesson: handleStartLesson,
      studentName: user?.user_metadata?.first_name || studentName
    };

    console.log('📝 Rendering welcome for subject:', subject.toLowerCase());

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
        console.log('⚠️ Unknown subject, defaulting to MathematicsWelcome');
        return <MathematicsWelcome {...welcomeProps} />;
    }
  };

  // Always show welcome screen first - this is the main issue
  if (showWelcome) {
    console.log('👋 Displaying welcome screen for', subject, 'at', new Date().toISOString());
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center">
          {renderWelcome()}
        </div>
      </ClassroomEnvironment>
    );
  }

  // Show main lesson content using ImprovedLearningSession
  console.log('📚 Displaying main lesson content for', subject, 'at', new Date().toISOString());
  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-10 px-2 flex items-center justify-center">
        <ImprovedLearningSession
          subject={subject}
          skillArea={skillArea}
          difficultyLevel={2}
          onBack={onBackToProgram}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedLessonManager;
