
import { useEffect, useState, useRef } from 'react';
import { LessonActivity } from '../types/LessonTypes';
import { SubjectSpecificTemplates } from '../utils/subjectSpecificTemplates';

export const useLessonActivitiesInitializer = (subject: string, skillArea: string, startTimer: () => void) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const initializeLesson = async () => {
      console.log(`🚀 Initializing ${subject} lesson with enhanced templates...`);
      setIsInitializing(true);
      
      try {
        // Reset lesson start time
        lessonStartTime.current = Date.now();
        
        // Get subject-specific activities using the enhanced templates
        const activities = SubjectSpecificTemplates.getTemplateForSubject(
          subject,
          skillArea || 'general',
          6 // default grade level
        );

        console.log(`✅ Generated ${activities.length} activities for ${subject}:`, 
          activities.map(a => `${a.title} (${a.type})`));

        setAllActivities(activities);
        
        // Start the lesson timer
        startTimer();
        
      } catch (error) {
        console.error('❌ Error initializing lesson activities:', error);
        
        // Fallback to basic activities
        const fallbackActivities: LessonActivity[] = [{
          id: `${subject}-fallback-${Date.now()}`,
          type: 'introduction',
          phase: 'introduction',
          title: `Welcome to ${subject}!`,
          duration: 180,
          phaseDescription: 'Getting started with your lesson',
          content: {
            hook: `Welcome to your ${subject} lesson! Let's begin this exciting learning journey together.`,
            excitementBuilder: "Get ready for an amazing learning experience!",
            characterIntroduction: "I'm Nelie, and I'm here to help you learn!"
          }
        }];
        
        setAllActivities(fallbackActivities);
        startTimer();
      } finally {
        setIsInitializing(false);
      }
    };

    if (subject) {
      initializeLesson();
    }
  }, [subject, skillArea, startTimer]);

  return {
    allActivities,
    isInitializing,
    lessonStartTime
  };
};
