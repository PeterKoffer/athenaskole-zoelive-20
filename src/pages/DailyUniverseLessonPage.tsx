import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';
import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';
import { DevLessonQA } from '@/components/dev/DevLessonQA';
import { canonicalizeSubject } from '@/utils/subjectMap';
import { resolveCurriculumTargets } from '@/utils/curriculumTargets';

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

  // Dev-only: badge with duration, prompt version and first DK targets
  const DevBadge: React.FC<{ subject: string; gradeLevel?: number }> = ({ subject, gradeLevel }) => {
    const { targetDuration } = useUnifiedLesson();
    const targets = React.useMemo(
      () => resolveCurriculumTargets({ subject, gradeBand: String(gradeLevel ?? 6), country: 'DK' }),
      [subject, gradeLevel]
    );
    const ver = (import.meta as any)?.env?.VITE_PROMPT_VERSION || 'v1';
    return (
      <div className="mb-2">
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
          AI ✓ Planner→Activities — {targetDuration ?? 150} min · v{ver}
        </span>
        {targets?.length ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            Targets (DK): {targets.slice(0, 3).join(' · ')}
          </div>
        ) : null}
      </div>
    );
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
            <DevBadge subject={resolvedSubject} gradeLevel={state?.gradeLevel} />
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
