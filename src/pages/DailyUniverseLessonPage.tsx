import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
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
      subject={universe?.theme || 'adventure'}
      skillArea={'general'}
      gradeLevel={state?.gradeLevel}
      onLessonComplete={() => navigate('/daily-program')}
    >
      <EnhancedLessonManager
        subject={universe?.theme || 'adventure'}
        skillArea="general"
        onBackToProgram={() => navigate('/daily-program')}
      />
    </UnifiedLessonProvider>
  );
};

export default DailyUniverseLessonPage;
