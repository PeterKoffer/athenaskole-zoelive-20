
import { useState, useEffect, useMemo } from "react";
import ProgressHeader from "./ProgressHeader"; // Assuming this will be adapted or is generic enough
import QuestionCard from "./QuestionCard";   // Assuming this will be adapted or is generic enough
import ResultCard from "./ResultCard";     // Assuming this will be adapted or is generic enough
import { LanguageLabLesson, ExerciseQuestion, VocabularyItem, LessonSection } from "./types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button"; // For "Next Section" etc.
import { Volume2, BookOpenText } from "lucide-react";

interface LessonViewProps {
  currentLesson: LanguageLabLesson | null;
  isLoadingLesson: boolean;
  currentLanguageCode: string; // e.g., "en", "es"
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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | undefined>(undefined); // Can be string or number
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Memoize questions from the current exercise section
  const exerciseQuestions = useMemo(() => {
    if (!currentLesson || !currentLesson.sections) return [];
    const exerciseSection = currentLesson.sections.find(sec => sec.type === 'exercises');
    return exerciseSection?.questions || [];
  }, [currentLesson]);

  const currentSection = currentLesson?.sections[currentSectionIndex];
  const currentQuestionData = currentSection?.type === 'exercises' ? exerciseQuestions[currentQuestionIndex] : undefined;

  useEffect(() => {
    // Reset states when lesson changes
    // TODO: Enhance audio playback:
    // - Implement robust playback for pre-recorded audio files specified in lesson data (item.audio, question.audioPrompt).
    // - Fallback to TTS only if dedicated audio is missing.
    // - Consider an audio player component with controls.
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(undefined);
    setShowResult(false);
    setIsCorrect(false);
  }, [currentLesson]);

  const playAudio = (text: string, langCode: string = currentLanguageCode) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Basic language mapping, can be expanded
      const langMap: { [key: string]: string } = {
        en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', zh: 'zh-CN', da: 'da-DK', pt: 'pt-PT'
      };
      utterance.lang = langMap[langCode] || 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.cancel(); // Cancel any ongoing speech
      speechSynthesis.speak(utterance);
    } else if (text) { // Fallback for audio file path (conceptual)
      console.log(`Playing audio file: ${text}`);
      // const audio = new Audio(text); // This would require files to be served correctly
      // audio.play().catch(e => console.error("Error playing audio file:", e));
    }
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const checkAnswer = () => {
    if (!currentQuestionData) return;

    let correct = false;
    if (currentQuestionData.type === "multipleChoice" && typeof currentQuestionData.correctOptionIndex === 'number') {
      correct = selectedAnswer === currentQuestionData.correctOptionIndex;
    } else if (currentQuestionData.type === "translate" && currentQuestionData.targetLanguageText) {
      // For translation, direct string comparison (case-insensitive, trim whitespace)
      correct = typeof selectedAnswer === 'string' &&
                selectedAnswer.trim().toLowerCase() === currentQuestionData.targetLanguageText.trim().toLowerCase();
    }
    // Add more logic for other question types (fillInBlank, etc.)

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      onXpGained(10); // Example XP
      // Play audio feedback if available (e.g., correct term or example sentence)
      const audioToPlay = currentQuestionData.audioPrompt || currentQuestionData.feedbackCorrect;
      if (audioToPlay) {
         setTimeout(() => playAudio(audioToPlay), 300);
      }
    } else {
      onHeartLost();
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(undefined);
    setIsCorrect(false);

    if (currentSection?.type === 'exercises' && currentQuestionIndex < exerciseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else { // Move to next section or complete lesson
      if (currentLesson && currentSectionIndex < currentLesson.sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0); // Reset question index for new section
      } else {
        onLessonComplete();
      }
    }
  };

  if (isLoadingLesson) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!currentLesson) {
    return <div className="text-center p-8 text-gray-400">No lesson loaded. Please select a lesson.</div>;
  }

  const renderSectionContent = (section: LessonSection) => {
    switch (section.type) {
      case 'vocabulary':
        return (
          <div className="space-y-3">
            {section.items?.map((item: VocabularyItem, index: number) => (
              <Card key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold text-lime-300">{item.term}</p>
                    <p className="text-md text-gray-300">{item.translation}</p>
                  </div>
                  {item.audio && (
                    <Button variant="ghost" size="icon" onClick={() => playAudio(item.term, currentLesson.languageCode)}>
                      <Volume2 className="w-6 h-6 text-purple-400" />
                    </Button>
                  )}
                </div>
                {item.exampleSentence && <p className="text-sm text-gray-400 mt-1 italic">E.g.: "{item.exampleSentence}"</p>}
              </Card>
            ))}
          </div>
        );
      case 'exercises':
        if (!currentQuestionData) {
          return <p className="text-gray-400">End of exercises in this section or no exercises.</p>;
        }
        // QuestionCard expects onAnswerSelect to pass index for multiple choice.
        // We need to adapt if QuestionCard is rigid or make QuestionCard more flexible.
        // For now, assuming QuestionCard can handle the new `ExerciseQuestion` structure.
        return (
          <QuestionCard
            questionData={currentQuestionData}
            onAnswer={handleAnswerSelect} // QuestionCard needs to call this with string or number
            // selectedAnswer={selectedAnswer} // QuestionCard might manage its own internal selection state
            currentLanguage={currentLanguageCode} // Pass code for TTS
          />
          // TODO: When enhancing QuestionCard or exercise interactions:
          // - Implement rendering and interaction logic for new question types (speaking, listening, sentence construction).
          // - For speaking exercises, integrate with speech recognition services.
          // - Provide more nuanced feedback for incorrect answers (e.g., identifying common error types).
        );
      case 'grammar':
        // TODO: Implement rendering for structured grammar explanations and examples.
        return <p className="text-gray-400">Grammar section rendering (TODO)</p>;
      case 'dialogue':
        // TODO: Implement rendering for interactive dialogues.
        return <p className="text-gray-400">Dialogue section rendering (TODO)</p>;
      case 'cultureNote':
        // TODO: Implement rendering for cultural notes.
        return <p className="text-gray-400">Cultural note rendering (TODO)</p>;
      default:
        return <p className="text-gray-400">Unsupported section type: {section.type}</p>;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl space-y-6">
      <ProgressHeader
        hearts={hearts}
        streak={0} // Streak is managed by LanguageLearning parent, not passed here directly for lesson view
        xp={xp}
        // Pass lesson title and progress if needed by ProgressHeader
        // currentLessonTitle={currentLesson.title}
        // currentProgress={(currentSectionIndex + 1) / (currentLesson.sections.length)}
        onBack={onBack}
        languageName={currentLesson.languageName || currentLanguageCode.toUpperCase()}
      />

      <div className="p-5 bg-gray-700/50 rounded-lg border border-gray-600">
        <h2 className="text-2xl font-bold text-lime-400 mb-1 flex items-center">
          <BookOpenText className="w-7 h-7 mr-2 text-purple-400"/> {currentSection?.title || currentLesson.title}
        </h2>
        <p className="text-sm text-gray-400 mb-4">Section {currentSectionIndex + 1} of {currentLesson.sections.length}</p>
        {currentSection && renderSectionContent(currentSection)}
      </div>

      {showResult && currentSection?.type === 'exercises' && currentQuestionData && (
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={currentQuestionData.type === 'multipleChoice' ? currentQuestionData.options?.[currentQuestionData.correctOptionIndex!] : currentQuestionData.targetLanguageText}
          userAnswer={selectedAnswer?.toString()} // Convert number to string if needed
          feedback={isCorrect ? currentQuestionData.feedbackCorrect : currentQuestionData.feedbackIncorrect}
          onNext={handleNext}
        />
      )}

      {!showResult && currentSection?.type === 'exercises' && currentQuestionData && (
        <Button
          onClick={checkAnswer}
          disabled={selectedAnswer === undefined}
          className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-500"
        >
          Check Answer
        </Button>
      )}

      {/* Button to proceed to next section if current section is not exercises or exercises are done */}
      {!showResult && (currentSection?.type !== 'exercises' || !currentQuestionData) && (
         <Button
          onClick={handleNext}
          className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600"
        >
          {currentLesson && currentSectionIndex < currentLesson.sections.length - 1 ? 'Next Section' : 'Finish Lesson'}
        </Button>
      )}
    </div>
  );
};

export default LessonView;
