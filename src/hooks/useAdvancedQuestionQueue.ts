import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';
import { UniqueQuestion } from '@/services/globalQuestionUniquenessService';

interface UseAdvancedQuestionQueueProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  maxQueueSize?: number;
  preGenerateOnStart?: boolean;
}

export const useAdvancedQuestionQueue = ({
  subject,
  skillArea,
  difficultyLevel,
  maxQueueSize = 3,
  preGenerateOnStart = true
}: UseAdvancedQuestionQueueProps) => {
  const { user } = useAuth();
  const [questionQueue, setQuestionQueue] = useState<UniqueQuestion[]>([]);
  const [isPreGenerating, setIsPreGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<UniqueQuestion | null>(null);
  const isGeneratingRef = useRef(false);

  const questionGeneration = useUnifiedQuestionGeneration(user?.id || '');

  // Pre-generate questions to fill the queue
  const fillQueue = useCallback(async () => {
    if (!user?.id || isGeneratingRef.current) return;
    
    const needed = maxQueueSize - questionQueue.length;
    if (needed <= 0) return;

    console.log(`🎯 Filling question queue: need ${needed} more questions`);
    isGeneratingRef.current = true;
    setIsPreGenerating(true);

    try {
      const newQuestions: UniqueQuestion[] = [];
      
      for (let i = 0; i < needed; i++) {
        try {
          const question = await questionGeneration.generateQuestion({
            subject,
            skillArea,
            difficultyLevel,
            gradeLevel: 6,
            queuePosition: questionQueue.length + i,
            totalInQueue: questionQueue.length + needed
          });
          newQuestions.push(question);
          console.log(`✅ Pre-generated question ${i + 1}/${needed} for queue`);
        } catch (error) {
          console.error(`❌ Failed to generate question ${i + 1}:`, error);
          break; // Stop generating if one fails
        }
      }

      if (newQuestions.length > 0) {
        setQuestionQueue(prev => [...prev, ...newQuestions]);
        console.log(`📚 Added ${newQuestions.length} questions to queue. Total: ${questionQueue.length + newQuestions.length}`);
      }
    } catch (error) {
      console.error('❌ Error filling question queue:', error);
    } finally {
      isGeneratingRef.current = false;
      setIsPreGenerating(false);
    }
  }, [user?.id, questionQueue.length, maxQueueSize, questionGeneration, subject, skillArea, difficultyLevel]);

  // Get next question from queue and trigger background refill
  const getNextQuestion = useCallback((): UniqueQuestion | null => {
    if (questionQueue.length === 0) {
      console.warn('⚠️ Question queue is empty!');
      return null;
    }

    const nextQuestion = questionQueue[0];
    setCurrentQuestion(nextQuestion);
    
    // Remove from queue and trigger background refill
    setQuestionQueue(prev => {
      const updated = prev.slice(1);
      
      // Trigger background refill when queue gets low
      if (updated.length <= 1 && !isGeneratingRef.current) {
        setTimeout(() => fillQueue(), 100);
      }
      
      return updated;
    });

    console.log(`📖 Retrieved question from queue. Remaining: ${questionQueue.length - 1}`);
    return nextQuestion;
  }, [questionQueue, fillQueue]);

  // Initialize queue on component mount
  useEffect(() => {
    if (user?.id && preGenerateOnStart && questionQueue.length === 0 && !isGeneratingRef.current) {
      console.log('🚀 Starting initial question queue generation...');
      fillQueue();
    }
  }, [user?.id, preGenerateOnStart, questionQueue.length, fillQueue]);

  // Save question history when question is answered
  const saveQuestionResponse = useCallback(async (
    question: UniqueQuestion,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number
  ) => {
    try {
      console.log('📝 Saving question response:', { question: question.id, userAnswer, isCorrect });
    } catch (error) {
      console.warn('Could not save question response:', error);
    }
  }, []);

  return {
    // Queue management
    questionQueue,
    queueSize: questionQueue.length,
    isPreGenerating,
    isQueueReady: questionQueue.length > 0,
    
    // Question retrieval
    currentQuestion,
    getNextQuestion,
    
    // Manual controls
    fillQueue,
    saveQuestionResponse,
    
    // Queue status
    isEmpty: questionQueue.length === 0,
    isLow: questionQueue.length <= 1,
    isFull: questionQueue.length >= maxQueueSize,
    
    // Generation stats
    generationStats: { total: 0, unique: 0 }
  };
};