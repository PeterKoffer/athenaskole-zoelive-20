
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDiverseQuestionGeneration } from '../hooks/useDiverseQuestionGeneration';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';

interface ImprovedSessionManagerProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  gradeContentConfig: any;
  children: (sessionData: any) => React.ReactNode;
}

const ImprovedSessionManager = ({
  subject,
  skillArea,
  difficultyLevel,
  gradeContentConfig,
  children
}: ImprovedSessionManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { gradeConfig } = useGradeLevelContent(subject);
  
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  
  const totalQuestions = 5;
  
  // Use grade-appropriate difficulty if available
  const adjustedDifficulty = gradeConfig 
    ? Math.max(gradeConfig.difficultyRange[0], Math.min(gradeConfig.difficultyRange[1], difficultyLevel))
    : difficultyLevel;
  
  const {
    isGenerating,
    generateDiverseQuestion,
    saveQuestionHistory
  } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: adjustedDifficulty,
    userId: user?.id || '',
    gradeLevel: gradeConfig?.userGrade,
    standardsAlignment: gradeContentConfig?.standard
  });

  const loadNextQuestion = async () => {
    try {
      setQuestionStartTime(new Date());
      
      // Generate question with grade-level context
      const questionContext = gradeContentConfig ? {
        gradeLevel: gradeContentConfig.gradeLevel,
        standard: gradeContentConfig.standard,
        contentPrompt: gradeContentConfig.contentPrompt
      } : undefined;
      
      const question = await generateDiverseQuestion(questionContext);
      setCurrentQuestion(question);
      console.log('📝 Loaded grade-appropriate question for Grade', gradeConfig?.userGrade, ':', question.question);
    } catch (error) {
      console.error('Failed to load question:', error);
      toast({
        title: "Error",
        description: "Failed to generate grade-appropriate question. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correct;
    const responseTime = Date.now() - questionStartTime.getTime();

    setShowResult(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Save question history with grade context
    await saveQuestionHistory(currentQuestion, answerIndex, isCorrect, responseTime, {
      gradeLevel: gradeConfig?.userGrade,
      standardCode: gradeContentConfig?.standard?.code
    });

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
        toast({
          title: "Session Complete! 🎓",
          description: `You got ${correctAnswers + (isCorrect ? 1 : 0)}/${totalQuestions} questions correct for Grade ${gradeConfig?.userGrade}!`,
          duration: 5000
        });
        return;
      }

      // Next question
      setQuestionNumber(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);

      console.log(`🔄 Loading Grade ${gradeConfig?.userGrade} question ${questionNumber + 1}...`);
      await loadNextQuestion();
    }, 3000);
  };

  const sessionData = {
    currentQuestion,
    selectedAnswer,
    showResult,
    questionNumber,
    totalQuestions,
    correctAnswers,
    isGenerating,
    gradeLevel: gradeConfig?.userGrade,
    loadNextQuestion,
    handleAnswerSelect
  };

  return <>{children(sessionData)}</>;
};

export default ImprovedSessionManager;
