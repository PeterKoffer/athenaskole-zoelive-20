
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth'; // Import UserMetadata
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import MathematicsWelcome from './welcome/MathematicsWelcome';
import { EnglishWelcome } from './welcome/EnglishWelcome';
import { ScienceWelcome } from './welcome/ScienceWelcome';
import { ComputerScienceWelcome } from './welcome/ComputerScienceWelcome';
import { MusicWelcome } from './welcome/MusicWelcome';
import { CreativeArtsWelcome } from './welcome/CreativeArtsWelcome';
import { BodyLabWelcome } from './welcome/BodyLabWelcome';
import { MentalWellnessWelcome } from './welcome/MentalWellnessWelcome';
import { LanguageLabWelcome } from './welcome/LanguageLabWelcome';
import { HistoryReligionWelcome } from './welcome/HistoryReligionWelcome';
import { GeographyWelcome } from './welcome/GeographyWelcome';
import { LifeEssentialsWelcome } from './welcome/LifeEssentialsWelcome';
import ImprovedLearningSession from '@/components/adaptive-learning/components/ImprovedLearningSession';
import MathLessonHeader from './math/MathLessonHeader';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({ subject, skillArea, studentName, onBackToProgram }: UnifiedLessonManagerProps) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const { user } = useAuth();
  const classroomConfig = getClassroomConfig(subject);

  console.log('🎓 UnifiedLessonManager state:', {
    subject,
    skillArea,
    showWelcome,
    studentName: (user?.user_metadata as UserMetadata)?.first_name || studentName,
    timestamp: new Date().toISOString()
  });

  const handleStartLesson = () => {
    console.log('🚀 Starting lesson - transitioning from welcome to main content');
    setShowWelcome(false);
  };

  const renderWelcome = () => {
    const welcomeProps = {
      onStartLesson: handleStartLesson,
      studentName: (user?.user_metadata as UserMetadata)?.first_name || studentName
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
      case 'body_lab':
      case 'body-lab':
        return <BodyLabWelcome {...welcomeProps} />;
      case 'mental_wellness':
      case 'mental-wellness':
        return <MentalWellnessWelcome {...welcomeProps} />;
      case 'language_lab':
      case 'language-lab':
        return <LanguageLabWelcome {...welcomeProps} />;
      case 'history_religion':
      case 'history-religion':
        return <HistoryReligionWelcome {...welcomeProps} />;
      case 'geography':
        return <GeographyWelcome {...welcomeProps} />;
      case 'life_essentials':
      case 'life-essentials':
        return <LifeEssentialsWelcome {...welcomeProps} />;
      default:
        console.log('⚠️ Unknown subject, defaulting to MathematicsWelcome for:', subject);
        return <MathematicsWelcome {...welcomeProps} />;
    }
  };

  // Always show welcome screen first
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

  // Show main lesson content with proper scoreboard for mathematics
  console.log('📚 Displaying main lesson content for', subject, 'at', new Date().toISOString());
  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-4 px-2">
        {/* Add MathLessonHeader with scoreboard for mathematics */}
        {subject.toLowerCase() === 'mathematics' && (
          <MathLessonHeader
            studentName={(user?.user_metadata as UserMetadata)?.first_name || studentName}
            timeElapsed={timeElapsed}
            targetLessonLength={20}
            score={score}
            currentActivityIndex={0}
            totalRealActivities={6}
            correctStreak={correctStreak}
            onBackToProgram={onBackToProgram}
            canNavigateBack={false}
            canNavigateForward={true}
            currentActivityType="interactive-question"
            currentActivityPhase="active"
          />
        )}
        
        <div className="flex items-center justify-center">
          <ImprovedLearningSession
            subject={subject}
            skillArea={skillArea}
            difficultyLevel={2}
            onBack={onBackToProgram}
          />
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedLessonManager;
