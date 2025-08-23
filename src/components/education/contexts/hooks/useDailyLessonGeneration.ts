
// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LessonActivity } from '../../components/types/LessonTypes';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';
import { dynamicLessonExtender } from '@/services/dynamicLessonExtender';
import { DEFAULT_DAILY_UNIVERSE_MINUTES } from '@/constants/lesson';
import { logEvent } from '@/services/telemetry/events';
import { generateActivityImage } from '@/services/media/imagePrefetch';
function rebalanceDurationsSeconds(activities: LessonActivity[], targetMin: number): LessonActivity[] {
  try {
    const acts = activities.map(a => ({ ...a }));
    const mins = acts.map(a => Math.max(0, Math.round((a.duration || 0) / 60)));
    const sum = mins.reduce((s, m) => s + m, 0);
    const target = Math.max(3, Number(targetMin) || 150);
    let diff = target - sum;
    if (!acts.length || Math.abs(diff) <= 1) return acts;
    const step = diff > 0 ? 1 : -1;
    let i = 0;
    while (diff !== 0 && acts.length > 0) {
      const idx = i % acts.length;
      const m = Math.max(3, mins[idx] + step);
      mins[idx] = m;
      acts[idx].duration = m * 60;
      diff -= step;
      i++;
      if (i > 2000) break; // safety
    }
    return acts;
  } catch {
    return activities;
  }
}


interface DynamicContentRequest {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  timeElapsed: number;
  currentScore: number;
  correctStreak: number;
  usedQuestionIds: string[];
  targetDuration: number;
}

interface UseDailyLessonGenerationProps {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  staticActivities: LessonActivity[];
}

export const useDailyLessonGeneration = ({
  subject,
  skillArea,
  gradeLevel,
  staticActivities
}: UseDailyLessonGenerationProps) => {
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<LessonActivity[]>(staticActivities);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lastGeneratedDate, setLastGeneratedDate] = useState<string>('');
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [isExtending, setIsExtending] = useState(false);
  const [busySlots, setBusySlots] = useState<Set<string>>(new Set());
  const acRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      try { acRef.current?.abort(); } catch {}
    };
  }, []);

  const withAbort = useCallback(async (fn: (signal: AbortSignal) => Promise<any>) => {
    try { acRef.current?.abort(); } catch {}
    const ac = new AbortController();
    acRef.current = ac;
    return fn(ac.signal);
  }, []);


  // Target lesson duration in minutes
  const TARGET_LESSON_DURATION = DEFAULT_DAILY_UNIVERSE_MINUTES;

  // Get today's date for lesson generation
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // Generate daily lesson based on curriculum and student progress
  const generateDailyLesson = useCallback(async (forceRegenerate = false) => {
    if (!user?.id) {
      console.log('⚠️ No user available, using static activities');
      setAllActivities(staticActivities);
      setIsLoadingActivities(false);
      return;
    }

    const currentDate = getCurrentDate();
    
    // Check if we need to generate a new lesson
    if (!forceRegenerate && lastGeneratedDate === currentDate && allActivities.length > 0) {
      console.log('📚 Using existing lesson for today');
      setIsLoadingActivities(false);
      return;
    }

    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    setIsLoadingActivities(true);

    try {
      // Clear cache if force regenerating
      if (forceRegenerate) {
        dailyLessonGenerator.clearTodaysLesson(user.id, subject, currentDate);
        setUsedQuestionIds([]);
      }

      const newActivities = await dailyLessonGenerator.generateDailyLesson({
        subject,
        skillArea,
        userId: user.id,
        gradeLevel: gradeLevel || 6,
        currentDate
      });

      console.log(`✅ Generated ${newActivities.length} new activities for ${subject}`);
      setAllActivities(newActivities);
      setLastGeneratedDate(currentDate);
      
    } catch (error) {
      console.error('❌ Failed to generate daily lesson, using fallback:', error);
      // Fallback to static activities if generation fails
      setAllActivities(staticActivities.length > 0 ? staticActivities : []);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [user?.id, subject, skillArea, gradeLevel, staticActivities, lastGeneratedDate, allActivities.length]);

  // Extend lesson dynamically based on time and engagement
  const extendLessonDynamically = useCallback(async (
    timeElapsed: number,
    currentScore: number,
    correctStreak: number,
    engagementLevel: number = 85
  ) => {
    if (!user?.id || isExtending) return;

    const shouldExtend = dynamicLessonExtender.shouldExtendLesson(
      timeElapsed,
      currentScore,
      correctStreak,
      engagementLevel
    );

    if (!shouldExtend) return;

    console.log('🚀 Extending lesson with dynamic content...');
    setIsExtending(true);

    try {
      const extensionRequest: DynamicContentRequest = {
        subject,
        skillArea,
        gradeLevel,
        timeElapsed,
        currentScore,
        correctStreak,
        usedQuestionIds,
        targetDuration: TARGET_LESSON_DURATION
      };

      // For now, we'll use a simple extension approach
      // This would be replaced with actual dynamic content generation
      const extensionActivities = await Promise.resolve([]);
      
      if (extensionActivities.length > 0) {
        setAllActivities(prev => [...prev, ...extensionActivities]);
        
        // Track new question IDs
        const newQuestionIds = extensionActivities
          .filter(activity => activity.metadata?.templateId)
          .map(activity => activity.metadata!.templateId);
        setUsedQuestionIds(prev => [...prev, ...newQuestionIds]);
        
        console.log(`✅ Extended lesson with ${extensionActivities.length} new activities`);
      }
    } catch (error) {
      console.error('❌ Failed to extend lesson:', error);
    } finally {
      setIsExtending(false);
    }
  }, [user?.id, subject, skillArea, gradeLevel, isExtending, allActivities.length, usedQuestionIds]);

  // Generate lesson on mount and when date changes
  useEffect(() => {
    generateDailyLesson();
  }, [generateDailyLesson]);

  // Check for date change every minute to regenerate lessons
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = getCurrentDate();
      if (lastGeneratedDate && lastGeneratedDate !== currentDate) {
        console.log('📅 Date changed, generating new lesson');
        generateDailyLesson();
      }
    };

    const interval = setInterval(checkDateChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastGeneratedDate, generateDailyLesson]);

  // Regenerate lesson function (for manual refresh)
  const regenerateLesson = useCallback(async () => {
    console.log('🔄 Manual lesson regeneration requested');
    await generateDailyLesson(true);
  }, [generateDailyLesson]);

  // Dev-only: replace a single activity by slotId
  const replaceActivityBySlotId = useCallback((slotId: string, fresh: LessonActivity) => {
    setAllActivities(prev => {
      const updated = prev.map(a => (a?.metadata?.slotId === slotId ? fresh : a));
      return rebalanceDurationsSeconds(updated, TARGET_LESSON_DURATION);
    });
  }, [TARGET_LESSON_DURATION]);

  // Dev-only: regenerate a single activity by slotId via service
  const regenerateActivityBySlotId = useCallback(async (slotId: string, intent?: 'harder' | 'easier' | 'changeKind') => {
    try {
      if (busySlots.has(slotId)) return;
      setBusySlots((s) => new Set([...s, slotId]));

      const existing = allActivities.find(a => (a as any)?.metadata?.slotId === slotId);
      const sessionId = (existing as any)?.metadata?.sessionId;
      if (!sessionId) {
        console.warn('[DEV] Missing sessionId for slot regeneration');
        return;
      }
      const oldKind = (existing as any)?.type || (existing as any)?.kind;
      const oldMin = Math.round((((existing as any)?.duration || 0) as number) / 60);
      const fresh = await withAbort((signal) => (import('@/services/dailyLessonGenerator').then(mod => mod.regenerateActivityBySlotId(sessionId, slotId, intent, { signal }))));
      if (fresh) {
        replaceActivityBySlotId(slotId, fresh);
        // Optional: auto-variety guard in dev
        if (import.meta.env.DEV && intent !== 'changeKind') {
          const candidate = allActivities.map(a => (a as any)?.metadata?.slotId === slotId ? fresh : a);
          const kinds = new Set(candidate.map(a => (a as any)?.type || (a as any)?.kind).filter(Boolean));
          if (kinds.size < Math.min(3, candidate.length)) {
            const mcq = candidate.find(a => (a as any)?.type === 'interactive-game' && (a as any)?.metadata?.slotId);
            const mcqSlotId = (mcq as any)?.metadata?.slotId as string | undefined;
            if (mcqSlotId) {
              // fire-and-forget; busy guard prevents collision
              regenerateActivityBySlotId(mcqSlotId, 'changeKind');
            }
          }
        }
        await logEvent('activity_regenerated', {
          slotId,
          intent,
          oldKind,
          newKind: (fresh as any)?.type || (fresh as any)?.kind,
          oldMin,
          newMin: Math.round(((((fresh as any)?.duration || 0) as number)) / 60)
        });
      }
    } catch (e) {
      console.warn('Regenerate by slot failed', e);
    } finally {
      setBusySlots((s) => { const n = new Set(s); n.delete(slotId); return n; });
    }
  }, [allActivities, replaceActivityBySlotId, busySlots]);

  const isSlotBusy = useCallback((slotId: string) => busySlots.has(slotId), [busySlots]);

  // Client-side idle prewarm for remaining images (after top-2 handled server-side)
  useEffect(() => {
    const acts = allActivities || [];
    const rest = acts.slice(2).filter((a: any) => a?.content?.imagePrompt && !a?.content?.imageUrl);
    if (!rest.length) return;
    const run = () => {
      rest.forEach((a: any) => {
        generateActivityImage(a.content.imagePrompt)
          .then((url) => {
            if (!url) return;
            setAllActivities((prev) => prev.map((x: any) => (x?.id === a.id ? { ...x, content: { ...x.content, imageUrl: url } } : x)));
          })
          .catch(() => {});
      });
    };
    const ric = (window as any)?.requestIdleCallback;
    if (typeof ric === 'function') ric(run, { timeout: 800 });
    else setTimeout(run, 0);
  }, [allActivities]);

  return {
    allActivities,
    isLoadingActivities,
    regenerateLesson,
    extendLessonDynamically,
    isExtending,
    targetDuration: TARGET_LESSON_DURATION,
    usedQuestionIds: usedQuestionIds.length,
    replaceActivityBySlotId,
    regenerateActivityBySlotId,
    isSlotBusy
  };
};
