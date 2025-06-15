import { useState, useEffect, useCallback, useRef } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useTimerManager } from '../../hooks/useTimerManager';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { generateMathActivities } from '../math/utils/mathActivityGenerator';
import { LessonActivity } from '../types/LessonTypes';

interface UseOptimizedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  manualActivityIndex?: number | null;
}

// Helper function to map InteractiveActivity types to LessonActivity types
const mapActivityType = (interactiveType: string): LessonActivity['type'] => {
  switch (interactiveType) {
    case 'mini-game':
    case 'simulation':
      return 'interactive-game';
    case 'quiz':
    case 'puzzle':
      return 'application';
    case 'creative':
    case 'exploration':
      return 'creative-exploration';
    default:
      return 'content-delivery';
  }
};

// Improved helper function to determine if an activity should count as a real activity
const isCountableActivity = (activity: LessonActivity): boolean => {
  // Accept interactive games, applications, and creative activities
  const countableTypes = ['interactive-game', 'application', 'creative-exploration'];
  const countablePhases = ['interactive-game', 'application', 'creative-exploration'];
  
  // Include if it matches countable types or phases
  if (countableTypes.includes(activity.type) || countablePhases.includes(activity.phase)) {
    return true;
  }
  
  // Only exclude very specific obsolete patterns, be less aggressive
  const obsoletePatterns = [
    'basic math concepts',
    'welcome to',
    'introduction to the lesson'
  ];
  
  const title = activity.title?.toLowerCase() || '';
  const isObsolete = obsoletePatterns.some(pattern => title.includes(pattern));
  
  return !isObsolete;
};

export const useOptimizedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  manualActivityIndex
}: UseOptimizedLessonManagerProps) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef(Date.now());

  const { timeElapsed, startTimer } = useTimerManager({ autoStart: false });

  const {
    isEnabled: autoReadEnabled,
    isSpeaking,
    hasUserInteracted,
    toggleEnabled: toggleMute,
    speakAsNelie
  } = useUnifiedSpeech();

  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime: lessonStartTime.current
  });

  // Manual navigation logic remains unchanged.
  useEffect(() => {
    if (manualActivityIndex !== null && manualActivityIndex !== undefined) {
      console.log('🧭 Manual navigation attempted to:', manualActivityIndex);
      
      // Allow backward navigation to any completed activity
      if (manualActivityIndex < currentActivityIndex && completedActivities.has(manualActivityIndex)) {
        console.log('✅ Backward navigation allowed to completed activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      
      // Allow forward navigation only to the next activity if current is completed
      if (manualActivityIndex === currentActivityIndex + 1 && completedActivities.has(currentActivityIndex)) {
        console.log('✅ Forward navigation allowed to next activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      
      // Allow staying on current activity
      if (manualActivityIndex === currentActivityIndex) {
        console.log('✅ Staying on current activity:', manualActivityIndex);
        return;
      }
      
      console.log('❌ Navigation blocked - activity not accessible:', manualActivityIndex);
    }
  }, [manualActivityIndex, currentActivityIndex, completedActivities]);

  // Initialization
  useEffect(() => {
    const initializeActivities = async () => {
      console.log('🎯 Initializing optimized lesson activities for:', subject, skillArea);
      
      try {
        let activities = await generateMathActivities();
        console.log('✅ Generated activities:', activities.length);
        
        // Filter out obsolete activities but be less aggressive to ensure sufficient content
        const filteredActivities = activities.filter(activity => {
          const mapped = {
            ...activity,
            type: mapActivityType(activity.type),
            duration: activity.duration || 120,
            phase: 'content-delivery' as const
          };
          return isCountableActivity(mapped);
        });
        
        console.log('🎯 Filtered to countable activities:', filteredActivities.length, 'from', activities.length);

        // Ensure we have at least 3 activities for a meaningful lesson
        if (filteredActivities.length < 3) {
          console.log('⚠️ Too few activities after filtering, including more content');
          // Include more activities if we filtered too aggressively
          const additionalActivities = activities.filter(activity => 
            !filteredActivities.includes(activity) && 
            !activity.title?.toLowerCase().includes('basic math concepts')
          ).slice(0, 3 - filteredActivities.length);
          
          filteredActivities.push(...additionalActivities);
          console.log('➕ Added additional activities, total now:', filteredActivities.length);
        }

        // Map InteractiveActivity to LessonActivity interface
        const mappedActivities: LessonActivity[] = filteredActivities.map(activity => ({
          ...activity,
          type: mapActivityType(activity.type), // Convert type properly
          duration: activity.duration || 120, // Use existing duration property or default
          phase: 'content-delivery' as const // Add required phase property
        }));

        setAllActivities(mappedActivities);
        setCurrentActivityIndex(0); // Always start at activity 0
        setCompletedActivities(new Set()); // Reset completion tracking
        setIsInitializing(false);
        startTimer();
      } catch (error) {
        console.error('❌ Failed to generate activities:', error);
        setIsInitializing(false);
      }
    };

    initializeActivities();
  }, [subject, skillArea, startTimer]);

  const currentActivity = allActivities[currentActivityIndex] || null;
  const totalRealActivities = allActivities.length;
  const targetLessonLength = 20; // 20 minutes

  // --- FIX: Mark activity as completed immediately and always update state ---
  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    // Prevent duplicate completion (should not matter, but safe)
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(currentActivityIndex)) {
        newSet.add(currentActivityIndex);
        console.log('✅ Activity completed (marked):', currentActivityIndex, Array.from(newSet));
      }
      return newSet;
    });

    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Navigation: Immediately go to the next activity if possible, unless finished
    const nextIndex = currentActivityIndex + 1;
    const hasMoreActivities = nextIndex < allActivities.length;
    const hasReachedTimeLimit = timeElapsed >= 1200;

    if (!hasMoreActivities || hasReachedTimeLimit) {
      console.log('🎓 Lesson completed! (handleActivityComplete)');
      onLessonComplete();
    } else {
      console.log('➡️ Advancing to next activity:', nextIndex);
      setCurrentActivityIndex(nextIndex);
    }
  }, [currentActivityIndex, allActivities.length, timeElapsed, onLessonComplete]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity && teachingEngine.isReady) {
      const textToRead = currentActivity.content?.text ||
                        currentActivity.content?.question ||
                        currentActivity.title;
      if (textToRead) {
        teachingEngine.speakWithPersonality(textToRead);
      }
    }
  }, [currentActivity, teachingEngine]);

  // --- Fix: Explicit tracking of completion for current activity
  const isCurrentActivityCompleted = completedActivities.has(currentActivityIndex);
  const canNavigateForward = currentActivityIndex < totalRealActivities - 1 && isCurrentActivityCompleted;
  const canNavigateBack = currentActivityIndex > 0;

  // Debug: Console logs to verify state
  useEffect(() => {
    console.log('[OptimizedLessonManager] Index:', currentActivityIndex,
      'Completed:', Array.from(completedActivities),
      'isCurrentActivityCompleted:', isCurrentActivityCompleted,
      'canNavigateForward:', canNavigateForward
    );
  }, [currentActivityIndex, completedActivities, isCurrentActivityCompleted, canNavigateForward]);

  return {
    currentActivityIndex,
    setCurrentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    completedActivities,
    isCurrentActivityCompleted,
    canNavigateForward,
    canNavigateBack,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    autoReadEnabled,
    hasUserInteracted,
    teachingEngine
  };
};
