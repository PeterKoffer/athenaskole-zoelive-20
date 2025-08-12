import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';
import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';
import { DevLessonQA } from '@/components/dev/DevLessonQA';
import { canonicalizeSubject } from '@/utils/subjectMap';

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

  const resolvedSubject = canonicalizeSubject(universe.theme);

  // Dev-only: derive lesson object from context for QA panel
  const DevQAFromContext: React.FC = () => {
    const { allActivities, targetDuration } = useUnifiedLesson();
    const lesson = React.useMemo(() => ({
      activities: allActivities,
      meta: { durationMin: targetDuration }
    }), [allActivities, targetDuration]);
    return import.meta.env.DEV ? <DevLessonQA lesson={lesson} /> : null;
  };
  return (
    <UnifiedLessonProvider
      subject={resolvedSubject}
      skillArea={'general'}
      gradeLevel={state?.gradeLevel}
      onLessonComplete={() => navigate('/daily-program')}
    >
      <>
        {import.meta.env.DEV && (
          <div className="mb-2">
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
              AI ✓ Planner→Activities — 150 min
            </span>
            <DevQAFromContext />
          </div>
        )}
        <EnhancedLessonManager
          subject={resolvedSubject}
          skillArea="general"
          onBackToProgram={() => navigate('/daily-program')}
          hideActivityCount
        />
      </>
    </UnifiedLessonProvider>
  );
};

export default DailyUniverseLessonPage;
