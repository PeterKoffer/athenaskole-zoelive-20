
import { useCallback } from "react";
import { LanguageLabLesson, ExerciseQuestion } from "../types";

interface UseLessonNavigationProps {
  currentLesson: LanguageLabLesson | null;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  exerciseQuestions: ExerciseQuestion[];
  setCurrentSectionIndex: (index: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  resetState: () => void;
  onLessonComplete: () => void;
}

export const useLessonNavigation = ({
  currentLesson,
  currentSectionIndex,
  currentQuestionIndex,
  exerciseQuestions,
  setCurrentSectionIndex,
  setCurrentQuestionIndex,
  resetState,
  onLessonComplete
}: UseLessonNavigationProps) => {
  
  const handleNext = useCallback(() => {
    resetState();

    const currentSection = currentLesson?.sections[currentSectionIndex];
    
    if (currentSection?.type === 'exercises' && currentQuestionIndex < exerciseQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentLesson && currentSectionIndex < currentLesson.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        onLessonComplete();
      }
    }
  }, [
    currentLesson,
    currentSectionIndex,
    currentQuestionIndex,
    exerciseQuestions.length,
    setCurrentSectionIndex,
    setCurrentQuestionIndex,
    resetState,
    onLessonComplete
  ]);

  return { handleNext };
};
