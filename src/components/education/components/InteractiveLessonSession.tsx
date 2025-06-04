
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Brain, Volume2, VolumeX, Play } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';

interface LessonState {
  phase: 'introduction' | 'interactive' | 'paused' | 'completed';
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  canResume: boolean;
}

interface InteractiveLessonSessionProps {
  subject: string;
  skillArea: string;
  lessonState: LessonState;
  onStateUpdate: (state: LessonState) => void;
  onLessonComplete: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const InteractiveLessonSession = ({
  subject,
  skillArea,
  lessonState,
  onStateUpdate,
  onLessonComplete
}: InteractiveLessonSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hasReadQuestion, setHasReadQuestion] = useState(false);
  
  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    handleMuteToggle
  } = useSpeechSynthesis();

  // Sample questions based on subject
  const getQuestions = (): Question[] => {
    if (subject === 'mathematics') {
      return [
        {
          id: 1,
          question: "What is 7 + 5?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "When we add 7 + 5, we count forward: 7, 8, 9, 10, 11, 12. So the answer is 12!"
        },
        {
          id: 2,
          question: "Which number is greater: 15 or 9?",
          options: ["15", "9", "They are equal", "Cannot tell"],
          correctAnswer: 0,
          explanation: "15 is greater than 9. When comparing numbers, the one with more digits or the larger value is greater."
        },
        {
          id: 3,
          question: "What is 20 - 8?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2,
          explanation: "When we subtract 8 from 20, we count backward: 20, 19, 18, 17, 16, 15, 14, 13, 12. So 20 - 8 = 12!"
        }
      ];
    }
    return [];
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Speak result with proper timing
    if (autoReadEnabled) {
      const resultText = isCorrect ? 
        "Excellent work! That's the correct answer." : 
        `Not quite right this time. The correct answer is ${String.fromCharCode(65 + currentQuestion.correctAnswer)}.`;
      
      const fullText = `${resultText} ${currentQuestion.explanation}`;
      
      // Delay speech to let UI update
      setTimeout(() => {
        speakText(fullText);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHasReadQuestion(false); // Reset for new question
      
      // Update lesson state
      onStateUpdate({
        ...lessonState,
        currentSegment: currentQuestionIndex + 2
      });
    } else {
      stopSpeaking(); // Stop any current speech before completing
      onLessonComplete();
    }
  };

  // Auto-read question when it first appears
  useEffect(() => {
    if (autoReadEnabled && currentQuestion && !showResult && !hasReadQuestion) {
      setHasReadQuestion(true);
      setTimeout(() => {
        const questionText = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
        const optionsText = currentQuestion.options.map((option, index) => 
          `Option ${String.fromCharCode(65 + index)}: ${option}`
        ).join('. ');
        
        const fullText = `${questionText}. Your options are: ${optionsText}`;
        speakText(fullText);
      }, 2000);
    }
  }, [currentQuestionIndex, autoReadEnabled, currentQuestion, showResult, hasReadQuestion, speakText]);

  const readQuestion = () => {
    if (!currentQuestion) return;
    
    stopSpeaking(); // Stop any current speech first
    
    setTimeout(() => {
      const questionText = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
      const optionsText = currentQuestion.options.map((option, index) => 
        `Option ${String.fromCharCode(65 + index)}: ${option}`
      ).join('. ');
      
      const fullText = `${questionText}. Your options are: ${optionsText}`;
      speakText(fullText);
    }, 500);
  };

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg mb-4">No questions available for this subject yet.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Retry Loading
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nelie Avatar and Controls */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <RobotAvatar size="xl" isActive={true} isSpeaking={isSpeaking} />
              <div className="text-white">
                <h3 className="text-lg font-semibold">Nelie is here to help!</h3>
                <p className="text-purple-200">Working on {subject} • Question {currentQuestionIndex + 1} of {questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMuteToggle}
                className="border-purple-400 text-slate-950"
              >
                {autoReadEnabled ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                {autoReadEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={readQuestion}
                className="border-purple-400 text-slate-950"
                disabled={!autoReadEnabled}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isSpeaking ? 'Nelie is speaking...' : 'Ask Nelie to repeat'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm text-gray-400">Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-xl font-semibold text-white">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  selectedAnswer === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                } ${
                  showResult && index === currentQuestion.correctAnswer
                    ? "bg-green-600 text-white"
                    : ""
                } ${
                  showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
                    ? "bg-red-600 text-white"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 ml-auto text-red-200" />
                )}
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2 text-red-400" />
                )}
                <span className={
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'text-green-400 font-semibold' 
                    : 'text-red-400 font-semibold'
                }>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{currentQuestion.explanation}</p>
              {currentQuestionIndex < questions.length - 1 ? (
                <p className="text-gray-400 text-sm">Next question coming up...</p>
              ) : (
                <p className="text-gray-400 text-sm">Lesson completing...</p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveLessonSession;
