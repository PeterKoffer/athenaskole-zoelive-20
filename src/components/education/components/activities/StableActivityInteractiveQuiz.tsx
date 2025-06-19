
import Blackboard from '../shared/Blackboard';
import { LessonActivity } from '../types/LessonTypes';
import { StableQuizHeader } from './stable-quiz/StableQuizHeader';
import { StableQuizBattleContext } from './stable-quiz/StableQuizBattleContext';
import { StableQuizQuestion } from './stable-quiz/StableQuizQuestion';
import { StableQuizOptions } from './stable-quiz/StableQuizOptions';
import { StableQuizResult } from './stable-quiz/StableQuizResult';
import { StableQuizSubmitButton } from './stable-quiz/StableQuizSubmitButton';
import { useStableQuizLogic } from './stable-quiz/hooks/useStableQuizLogic';

interface StableActivityInteractiveQuizProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const StableActivityInteractiveQuiz = ({
  activity,
  onActivityComplete
}: StableActivityInteractiveQuizProps) => {
  const {
    stableContent,
    selectedAnswer,
    showResult,
    timeLeft,
    score,
    handleAnswerSelect,
    handleSubmit
  } = useStableQuizLogic({ activity, onActivityComplete });

  // Prioritize unique content elements for display
  const quizTitle = activity.content.uniqueTheme || stableContent?.title || activity.title || "Quiz Challenge";
  const scenarioForBattle = activity.content.uniqueActivity || activity.content.uniqueScenario || stableContent?.battleScenario || "Test your knowledge!";

  console.log('🎯 StableActivityInteractiveQuiz render:', {
    activityId: activity.id,
    hasStableContent: !!stableContent,
    showResult,
    selectedAnswer,
    renderTime: Date.now()
  });

  // Don't render until content is stable
  if (!stableContent) {
    console.log('⏳ Waiting for stable content...');
    return (
      <Blackboard>
        <div className="text-center text-white p-8">
          <div className="text-2xl mb-4">⏳</div>
          <p className="text-xl">Loading question...</p>
        </div>
      </Blackboard>
    );
  }

  console.log('🎮 Rendering stable quiz with state:', { 
    selectedAnswer, 
    showResult, 
    timeLeft, 
    score,
    question: stableContent.question.substring(0, 30) + '...'
  });

  return (
    <Blackboard>
      <div className="space-y-6">
        <StableQuizHeader
          title={quizTitle}
          timeLeft={timeLeft}
          score={score}
        />

        <StableQuizBattleContext battleScenario={scenarioForBattle} />

        <StableQuizQuestion question={stableContent.question} />

        {!showResult ? (
          <>
            <StableQuizOptions
              options={stableContent.options}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              activityId={stableContent.activityId}
            />
            <StableQuizSubmitButton
              onSubmit={handleSubmit}
              disabled={selectedAnswer === null}
            />
          </>
        ) : (
          <StableQuizResult
            isCorrect={selectedAnswer === stableContent.correctAnswer}
            explanation={stableContent.explanation}
          />
        )}
      </div>
    </Blackboard>
  );
};

export default StableActivityInteractiveQuiz;
