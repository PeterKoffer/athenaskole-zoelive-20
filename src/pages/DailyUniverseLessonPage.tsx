import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';
import { useUnifiedLesson } from '@/components/education/contexts/UnifiedLessonContext';
import { DevLessonQA } from '@/components/dev/DevLessonQA';
import { canonicalizeSubject } from '@/utils/subjectMap';
import { resolveCurriculumTargets } from '@/utils/curriculumTargets';
import { getSessionId } from '@/utils/session';
import { resolveCountryFlag } from '@/utils/country';
import { getDevCountryOverride, setDevCountryOverride } from '@/utils/devCountry';
import { logEvent } from '@/services/telemetry/events';
import { useDevThrottleClick } from '@/hooks/useDevThrottleClick';

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
  const sessionId = getSessionId();
  const seqKey = `nelie_regen_seq:${sessionId}`;
  const [regenSeq, setRegenSeq] = React.useState<number>(() => Number(typeof window !== 'undefined' ? window.localStorage.getItem(seqKey) ?? 0 : 0));
  const [devRemountKey, setDevRemountKey] = React.useState(0);
  
  const throttle = useDevThrottleClick(600);
  const onRegenerate = React.useMemo(() => throttle(() => {
    const next = (regenSeq ?? 0) + 1;
    setRegenSeq(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(seqKey, String(next));
    logEvent("dev_regenerate_clicked", { seq: next, throttleMs: 600, session_id: sessionId });
    setDevRemountKey(k => k + 1);
  }), [regenSeq, seqKey, sessionId, throttle]);

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
  const DevBadge: React.FC<{ subject: string; gradeLevel?: number; onRegenerate?: () => void; busy?: boolean; regenSeq?: number }> = ({ subject, gradeLevel, onRegenerate, busy, regenSeq }) => {
    const { targetDuration } = useUnifiedLesson();
    const targets = React.useMemo(
      () => resolveCurriculumTargets({ subject, gradeBand: String(gradeLevel ?? 6) }),
      [subject, gradeLevel]
    );
    const ver = (import.meta as any)?.env?.VITE_PROMPT_VERSION || 'v1';
    const requestedOverride = getDevCountryOverride();
    const resolvedCountry = resolveCountryFlag(requestedOverride) ?? 'EN';
    return (
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
            AI ✓ Planner→Activities — {targetDuration ?? 150} min · v{ver}
            {" · s:"}{(typeof window !== 'undefined' ? getSessionId().slice(0, 8) : 'nosess')}
            {" · "}{resolvedCountry}
            {typeof regenSeq === 'number' ? <> · regen #{regenSeq}</> : null}
          </span>
          {/* DEV-only country toggle (per-session). EN = default (no override). */}
          <select
            className="text-[11px] border rounded px-1 py-0.5"
            value={getDevCountryOverride() ?? ""}
            onChange={async (e) => {
              const v = (e.target.value || "") as "" | "DK";
              setDevCountryOverride(v || undefined);
              await logEvent("dev_country_override_set", { value: v || "EN" });
            }}
            title="DEV: Override country for this session"
          >
            <option value="">EN (default)</option>
            <option value="DK">DK</option>
          </select>
          {import.meta.env.DEV && (
            <a
              className="ml-2 text-[11px] underline opacity-80 hover:opacity-100"
              href={`/dev/events?session=${encodeURIComponent(typeof window !== 'undefined' ? getSessionId() : '')}`}
              title="Open Dev Events"
            >
              events
            </a>
          )}
          <button
            className="text-[11px] border rounded px-2 py-0.5 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onRegenerate}
            disabled={!!busy}
            title={busy ? "Generating…" : "DEV: Remount lesson to force a fresh generation"}
          >
            Regenerate
          </button>
        </div>
        {targets?.length ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            Targets: {targets.slice(0, 3).join(' · ')}
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
            <DevBadge subject={resolvedSubject} gradeLevel={state?.gradeLevel} onRegenerate={onRegenerate} regenSeq={regenSeq} />
            <DevQAFromContext />
          </div>
        )}
        <EnhancedLessonManager
          key={`dev-remount-${devRemountKey}`}
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
