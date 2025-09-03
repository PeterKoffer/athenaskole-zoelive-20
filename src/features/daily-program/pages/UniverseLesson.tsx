import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import MultiSubjectLessonTemplate from '@/components/education/templates/MultiSubjectLessonTemplate';
import { useAuth } from '@/hooks/useAuth';

interface LocationState {
  universe?: Universe;
  gradeLevel?: number;
}

const DailyUniverseLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const universe = state?.universe;
  const grade = state?.gradeLevel || (user?.user_metadata as any)?.grade_level || 6;

  if (!universe) {
    navigate('/daily-program');
    return null;
  }

  return (
    <MultiSubjectLessonTemplate
      topic={universe.theme || universe.title}
      gradeLevel={grade}
      onComplete={() => navigate('/daily-program')}
      onBack={() => navigate('/daily-program')}
    />
  );
};

export default DailyUniverseLessonPage;
