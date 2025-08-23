
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";   
import ResultCard from "./ResultCard";
import LessonHeader from "./LessonHeader";
import SectionRenderer from "./SectionRenderer";
import LessonControls from "./LessonControls";
import { LanguageLabLesson } from "./types";
import { useLessonState } from "./hooks/useLessonState";
import { useLessonNavigation } from "./hooks/useLessonNavigation";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAnswerHandler } from "./hooks/useAnswerHandler";

interface LessonViewProps {
  currentLesson: LanguageLabLesson | null;
  isLoadingLesson: boolean;
  currentLanguageCode: string;
  hearts: number;
  xp: number;
  onBack: () => void;
  onLessonComplete: () => void;
  onHeartLost: () => void;
  onXpGained: (amount: number) => void;
}

const LessonView = ({
  currentLesson,
  isLoadingLesson,
  currentLanguageCode,
  hearts,
  xp,
  onBack,
  onLessonComplete,
  onHeartLost,
  onXpGained
}: LessonViewProps) => {
  const {
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
  } = useLessonState(currentLesson);

  const { handleNext } = useLessonNavigation({
    currentLesson,
    currentSectionIndex,
    currentQuestionIndex,
    exerciseQuestions,
    setCurrentSectionIndex,
    setCurrentQuestionIndex,
    resetState,
    onLessonComplete
  });

  const { playAudio } = useAudioPlayer(currentLanguageCode);

  const { checkAnswer } = useAnswerHandler({
    currentQuestionData,
    selectedAnswer,
    setIsCorrect,
    setShowResult,
    onXpGained,
    onHeartLost,
    playAudio
  });

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  if (isLoadingLesson) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!currentLesson) {
    return <div className="text-center p-8 text-gray-400">No lesson loaded. Please select a lesson.</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl space-y-6">
      <ProgressHeader
        hearts={hearts}
        xp={xp}
        currentLesson={{
          title: currentLesson.title,
          questions: exerciseQuestions.map(q => ({
            question: q.prompt,
            options: q.options || [],
            correct: q.correctOptionIndex || 0
          }))
        }}
        currentQuestion={currentQuestionIndex}
        onBack={onBack}
      />

      {currentSection && (
        <LessonHeader
          title={currentSection.title || currentLesson.title}
          currentSectionIndex={currentSectionIndex}
          totalSections={currentLesson.sections.length}
        />
      )}

      {currentSection && currentSection.type !== 'exercises' && (
        <SectionRenderer
          section={currentSection}
          currentLanguageCode={currentLanguageCode}
          playAudio={playAudio}
        />
      )}

      {currentSection?.type === 'exercises' && currentQuestionData && (
        <QuestionCard
          question={{
            question: currentQuestionData.prompt,
            options: currentQuestionData.options || [],
            correct: currentQuestionData.correctOptionIndex || 0,
            audio: currentQuestionData.audioPrompt
          }}
          selectedAnswer={selectedAnswer?.toString() || ''}
          showResult={showResult}
          isCorrect={isCorrect}
          selectedLanguage={currentLanguageCode}
          onAnswerSelect={(index) => handleAnswerSelect(index)}
          onCheckAnswer={checkAnswer}
        />
      )}

      {showResult && currentSection?.type === 'exercises' && currentQuestionData && (
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={currentQuestionData.type === 'multipleChoice' ? currentQuestionData.options?.[currentQuestionData.correctOptionIndex!] : currentQuestionData.targetLanguageText}
          userAnswer={selectedAnswer?.toString()}
          feedback={isCorrect ? currentQuestionData.feedbackCorrect : currentQuestionData.feedbackIncorrect}
          onNext={handleNext}
        />
      )}

      <LessonControls
        showResult={showResult}
        isExerciseSection={currentSection?.type === 'exercises'}
        hasCurrentQuestion={!!currentQuestionData}
        selectedAnswer={selectedAnswer}
        onCheckAnswer={checkAnswer}
        onNext={handleNext}
        isLastSection={currentLesson && currentSectionIndex >= currentLesson.sections.length - 1}
      />
    </div>
  );
};

export default LessonView;
