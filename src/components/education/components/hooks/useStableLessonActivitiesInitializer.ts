
import { useState, useRef, useEffect } from 'react';
import { useStableQuestionGeneration } from './useStableQuestionGeneration';
import { LessonActivity } from '../types/LessonTypes';

export const useStableLessonActivitiesInitializer = (
  subject: string,
  skillArea: string,
  startTimer: () => void
) => {
  // Use useRef to store activities so they NEVER change reference
  const activitiesRef = useRef<LessonActivity[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const lessonStartTime = useRef(Date.now());
  
  const { generateStableQuestion, sessionId } = useStableQuestionGeneration({
    subject: subject.toLowerCase(),
    skillArea: skillArea || 'general_math'
  });

  useEffect(() => {
    // Only initialize once
    if (initializationComplete) {
      return;
    }

    const initializeStableActivities = async () => {
      console.log(`🚀 Initializing STABLE ${subject} lesson (Session: ${sessionId})`);
      setIsInitializing(true);
      
      try {
        // Generate 6 stable pre-compiled questions instantly
        const stableActivities: LessonActivity[] = [];
        
        for (let i = 0; i < 6; i++) {
          console.log(`📝 Getting stable question ${i + 1}/6...`);
          
          try {
            const stableQuestion = generateStableQuestion();
            
            // Create completely frozen activity object that will never change
            const activity: LessonActivity = Object.freeze({
              id: stableQuestion.id,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              metadata: Object.freeze({
                subject: subject,
                skillArea: skillArea,
                templateId: stableQuestion.templateId
              }),
              content: Object.freeze({
                question: stableQuestion.question,
                options: Object.freeze([...stableQuestion.options]),
                correctAnswer: stableQuestion.correctAnswer,
                explanation: stableQuestion.explanation
              })
            });
            
            stableActivities.push(activity);
            console.log(`✅ Retrieved stable question ${i + 1}: ${stableQuestion.question.substring(0, 30)}...`);
          } catch (error) {
            console.error(`❌ Error getting stable question ${i + 1}:`, error);
            
            // Create a simple fallback question - also frozen
            const fallbackActivity: LessonActivity = Object.freeze({
              id: `fallback_${Date.now()}_${i}`,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              metadata: Object.freeze({
                subject: subject,
                skillArea: skillArea
              }),
              content: Object.freeze({
                question: `What is ${5 + i * 3} + ${7 + i * 2}?`,
                options: Object.freeze([`${12 + i * 5}`, `${10 + i * 5}`, `${14 + i * 5}`, `${8 + i * 5}`]),
                correctAnswer: 0,
                explanation: `${5 + i * 3} + ${7 + i * 2} = ${12 + i * 5}`
              })
            });
            stableActivities.push(fallbackActivity);
          }
        }
        
        // Convert the frozen array to mutable for the ref assignment
        // The individual activities remain frozen, but the array itself can be assigned
        activitiesRef.current = [...stableActivities];
        console.log(`🎯 Generated ${stableActivities.length} FROZEN stable activities for session ${sessionId}`);
        
        // Start the timer
        startTimer();
        
      } catch (error) {
        console.error('❌ Critical error in stable initialization:', error);
        
        // Ensure we have at least one activity - also frozen
        const emergencyActivity: LessonActivity = Object.freeze({
          id: `emergency_${Date.now()}`,
          title: 'Math Question',
          type: 'interactive-game' as const,
          phase: 'interactive-game' as const,
          duration: 180,
          metadata: Object.freeze({
            subject: subject,
            skillArea: skillArea
          }),
          content: Object.freeze({
            question: 'What is 15 + 23?',
            options: Object.freeze(['38', '35', '40', '33']),
            correctAnswer: 0,
            explanation: '15 + 23 = 38'
          })
        });
        activitiesRef.current = [emergencyActivity];
      } finally {
        // Mark initialization as complete
        setInitializationComplete(true);
        console.log('🏁 Setting isInitializing to false (stable system with frozen objects)');
        setIsInitializing(false);
      }
    };
    
    initializeStableActivities();
  }, [subject, skillArea, generateStableQuestion, sessionId, startTimer, initializationComplete]);

  return {
    allActivities: activitiesRef.current, // Always return the same reference
    isInitializing,
    lessonStartTime
  };
};
