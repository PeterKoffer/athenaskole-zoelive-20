
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Star, Lightbulb } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { useDiverseQuestionGeneration } from '@/components/adaptive-learning/hooks/useDiverseQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedQuestionDisplayProps {
  subject: string;
  skillArea: string;
  questionNumber: number;
  totalQuestions: number;
  isGameMode: boolean;
  onQuestionComplete: (isCorrect: boolean) => void;
  showNelieGuidance: boolean;
}

const EnhancedQuestionDisplay = ({
  subject,
  skillArea,
  questionNumber,
  totalQuestions,
  isGameMode,
  onQuestionComplete,
  showNelieGuidance
}: EnhancedQuestionDisplayProps) => {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { generateDiverseQuestion, isGenerating } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: 2,
    userId: user?.id || '',
    gradeLevel: 6,
    standardsAlignment: null
  });

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const question = await generateDiverseQuestion();
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowHint(false);
      } catch (error) {
        console.error('Failed to generate question:', error);
      }
    };
    
    loadQuestion();
  }, [questionNumber]);

  const speakText = (text: string) => {
    if (!showNelieGuidance) return;
    
    setIsSpeaking(true);
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    
    // Nelie provides immediate feedback
    if (showNelieGuidance) {
      const feedback = isCorrect 
        ? "Excellent work! That's the correct answer. You're doing great!"
        : `Not quite right this time. The correct answer is ${currentQuestion.options[currentQuestion.correct]}. Let me explain why.`;
      
      setTimeout(() => speakText(feedback), 500);
    }
    
    // Auto-advance after explanation (longer time for explanations to be visible)
    setTimeout(() => {
      onQuestionComplete(isCorrect);
    }, 8000); // Increased from previous shorter times
  };

  const handleHint = () => {
    setShowHint(true);
    if (showNelieGuidance) {
      speakText("Here's a hint to help you solve this problem!");
    }
  };

  if (isGenerating || !currentQuestion) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <RobotAvatar size="md" isActive={true} isSpeaking={false} />
          <p className="text-white mt-4">Nelie is preparing your next question...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Nelie Guidance Card */}
      {showNelieGuidance && (
        <Card className="bg-purple-900 border-purple-600">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <RobotAvatar size="sm" isActive={true} isSpeaking={isSpeaking} />
              <div className="flex-1">
                <p className="text-purple-200">
                  {isGameMode 
                    ? `Game time! Question ${questionNumber} of ${totalQuestions}. Choose the correct answer to earn points!`
                    : `Let's practice! Take your time with question ${questionNumber} of ${totalQuestions}.`
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHint}
                disabled={showHint || showResult}
                className="border-purple-400 text-purple-200 hover:bg-purple-800"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card className={`${isGameMode ? 'bg-gradient-to-r from-orange-900 to-red-900 border-orange-400' : 'bg-gray-800 border-gray-700'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {isGameMode ? '🎮 ' : '📝 '}
              Question {questionNumber}
            </h2>
            {isGameMode && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star className="w-4 h-4" />
                <span>+10 points</span>
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-6 text-center">
            {currentQuestion.question}
          </h3>

          {/* Hint Display */}
          {showHint && (
            <Card className="bg-blue-900 border-blue-600 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-blue-200">Nelie's Hint:</span>
                </div>
                <p className="text-blue-100">
                  {currentQuestion.hint || "Break this problem down step by step. What operation do you need to use?"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQuestion.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 text-lg border-gray-500 text-white bg-gray-700 hover:bg-gray-600 transition-all ${
                  selectedAnswer === index 
                    ? (index === currentQuestion.correct ? 'ring-4 ring-green-400 bg-green-600' : 'ring-4 ring-red-400 bg-red-600')
                    : ''
                } ${
                  showResult && index === currentQuestion.correct && selectedAnswer !== index
                    ? 'ring-4 ring-green-400 bg-green-600'
                    : ''
                }`}
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Explanation */}
          {showResult && (
            <Card className={`${selectedAnswer === currentQuestion.correct ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Volume2 className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-200 mb-2">
                      {selectedAnswer === currentQuestion.correct ? "Correct! 🎉" : "Not quite right 📚"}
                    </h4>
                    <p className="text-green-100">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuestionDisplay;
