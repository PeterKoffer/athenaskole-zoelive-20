
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import UniversalLearningIntroduction from './components/universal/UniversalLearningIntroduction';
import UniversalLearningLoading from './components/universal/UniversalLearningLoading';
import UnifiedLessonManager from './components/UnifiedLessonManager';
import ClassroomEnvironment from './components/shared/ClassroomEnvironment';
import { getClassroomConfig } from './components/shared/classroomConfigs';

interface UniversalLearningProps {
  subject: string;
  skillArea: string;
}

const UniversalLearning = ({ subject, skillArea }: UniversalLearningProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [isStartingLesson, setIsStartingLesson] = useState(false);
  const classroomConfig = getClassroomConfig(subject);

  console.log('🎓 UniversalLearning:', { subject, skillArea, showIntroduction, user: !!user });
  console.log('🔍 UniversalLearning component rendered at:', new Date().toISOString());

  const metadata = user?.user_metadata as UserMetadata | undefined;
  const studentName = metadata?.first_name || metadata?.name?.split(' ')[0] || 'Student';

  const handleIntroductionComplete = () => {
    console.log('✅ Introduction completed, starting lesson');
    setIsStartingLesson(true);
    
    // Small delay to show loading state, then proceed to lesson
    setTimeout(() => {
      setShowIntroduction(false);
      setIsStartingLesson(false);
    }, 1500);
  };

  const handleBackToTrainingGround = () => {
    console.log('🔙 Navigating back to Training Ground');
    navigate('/training-ground');
  };

  if (loading) {
    return <UniversalLearningLoading subject={subject} studentName={studentName} />;
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Show introduction page first (like in the screenshot)
  if (showIntroduction) {
    if (isStartingLesson) {
      return <UniversalLearningLoading subject={subject} studentName={studentName} />;
    }
    
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <UniversalLearningIntroduction
          subject={subject}
          skillArea={skillArea}
          onIntroductionComplete={handleIntroductionComplete}
        />
      </ClassroomEnvironment>
    );
  }

  // After introduction, show the actual learning content
  return (
    <ClassroomEnvironment config={classroomConfig}>
      <UnifiedLessonManager
        subject={subject}
        skillArea={skillArea}
        studentName={studentName}
        onBackToProgram={handleBackToTrainingGround}
      />
    </ClassroomEnvironment>
  );
};

export default UniversalLearning;
