
import { useCallback } from "react";
import { ExerciseQuestion } from "../types";

interface UseAnswerHandlerProps {
  currentQuestionData: ExerciseQuestion | undefined;
  selectedAnswer: string | number | undefined;
  setIsCorrect: (correct: boolean) => void;
  setShowResult: (show: boolean) => void;
  onXpGained: (amount: number) => void;
  onHeartLost: () => void;
  playAudio: (text: string, langCode?: string) => void;
}

export const useAnswerHandler = ({
  currentQuestionData,
  selectedAnswer,
  setIsCorrect,
  setShowResult,
  onXpGained,
  onHeartLost,
  playAudio
}: UseAnswerHandlerProps) => {
  
  const handleAnswerSelect = useCallback((answer: string | number) => {
    // This will be handled by the parent component
  }, []);

  const checkAnswer = useCallback(() => {
    if (!currentQuestionData) return;

    let correct = false;
    if (currentQuestionData.type === "multipleChoice" && typeof currentQuestionData.correctOptionIndex === 'number') {
      correct = selectedAnswer === currentQuestionData.correctOptionIndex;
    } else if (currentQuestionData.type === "translate" && currentQuestionData.targetLanguageText) {
      correct = typeof selectedAnswer === 'string' &&
                selectedAnswer.trim().toLowerCase() === currentQuestionData.targetLanguageText.trim().toLowerCase();
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      onXpGained(10);
      const audioToPlay = currentQuestionData.audioPrompt || currentQuestionData.feedbackCorrect;
      if (audioToPlay) {
         setTimeout(() => playAudio(audioToPlay), 300);
      }
    } else {
      onHeartLost();
    }
  }, [currentQuestionData, selectedAnswer, setIsCorrect, setShowResult, onXpGained, onHeartLost, playAudio]);

  return { handleAnswerSelect, checkAnswer };
};
