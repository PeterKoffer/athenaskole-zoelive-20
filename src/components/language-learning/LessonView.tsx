import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import ProgressHeader from "./ProgressHeader";
import QuestionCard from "./QuestionCard";   
import ResultCard from "./ResultCard";     
import { LanguageLabLesson, ExerciseQuestion, VocabularyItem, LessonSection } from "./types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Volume2, BookOpenText } from "lucide-react";

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

  const playAudio = (text: string, langCode: string = currentLanguageCode) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: { [key: string]: string } = {
        en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', zh: 'zh-CN', da: 'da-DK', pt: 'pt-PT'
      };
      utterance.lang = langMap[langCode] || 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else if (text) {
      console.log(`Playing audio file: ${text}`);
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
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(undefined);
    setIsCorrect(false);

    if (currentSection?.type === 'exercises' && currentQuestionIndex < exerciseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (currentLesson && currentSectionIndex < currentLesson.sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
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
        return (
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
        );
      case 'grammar':
        return <p className="text-gray-400">Grammar section rendering (TODO)</p>;
      case 'dialogue':
        return <p className="text-gray-400">Dialogue section rendering (TODO)</p>;
      case 'cultureNote':
        return <p className="text-gray-400">Cultural note rendering (TODO)</p>;
      default:
        return <p className="text-gray-400">Unsupported section type: {section.type}</p>;
    }
  };

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
          userAnswer={selectedAnswer?.toString()}
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
