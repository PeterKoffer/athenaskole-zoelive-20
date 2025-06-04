
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useReliableQuestionGeneration } from '../hooks/useReliableQuestionGeneration';
import { useStudentProgressTracker } from '../hooks/useStudentProgressTracker';
import { Brain, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface SimplifiedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const SimplifiedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: SimplifiedLearningSessionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  
  const totalQuestions = 5;
  
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

  if (isGenerating && !currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 text-lime-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Preparing Your Question</h3>
          <p className="text-gray-400">AI is creating a personalized question for you...</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg font-semibold">Unable to Load Question</h3>
          <p className="text-gray-400 mt-2">Please try refreshing the page.</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
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
              {subject} - {skillArea}
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Question {questionNumber} of {totalQuestions} • Level {getRecommendedDifficulty()}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-white font-semibold">{correctAnswers}/{questionNumber - (showResult ? 0 : 1)}</p>
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
              <p className="text-gray-400 text-sm mt-2">
                {questionNumber < totalQuestions ? 'Next question coming up...' : 'Session completing...'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedLearningSession;
