
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play } from 'lucide-react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';
import NelieAvatarSection from './NelieAvatarSection';
import QuestionDisplay from './QuestionDisplay';
import AnswerOptions from './AnswerOptions';
import QuestionResult from './QuestionResult';
import LessonControls from './LessonControls';

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
      <NelieAvatarSection
        subject={subject}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isSpeaking={isSpeaking}
        autoReadEnabled={autoReadEnabled}
        onMuteToggle={handleMuteToggle}
        onReadQuestion={readQuestion}
      />

      <QuestionDisplay
        question={currentQuestion.question}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        score={score}
        showResult={showResult}
      />

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-6 p-6">
          <AnswerOptions
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentQuestion.correctAnswer}
            showResult={showResult}
            onAnswerSelect={handleAnswerSelect}
          />

          <QuestionResult
            showResult={showResult}
            isCorrect={selectedAnswer === currentQuestion.correctAnswer}
            explanation={currentQuestion.explanation}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />

          <LessonControls
            showResult={showResult}
            selectedAnswer={selectedAnswer}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveLessonSession;
