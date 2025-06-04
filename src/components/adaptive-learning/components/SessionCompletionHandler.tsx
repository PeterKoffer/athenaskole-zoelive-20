
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SessionCompletionHandlerProps {
  questionNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  gradeLevel?: number;
  onBack: () => void;
  onNextQuestion: () => void;
  isCorrect: boolean;
  hasAnswered: boolean;
}

const SessionCompletionHandler = ({
  questionNumber,
  totalQuestions,
  correctAnswers,
  gradeLevel,
  onBack,
  onNextQuestion,
  isCorrect,
  hasAnswered
}: SessionCompletionHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!hasAnswered) return;

    // Auto-advance to next question after 3 seconds
    const timer = setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        // Session complete
        toast({
          title: "Session Complete! 🎓",
          description: `You got ${correctAnswers + (isCorrect ? 1 : 0)}/${totalQuestions} questions correct${gradeLevel ? ` for Grade ${gradeLevel}` : ''}!`,
          duration: 5000
        });

        setTimeout(() => {
          onBack();
        }, 2000);
        return;
      }

      // Next question
      onNextQuestion();
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasAnswered, questionNumber, totalQuestions, correctAnswers, isCorrect, gradeLevel, onBack, onNextQuestion, toast]);

  return null;
};

export default SessionCompletionHandler;
