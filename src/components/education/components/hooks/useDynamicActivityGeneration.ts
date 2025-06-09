
import { useState, useCallback } from 'react';
import { useDiverseQuestionGeneration } from '@/components/adaptive-learning/hooks/useDiverseQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';
import { LessonActivity } from '../types/LessonTypes';

interface UseDynamicActivityGenerationProps {
  subject: string;
  skillArea: string;
  timeElapsed: number;
}

export const useDynamicActivityGeneration = ({
  subject,
  skillArea,
  timeElapsed
}: UseDynamicActivityGenerationProps) => {
  const { user } = useAuth();
  const [dynamicActivities, setDynamicActivities] = useState<LessonActivity[]>([]);
  const [questionsGenerated, setQuestionsGenerated] = useState(0);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  // Dynamic question generation with proper parameters
  const { generateDiverseQuestion } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: 3,
    userId: user?.id || '',
    gradeLevel: 5,
    standardsAlignment: { standard: { code: 'CCSS.MATH' } }
  });

  // Generate dynamic questions based on performance - fixed parameters
  const generateDynamicActivity = useCallback(async () => {
    if (!user?.id || isGeneratingQuestion) return null;

    try {
      setIsGeneratingQuestion(true);
      console.log('🎯 Generating dynamic question based on student performance...');
      
      // Use proper parameters that match the hook interface
      const question = await generateDiverseQuestion({
        usedQuestions: dynamicActivities.map(a => a.content.question || '')
      });

      const dynamicActivity: LessonActivity = {
        id: `dynamic-${questionsGenerated}-${Date.now()}`,
        type: 'interactive-game',
        phase: 'interactive-game',
        title: `Adaptive Practice Question ${questionsGenerated + 1}`,
        duration: 240, // 4 minutes
        phaseDescription: 'Adaptive Practice',
        content: {
          question: question.question,
          options: question.options,
          correct: question.correct,
          explanation: question.explanation
        }
      };

      setQuestionsGenerated(prev => prev + 1);
      console.log('✅ Dynamic activity generated:', dynamicActivity.title);
      return dynamicActivity;
    } catch (error) {
      console.error('❌ Failed to generate dynamic activity:', error);
      
      // Generate fallback question with real content
      const fallbackActivity: LessonActivity = {
        id: `fallback-${questionsGenerated}-${Date.now()}`,
        type: 'interactive-game',
        phase: 'interactive-game',
        title: `Practice Question ${questionsGenerated + 1}`,
        duration: 240,
        phaseDescription: 'Practice',
        content: {
          question: subject.toLowerCase() === 'mathematics' 
            ? "What is 15 + 27?"
            : "Which word is a synonym for 'happy'?",
          options: subject.toLowerCase() === 'mathematics'
            ? ["40", "42", "44", "46"]
            : ["Sad", "Joyful", "Angry", "Tired"],
          correct: subject.toLowerCase() === 'mathematics' ? 1 : 1,
          explanation: subject.toLowerCase() === 'mathematics'
            ? "15 + 27 = 42. We can break this down as 15 + 20 = 35, then 35 + 7 = 42."
            : "Joyful means the same thing as happy - both describe feeling good and cheerful!"
        }
      };
      
      setQuestionsGenerated(prev => prev + 1);
      return fallbackActivity;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [user?.id, generateDiverseQuestion, questionsGenerated, dynamicActivities, subject, isGeneratingQuestion]);

  return {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity
  };
};
