

import { useState, useRef, useEffect } from 'react';
import { useSimpleQuestionGeneration } from './useSimpleQuestionGeneration';
import { LessonActivity } from '../types/LessonTypes';

export const useLessonActivitiesInitializer = (
  subject: string,
  skillArea: string,
  startTimer: () => void
) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef(Date.now());
  
  const { generateUniqueQuestion, sessionId } = useSimpleQuestionGeneration({
    subject: subject.toLowerCase(),
    skillArea: skillArea || 'general_math'
  });

  useEffect(() => {
    const initializeActivities = async () => {
      console.log(`🚀 Initializing FRESH ${subject} lesson (Session: ${sessionId})`);
      setIsInitializing(true);
      
      try {
        // Generate 6 completely unique questions for this lesson session
        const uniqueActivities: LessonActivity[] = [];
        
        for (let i = 0; i < 6; i++) {
          console.log(`📝 Generating question ${i + 1}/6...`);
          
          try {
            const uniqueQuestion = generateUniqueQuestion();
            
            const activity: LessonActivity = {
              id: uniqueQuestion.id,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              phaseDescription: `Interactive question ${i + 1}`,
              metadata: {
                subject: subject,
                skillArea: skillArea,
                templateId: uniqueQuestion.metadata?.templateId
              },
              content: {
                question: uniqueQuestion.content.question || '',
                options: uniqueQuestion.content.options ? [...uniqueQuestion.content.options] : [], // Convert readonly to mutable
                correctAnswer: uniqueQuestion.content.correctAnswer,
                explanation: uniqueQuestion.content.explanation
              }
            };
            
            uniqueActivities.push(activity);
            console.log(`✅ Generated question ${i + 1}: ${uniqueQuestion.content.question?.substring(0, 30)}...`);
          } catch (error) {
            console.error(`❌ Error generating question ${i + 1}:`, error);
            
            // Create a simple fallback question
            const fallbackActivity: LessonActivity = {
              id: `fallback_${Date.now()}_${i}`,
              title: `Question ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              phaseDescription: `Fallback question ${i + 1}`,
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
            uniqueActivities.push(fallbackActivity);
          }
        }
        
        console.log(`🎯 Generated ${uniqueActivities.length} activities for session ${sessionId}`);
        setAllActivities(uniqueActivities);
        
        // Start the timer
        startTimer();
        
      } catch (error) {
        console.error('❌ Critical error in initialization:', error);
        
        // Ensure we have at least one activity
        const emergencyActivity: LessonActivity = {
          id: `emergency_${Date.now()}`,
          title: 'Math Question',
          type: 'interactive-game' as const,
          phase: 'interactive-game' as const,
          duration: 180,
          phaseDescription: 'Emergency math question',
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
        // ALWAYS set initializing to false
        console.log('🏁 Setting isInitializing to false');
        setIsInitializing(false);
      }
    };
    
    initializeActivities();
  }, [subject, skillArea, generateUniqueQuestion, sessionId, startTimer]);

  return {
    allActivities,
    isInitializing,
    lessonStartTime
  };
};

