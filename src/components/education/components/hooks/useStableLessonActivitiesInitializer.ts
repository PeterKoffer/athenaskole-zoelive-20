
import { useState, useRef, useEffect } from 'react';
import { useStableQuestionGeneration } from './useStableQuestionGeneration';
import { LessonActivity } from '../types/LessonTypes';

export const useStableLessonActivitiesInitializer = (
  subject: string,
  skillArea: string,
  startTimer: () => void
) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef(Date.now());
  
  const { generateStableQuestion, sessionId } = useStableQuestionGeneration({
    subject: subject.toLowerCase(),
    skillArea: skillArea || 'general_math'
  });

  useEffect(() => {
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
            
            const activity: LessonActivity = {
              id: stableQuestion.id,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              metadata: {
                subject: subject,
                skillArea: skillArea,
                templateId: stableQuestion.templateId
              },
              content: {
                question: stableQuestion.question,
                options: stableQuestion.options,
                correctAnswer: stableQuestion.correctAnswer,
                explanation: stableQuestion.explanation
              }
            };
            
            stableActivities.push(activity);
            console.log(`✅ Retrieved stable question ${i + 1}: ${stableQuestion.question.substring(0, 30)}...`);
          } catch (error) {
            console.error(`❌ Error getting stable question ${i + 1}:`, error);
            
            // Create a simple fallback question
            const fallbackActivity: LessonActivity = {
              id: `fallback_${Date.now()}_${i}`,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              metadata: {
                subject: subject,
                skillArea: skillArea
              },
              content: {
                question: `What is ${5 + i * 3} + ${7 + i * 2}?`,
                options: [`${12 + i * 5}`, `${10 + i * 5}`, `${14 + i * 5}`, `${8 + i * 5}`],
                correctAnswer: 0,
                explanation: `${5 + i * 3} + ${7 + i * 2} = ${12 + i * 5}`
              }
            };
            stableActivities.push(fallbackActivity);
          }
        }
        
        console.log(`🎯 Generated ${stableActivities.length} stable activities for session ${sessionId}`);
        setAllActivities(stableActivities);
        
        // Start the timer
        startTimer();
        
      } catch (error) {
        console.error('❌ Critical error in stable initialization:', error);
        
        // Ensure we have at least one activity
        const emergencyActivity: LessonActivity = {
          id: `emergency_${Date.now()}`,
          title: 'Math Question',
          type: 'interactive-game' as const,
          phase: 'interactive-game' as const,
          duration: 180,
          metadata: {
            subject: subject,
            skillArea: skillArea
          },
          content: {
            question: 'What is 15 + 23?',
            options: ['38', '35', '40', '33'],
            correctAnswer: 0,
            explanation: '15 + 23 = 38'
          }
        };
        setAllActivities([emergencyActivity]);
      } finally {
        // ALWAYS set initializing to false - this should be instant now
        console.log('🏁 Setting isInitializing to false (stable system)');
        setIsInitializing(false);
      }
    };
    
    initializeStableActivities();
  }, [subject, skillArea, generateStableQuestion, sessionId, startTimer]);

  return {
    allActivities,
    isInitializing,
    lessonStartTime
  };
};
