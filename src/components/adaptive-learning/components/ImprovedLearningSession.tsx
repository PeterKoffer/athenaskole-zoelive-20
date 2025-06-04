
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDiverseQuestionGeneration } from '../hooks/useDiverseQuestionGeneration';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import GradeContentSetup from './GradeContentSetup';
import SessionHeader from './SessionHeader';
import QuestionDisplay from './QuestionDisplay';
import TopicExplanation from './TopicExplanation';
import LoadingStates from './LoadingStates';

interface ImprovedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const ImprovedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: ImprovedLearningSessionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { gradeConfig, isContentAppropriate } = useGradeLevelContent(subject);
  
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [gradeContentConfig, setGradeContentConfig] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  
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

  const handleContentGenerated = (contentConfig: any) => {
    setGradeContentConfig(contentConfig);
    console.log('📚 Using grade-appropriate content configuration:', contentConfig);
  };

  const handleStartQuestions = () => {
    console.log('📖 Moving from explanation to questions phase');
    setShowExplanation(false);
    // Generate first question when starting questions
    if (user?.id && gradeContentConfig && !currentQuestion && !isGenerating) {
      loadNextQuestion();
    }
  };

  // Generate first question after explanation phase
  useEffect(() => {
    if (user?.id && gradeContentConfig && !currentQuestion && !isGenerating && !showExplanation) {
      console.log('🎬 Starting grade-appropriate session for Grade', gradeConfig?.userGrade);
      loadNextQuestion();
    }
  }, [user?.id, gradeContentConfig, showExplanation]);

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

        setTimeout(() => {
          onBack();
        }, 2000);
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

  const handleRefresh = () => {
    if (!isGenerating) {
      loadNextQuestion();
      toast({
        title: "Generating New Grade-Appropriate Question",
        description: `Creating content for Grade ${gradeConfig?.userGrade}...`,
        duration: 2000
      });
    }
  };

  if (!user) {
    return <LoadingStates type="login-required" />;
  }

  // Show grade-level content configuration first
  if (!gradeContentConfig) {
    return (
      <GradeContentSetup
        subject={subject}
        skillArea={skillArea}
        onBack={onBack}
        onContentGenerated={handleContentGenerated}
      />
    );
  }

  // Show topic explanation before questions
  if (showExplanation) {
    return (
      <TopicExplanation
        subject={subject}
        skillArea={skillArea}
        gradeLevel={gradeConfig?.userGrade}
        standardInfo={gradeContentConfig.standard}
        onStartQuestions={handleStartQuestions}
      />
    );
  }

  if (isGenerating && !currentQuestion) {
    return (
      <LoadingStates 
        type="generating" 
        gradeLevel={gradeConfig?.userGrade}
        standardCode={gradeContentConfig.standard?.code}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <LoadingStates 
        type="no-question"
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <CardHeader>
        <SessionHeader
          onBack={onBack}
          gradeLevel={gradeConfig?.userGrade}
          subject={subject}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          standardCode={gradeContentConfig.standard?.code}
          correctAnswers={correctAnswers}
          showResult={showResult}
          isGenerating={isGenerating}
          onRefresh={handleRefresh}
        />
      </CardHeader>

      <CardContent className="p-6">
        <QuestionDisplay
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correct}
          showResult={showResult}
          explanation={currentQuestion.explanation}
          standardInfo={gradeContentConfig.standard ? {
            code: gradeContentConfig.standard.code,
            title: gradeContentConfig.standard.title
          } : undefined}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          onAnswerSelect={handleAnswerSelect}
        />
      </CardContent>
    </Card>
  );
};

export default ImprovedLearningSession;
