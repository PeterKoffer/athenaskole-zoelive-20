
import { useEffect, useState, useRef } from 'react';
import { LessonActivity } from '../types/LessonTypes';
import { generateMathActivities } from '../math/utils/mathActivityGenerator';

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

const isCountableActivity = (activity: LessonActivity): boolean => {
  const countableTypes = ['interactive-game', 'application', 'creative-exploration'];
  const countablePhases = ['interactive-game', 'application', 'creative-exploration'];
  if (countableTypes.includes(activity.type) || countablePhases.includes(activity.phase)) {
    return true;
  }
  const obsoletePatterns = [
    'basic math concepts',
    'welcome to',
    'introduction to the lesson'
  ];
  const title = activity.title?.toLowerCase() || '';
  const isObsolete = obsoletePatterns.some(pattern => title.includes(pattern));
  return !isObsolete;
};

export const useLessonActivitiesInitializer = (subject: string, skillArea: string, startTimer: () => void) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef(Date.now());
  
  useEffect(() => {
    const initializeActivities = async () => {
      console.log('🎯 Initializing optimized lesson activities for:', subject, skillArea);
      try {
        let activities = await generateMathActivities();
        console.log('✅ Generated activities:', activities.length);
        const filteredActivities = activities.filter(activity => {
          const mapped = {
            ...activity,
            type: mapActivityType(activity.type),
            duration: activity.duration || 120,
            phase: 'content-delivery' as const,
          };
          return isCountableActivity(mapped);
        });
        console.log('🎯 Filtered to countable activities:', filteredActivities.length, 'from', activities.length);
        if (filteredActivities.length < 3) {
          console.log('⚠️ Too few activities after filtering, including more content');
          const additionalActivities = activities.filter(activity => 
            !filteredActivities.includes(activity) &&
             !activity.title?.toLowerCase().includes('basic math concepts')
          ).slice(0, 3 - filteredActivities.length);
          filteredActivities.push(...additionalActivities);
          console.log('➕ Added additional activities, total now:', filteredActivities.length);
        }
        const mappedActivities: LessonActivity[] = filteredActivities.map(activity => ({
          ...activity,
          type: mapActivityType(activity.type),
          duration: activity.duration || 120,
          phase: 'content-delivery' as const,
        }));
        setAllActivities(mappedActivities);
        setIsInitializing(false);
        startTimer();
      } catch (error) {
        console.error('❌ Failed to generate activities:', error);
        setIsInitializing(false);
      }
    };
    initializeActivities();
  }, [subject, skillArea, startTimer]);

  return { allActivities, isInitializing, lessonStartTime };
};
