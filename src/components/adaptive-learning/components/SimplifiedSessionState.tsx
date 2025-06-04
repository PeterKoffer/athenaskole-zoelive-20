
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useReliableQuestionGeneration } from '../hooks/useReliableQuestionGeneration';
import { useStudentProgressTracker } from '../hooks/useStudentProgressTracker';

interface UseSimplifiedSessionStateProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  onBack: () => void;
}

export const useSimplifiedSessionState = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack
}: UseSimplifiedSessionStateProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  
  const { 
    isGenerating, 
    generateQuestion, 
    saveQuestionHistory 
  } = useReliableQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || ''
  });

  const {
    progress,
    updateProgress,
    getRecommendedDifficulty
  } = useStudentProgressTracker(subject, skillArea);

  // Generate first question on mount
  useEffect(() => {
    if (user?.id && !currentQuestion && !isGenerating) {
      console.log('🎬 Starting session, generating first question...');
      generateQuestion().then(setCurrentQuestion);
      setQuestionStartTime(new Date());
    }
  }, [user?.id, currentQuestion, isGenerating, generateQuestion]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const responseTime = Date.now() - questionStartTime.getTime();
    
    setShowResult(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Save question history
    await saveQuestionHistory(currentQuestion, answerIndex, isCorrect, responseTime);

    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect",
      description: isCorrect ? "Well done!" : currentQuestion.explanation,
      duration: 2000,
      variant: isCorrect ? "default" : "destructive"
    });

    // Auto-advance to next question after 3 seconds
    setTimeout(async () => {
      if (questionNumber >= totalQuestions) {
        // Session complete
        const sessionDuration = Date.now() - sessionStartTime.getTime();
        
        await updateProgress({
          questionsAnswered: totalQuestions,
          correctAnswers,
          conceptsWorkedOn: [skillArea],
          timeSpent: sessionDuration
        });

        toast({
          title: "Session Complete! 🎓",
          description: `You got ${correctAnswers}/${totalQuestions} questions correct!`,
          duration: 5000
        });

        onBack();
        return;
      }

      // Next question
      setQuestionNumber(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuestionStartTime(new Date());
      
      console.log(`🔄 Generating question ${questionNumber + 1}...`);
      const nextQuestion = await generateQuestion();
      setCurrentQuestion(nextQuestion);
    }, 3000);
  };

  return {
    user,
    currentQuestion,
    selectedAnswer,
    showResult,
    questionNumber,
    correctAnswers,
    isGenerating,
    progress,
    getRecommendedDifficulty,
    handleAnswerSelect
  };
};
