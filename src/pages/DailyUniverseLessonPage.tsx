import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import { MathLearningContent } from '@/components/education/components/math/MathLearningContent';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';


interface LocationState {
  universe?: Universe;
  gradeLevel?: number;
}

const DailyUniverseLessonPage: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // not used
  const location = useLocation();
  const state = location.state as LocationState | null;
  const universe = state?.universe;
  // gradeLevel handled by lesson manager

  if (!universe) {
    navigate('/daily-program');
    return null;
  }

  return (
    <UnifiedLessonProvider
      subject={universe?.theme || 'general'}
      gradeLevel={state?.gradeLevel}
      onLessonComplete={() => navigate('/daily-program')}
    >
      <MathLearningContent onBackToProgram={() => navigate('/daily-program')} />
    </UnifiedLessonProvider>
  );
};

export default DailyUniverseLessonPage;
