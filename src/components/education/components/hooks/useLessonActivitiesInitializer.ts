
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
      console.log(`🚀 Initializing FRESH ${subject} lesson with unique questions (Session: ${sessionId})`);
      setIsInitializing(true);
      
      try {
        // Generate 8 completely unique questions for this lesson session
        const uniqueActivities: LessonActivity[] = [];
        
        for (let i = 0; i < 8; i++) {
          console.log(`📝 Generating unique question ${i + 1}/8...`);
          
          const uniqueQuestion = generateUniqueQuestion();
          
          const activity: LessonActivity = {
            id: uniqueQuestion.id,
            title: `Math Challenge ${i + 1}`,
            type: 'interactive-game',
            phase: 'interactive-game',
            duration: 180, // 3 minutes per question
            metadata: {
              subject: subject,
              skillArea: skillArea,
              templateId: uniqueQuestion.metadata.templateId
            },
            content: {
              question: uniqueQuestion.content.question,
              options: uniqueQuestion.content.options,
              correctAnswer: uniqueQuestion.content.correctAnswer,
              explanation: uniqueQuestion.content.explanation
            },
            learningObjectives: ['Problem solving', 'Mathematical reasoning', 'Critical thinking'],
            adaptiveElements: {
              difficultyAdjustment: true,
              personalizedFeedback: true,
              engagementTracking: true
            }
          };
          
          uniqueActivities.push(activity);
          console.log(`✅ Generated unique question ${i + 1}: ${uniqueQuestion.content.question.substring(0, 50)}...`);
          
          // Small delay to prevent overwhelming the system
          if (i < 7) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        console.log(`🎯 All ${uniqueActivities.length} unique questions generated for session ${sessionId}`);
        setAllActivities(uniqueActivities);
        
        // Start the timer now that activities are ready
        startTimer();
        
      } catch (error) {
        console.error('❌ Error generating unique activities:', error);
        // Fallback to a simple question if generation fails
        const fallbackActivity: LessonActivity = {
          id: `fallback_${Date.now()}`,
          title: 'Math Practice',
          type: 'interactive-game',
          phase: 'interactive-game',
          duration: 180,
          content: {
            question: 'What is 15 + 23?',
            options: ['38', '35', '40', '33'],
            correctAnswer: 0,
            explanation: '15 + 23 = 38'
          },
          learningObjectives: ['Basic addition'],
          adaptiveElements: {
            difficultyAdjustment: false,
            personalizedFeedback: true,
            engagementTracking: true
          }
        };
        setAllActivities([fallbackActivity]);
      } finally {
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
