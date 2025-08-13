import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';
import { canonicalizeSubject } from '@/utils/subjectMap';
import { getSessionId } from '@/utils/session';
import { resolveCountryFlag } from '@/utils/country';
import { getDevCountryOverride } from '@/utils/devCountry';
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
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(seqKey, String(next));
      // Clear lesson cache to force regeneration
      const cacheKey = 'daily_lesson_cache';
      const cache = window.localStorage.getItem(cacheKey);
      if (cache) {
        try {
          // Clear all entries to force fresh generation
          window.localStorage.setItem(cacheKey, JSON.stringify({}));
          console.log('🗑️ Cleared lesson cache for regeneration');
        } catch (e) {
          console.warn('Error clearing lesson cache:', e);
        }
      }
    }
    const requested = getDevCountryOverride() ?? "EN";
    const resolved = resolveCountryFlag(requested) ?? 'EN';
    const promptVersion = (import.meta as any)?.env?.VITE_PROMPT_VERSION ?? 'v1';
    logEvent("dev_regenerate_clicked", {
      seq: next,
      throttleMs: 600,
      session_id: sessionId,
      reason: "manual",
      requestedCountry: requested,
      resolvedCountry: resolved,
      promptVersion
    });
    setDevRemountKey(k => k + 1);
  }), [regenSeq, seqKey, sessionId, throttle]);

  if (!universe) {
    navigate('/daily-program');
    return null;
  }

  const resolvedSubject = canonicalizeSubject(universe.theme);

  return (
    <UnifiedLessonProvider
      subject={resolvedSubject}
      skillArea={'general'}
      gradeLevel={state?.gradeLevel}
      onLessonComplete={() => navigate('/daily-program')}
    >
      <>
        {/* Simplified dev info - only show in DEV and much cleaner */}
        {import.meta.env.DEV && (
          <div className="mb-2 text-center">
            <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-muted-foreground">
              DEV: {resolveCountryFlag(getDevCountryOverride()) ?? 'EN'} · v{(import.meta as any)?.env?.VITE_PROMPT_VERSION || 'v1'}
              {typeof regenSeq === 'number' ? ` · #${regenSeq}` : ''}
              <button
                className="ml-2 px-2 py-0.5 rounded border text-xs hover:bg-secondary/30 disabled:opacity-50"
                onClick={onRegenerate}
                disabled={false}
                title="Regenerate lesson"
              >
                ↻
              </button>
            </span>
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
