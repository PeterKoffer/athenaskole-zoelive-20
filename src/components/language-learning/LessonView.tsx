
import { useState } from "react";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";
import { Lesson } from "./types";

interface LessonViewProps {
  currentLesson: Lesson;
  selectedLanguage: string;
  hearts: number;
  xp: number;
  onBack: () => void;
  onLessonComplete: () => void;
  onHeartLost: () => void;
  onXpGained: (amount: number) => void;
}

const LessonView = ({ 
  currentLesson, 
  selectedLanguage, 
  hearts, 
  xp, 
  onBack, 
  onLessonComplete, 
  onHeartLost, 
  onXpGained 
}: LessonViewProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestionData = currentLesson.questions[currentQuestion];

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'spanish' ? 'es-ES' : 
                      selectedLanguage === 'french' ? 'fr-FR' :
                      selectedLanguage === 'german' ? 'de-DE' :
                      selectedLanguage === 'italian' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const checkAnswer = () => {
    const correct = parseInt(selectedAnswer) === currentQuestionData.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      onXpGained(10);
      if (currentQuestionData.audio) {
        setTimeout(() => playAudio(currentQuestionData.audio!), 500);
      }
    } else {
      onHeartLost();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentLesson.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onLessonComplete();
    }
    
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      <ProgressHeader
        hearts={hearts}
        xp={xp}
        currentLesson={currentLesson}
        currentQuestion={currentQuestion}
        onBack={onBack}
      />

      {!showResult ? (
        <QuestionCard
          question={currentQuestionData}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          selectedLanguage={selectedLanguage}
          onAnswerSelect={handleAnswerSelect}
          onCheckAnswer={checkAnswer}
        />
      ) : (
        <ResultCard
          isCorrect={isCorrect}
          isLastQuestion={currentQuestion === currentLesson.questions.length - 1}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
};

export default LessonView;
