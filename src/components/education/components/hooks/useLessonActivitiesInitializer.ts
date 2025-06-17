
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
        
        // Generate all questions in parallel for faster loading
        const questionPromises = Array.from({ length: 8 }, async (_, i) => {
          console.log(`📝 Generating unique question ${i + 1}/8...`);
          
          try {
            const uniqueQuestion = generateUniqueQuestion();
            
            const activity: LessonActivity = {
              id: uniqueQuestion.id,
              title: `Math Challenge ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
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
              }
            };
            
            console.log(`✅ Generated unique question ${i + 1}: ${uniqueQuestion.content.question.substring(0, 50)}...`);
            return activity;
          } catch (error) {
            console.error(`❌ Error generating question ${i + 1}:`, error);
            // Return a fallback question with correct typing
            const fallbackActivity: LessonActivity = {
              id: `fallback_${Date.now()}_${i}`,
              title: `Math Challenge ${i + 1}`,
              type: 'interactive-game' as const,
              phase: 'interactive-game' as const,
              duration: 180,
              metadata: {
                subject: subject,
                skillArea: skillArea
              },
              content: {
                question: `What is ${10 + i * 5} + ${15 + i * 3}?`,
                options: [`${25 + i * 8}`, `${23 + i * 8}`, `${27 + i * 8}`, `${21 + i * 8}`],
                correctAnswer: 0,
                explanation: `${10 + i * 5} + ${15 + i * 3} = ${25 + i * 8}`
              }
            };
            return fallbackActivity;
          }
        });
        
        const generatedActivities = await Promise.all(questionPromises);
        
        console.log(`🎯 All ${generatedActivities.length} unique questions generated for session ${sessionId}`);
        setAllActivities(generatedActivities);
        
        // Start the timer now that activities are ready
        startTimer();
        
      } catch (error) {
        console.error('❌ Error generating unique activities:', error);
        // Fallback to a simple question if generation fails
        const fallbackActivity: LessonActivity = {
          id: `fallback_${Date.now()}`,
          title: 'Math Practice',
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
        setAllActivities([fallbackActivity]);
      } finally {
        console.log('🏁 Initialization complete, setting isInitializing to false');
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
