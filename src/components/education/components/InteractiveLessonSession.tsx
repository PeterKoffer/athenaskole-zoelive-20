
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play } from 'lucide-react';
import { useConsolidatedSpeech } from '@/hooks/useConsolidatedSpeech';
import { useInteractiveLessonState, LessonState } from './hooks/useInteractiveLessonState';
import { useInteractiveLessonQuestions } from './hooks/useInteractiveLessonQuestions';
import NelieAvatarSection from './NelieAvatarSection';
import LessonQuestionCard from './LessonQuestionCard';

interface InteractiveLessonSessionProps {
  subject: string;
  skillArea: string;
  lessonState: LessonState;
  onStateUpdate: (state: LessonState) => void;
  onLessonComplete: () => void;
}

const InteractiveLessonSession = ({
  subject,
  skillArea,
  lessonState,
  onStateUpdate,
  onLessonComplete
}: InteractiveLessonSessionProps) => {
  const {
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    hasReadQuestion,
    setHasReadQuestion,
    handleAnswerSelect,
    handleSubmitAnswer,
    moveToNextQuestion
  } = useInteractiveLessonState();

  const questions = useInteractiveLessonQuestions(subject);
  const currentQuestion = questions[currentQuestionIndex];
  
  const {
    isSpeaking,
    isEnabled: autoReadEnabled,
    speakAsNelie: speakText,
    stop: stopSpeaking,
    toggleEnabled: handleMuteToggle
  } = useConsolidatedSpeech();

  const handleSubmitAnswerWithSpeech = () => {
    if (!currentQuestion) return;
    
    const isCorrect = handleSubmitAnswer(currentQuestion);
    
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

  const handleNextQuestionWithState = () => {
    if (currentQuestionIndex < questions.length - 1) {
      moveToNextQuestion();
      
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
  }, [currentQuestionIndex, autoReadEnabled, currentQuestion, showResult, hasReadQuestion, speakText, setHasReadQuestion]);

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
      <NelieAvatarSection
        isSpeaking={isSpeaking}
        autoReadEnabled={autoReadEnabled}
        hasUserInteracted={true}
        isReady={true}
        onToggleMute={handleMuteToggle}
        onReadRequest={readQuestion}
        engagementLevel={75}
        adaptiveSpeed={1.0}
        // Legacy props for backward compatibility
        subject={subject}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onMuteToggle={handleMuteToggle}
        onReadQuestion={readQuestion}
      />

      <LessonQuestionCard
        question={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        score={score}
        onAnswerSelect={handleAnswerSelect}
        onSubmitAnswer={handleSubmitAnswerWithSpeech}
        onNextQuestion={handleNextQuestionWithState}
      />
    </div>
  );
};

export default InteractiveLessonSession;
