
import { useState, useEffect, useMemo } from "react";
import { LanguageLabLesson, ExerciseQuestion } from "../types";

export const useLessonState = (currentLesson: LanguageLabLesson | null) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | undefined>(undefined);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exerciseQuestions = useMemo(() => {
    if (!currentLesson || !currentLesson.sections) return [];
    const exerciseSection = currentLesson.sections.find(sec => sec.type === 'exercises');
    return exerciseSection?.questions || [];
  }, [currentLesson]);

  const currentSection = currentLesson?.sections[currentSectionIndex];
  const currentQuestionData = currentSection?.type === 'exercises' ? exerciseQuestions[currentQuestionIndex] : undefined;

  useEffect(() => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setShowResult(false);
    setIsCorrect(false);
  }, [currentLesson]);

  const resetState = () => {
    setShowResult(false);
    setSelectedAnswer(undefined);
    setIsCorrect(false);
  };

  return {
    currentSectionIndex,
    setCurrentSectionIndex,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    showResult,
    setShowResult,
    isCorrect,
    setIsCorrect,
    exerciseQuestions,
    currentSection,
    currentQuestionData,
    resetState
  };
};
