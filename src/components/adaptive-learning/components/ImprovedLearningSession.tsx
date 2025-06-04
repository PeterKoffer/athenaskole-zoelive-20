import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDiverseQuestionGeneration } from '../hooks/useDiverseQuestionGeneration';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import GradeAwareContentGenerator from './GradeAwareContentGenerator';
import { Brain, ArrowLeft, CheckCircle, XCircle, RefreshCw, GraduationCap } from 'lucide-react';

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

  // Generate first question on mount
  useEffect(() => {
    if (user?.id && gradeContentConfig && !currentQuestion && !isGenerating) {
      console.log('🎬 Starting grade-appropriate session for Grade', gradeConfig?.userGrade);
      loadNextQuestion();
    }
  }, [user?.id, gradeContentConfig]);

  const handleContentGenerated = (contentConfig: any) => {
    setGradeContentConfig(contentConfig);
    console.log('📚 Using grade-appropriate content configuration:', contentConfig);
  };

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
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Login Required</h3>
          <p className="text-red-300 mt-2">Please log in to access the learning session.</p>
        </CardContent>
      </Card>
    );
  }

  // Show grade-level content configuration first
  if (!gradeContentConfig) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <CardTitle className="text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-lime-400" />
                <span>Preparing Grade-Level Content</span>
              </CardTitle>
              
              <div></div>
            </div>
          </CardHeader>
        </Card>
        
        <GradeAwareContentGenerator
          subject={subject}
          skillArea={skillArea}
          onContentGenerated={handleContentGenerated}
        />
      </div>
    );
  }

  if (isGenerating && !currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            Creating Grade {gradeConfig?.userGrade} Question
          </h3>
          <p className="text-gray-400">
            AI is generating content aligned with {gradeContentConfig.standard?.code}...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Unable to Load Question</h3>
          <p className="text-gray-400 mt-2">Please try refreshing.</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <CardTitle className="text-white">
              Grade {gradeConfig?.userGrade} - {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Question {questionNumber} of {totalQuestions} • {gradeContentConfig.standard?.code}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isGenerating || showResult}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-white font-semibold">{correctAnswers}/{questionNumber - (showResult ? 0 : 1)}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full text-left justify-start p-4 h-auto ${
                  selectedAnswer === index
                    ? showResult
                      ? selectedAnswer === currentQuestion.correct
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-red-600 border-red-500 text-white'
                      : 'bg-blue-600 border-blue-500 text-white'
                    : showResult && index === currentQuestion.correct
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult || selectedAnswer !== null}
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === currentQuestion.correct && (
                  <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
                  <XCircle className="w-5 h-5 ml-auto text-red-400" />
                )}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Explanation:</h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
              {gradeContentConfig.standard && (
                <div className="mt-3 p-2 bg-blue-900/20 border border-blue-800 rounded">
                  <p className="text-blue-200 text-sm">
                    📚 Aligned with {gradeContentConfig.standard.code}: {gradeContentConfig.standard.title}
                  </p>
                </div>
              )}
              <p className="text-gray-400 text-sm mt-2">
                {questionNumber < totalQuestions ? 'Next grade-appropriate question coming up...' : 'Session completing...'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedLearningSession;
