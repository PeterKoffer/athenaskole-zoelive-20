
import React, { useState, useEffect } from 'react';
import { LearningAtom } from '@/types/learning';
import { useAdaptiveLearningSession } from '@/hooks/useAdaptiveLearningSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingUp, TrendingDown } from 'lucide-react';
import stealthAssessmentService from '@/services/stealthAssessmentService';
import { InteractionEventType, InteractionEventContext } from '@/types/stealthAssessment'; // Assuming InteractionEventContext is here
import { v4 as uuidv4 } from 'uuid'; // For generating eventId if not handled by service's createFullEvent

interface AdaptiveLearningAtomRendererProps {
  atom: LearningAtom;
  eventContext?: InteractionEventContext; // Allow context to be passed in
  onComplete: (performance: any) => void;
}

const AdaptiveLearningAtomRenderer: React.FC<AdaptiveLearningAtomRendererProps> = ({
  atom,
  onComplete
}) => {
  const {
    currentAtom,
    isAdapting,
    adaptationReason,
    currentAttempt,
    sessionDurationSeconds,
    recordResponse,
    completeSession,
    getSessionMetrics
  } = useAdaptiveLearningSession(atom);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [questionLoadTime, setQuestionLoadTime] = useState<number>(0);

  useEffect(() => {
    if (currentAtom) {
      setQuestionLoadTime(Date.now());
      stealthAssessmentService.logContentView({
        contentAtomId: currentAtom.id,
        knowledgeComponentIds: currentAtom.knowledgeComponentIds || [currentAtom.curriculumObjectiveId || 'unknown_kc_atom_load'],
        contentType: 'LEARNING_ATOM_QUESTION_LOADED',
        // eventContext can be passed as a prop or defaulted
      }, `AdaptiveLearningAtomRenderer-Load-${currentAtom.id}`);
    }
  }, [currentAtom?.id]); // Trigger when currentAtom or its ID changes


  // Mock question data - in real implementation, this would come from the atom's content
  const mockQuestions = {
    easy: {
      question: "What is 2 + 3?",
      options: ["4", "5", "6", "7"],
      correct: 1,
      hints: ["Think about counting on your fingers", "Start with 2 and add 3 more"]
    },
    medium: {
      question: "What is 12 + 8?",
      options: ["18", "20", "22", "24"],
      correct: 1,
      hints: ["Break it down: 12 + 8 = 12 + 10 - 2", "Think about making 10 first"]
    },
    hard: {
      question: "What is 347 + 258?",
      options: ["595", "605", "615", "625"],
      correct: 1,
      hints: ["Start with the ones place", "Don't forget to carry over"]
    }
  };

  const currentQuestion = currentAtom ? mockQuestions[currentAtom.difficulty] : mockQuestions.medium;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex.toString());
    const isCorrect = answerIndex === currentQuestion.correct;
    
    recordResponse(isCorrect, hintsUsed); // This hook likely handles internal state for attempts, etc.
    setShowFeedback(true);

    const timeTakenMs = Date.now() - questionLoadTime;

    stealthAssessmentService.logQuestionAttempt({
      questionId: currentAtom?.id || 'unknown_question', // Use currentAtom.id as questionId
      knowledgeComponentIds: currentAtom?.knowledgeComponentIds || [currentAtom?.curriculumObjectiveId || 'unknown_kc_atom_answer'],
      answerGiven: currentQuestion.options[answerIndex],
      isCorrect: isCorrect,
      attemptsMade: currentAttempt, // from useAdaptiveLearningSession hook
      timeTakenMs: timeTakenMs,
      // eventContext can be passed as a prop or defaulted
    }, `AdaptiveLearningAtomRenderer-Submit-${currentAtom?.id}`);


    if (isCorrect) {
      setTimeout(() => {
        const performance = completeSession();
        if (performance) {
          onComplete(performance);
        }
      }, 2000);
    } else {
      // Allow retry or show feedback longer before next action
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        // Potentially log a "retry_initiated" or similar if applicable
      }, 3000); // Increased time for feedback visibility on wrong answer
    }
  };

  const handleHintRequest = () => {
    const newHintsUsed = hintsUsed + 1;
    setHintsUsed(newHintsUsed);

    if (currentAtom && currentQuestion.hints[newHintsUsed -1]) {
      stealthAssessmentService.logHintUsage({
        questionId: currentAtom.id,
        knowledgeComponentIds: currentAtom.knowledgeComponentIds || [currentAtom.curriculumObjectiveId || 'unknown_kc_atom_hint'],
        hintId: `hint_${newHintsUsed}`, // Or actual hint text/ID if available
        hintLevel: newHintsUsed,
        // eventContext can be passed as a prop or defaulted
      }, `AdaptiveLearningAtomRenderer-Hint-${currentAtom.id}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdaptationIcon = (reason: string | null) => {
    if (!reason) return null;
    if (reason.includes('struggle')) return <TrendingDown className="w-4 h-4 text-blue-500" />;
    if (reason.includes('mastery')) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <Brain className="w-4 h-4 text-purple-500" />;
  };

  if (!currentAtom) {
    return <div>Loading atom...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Adaptation Status */}
      {isAdapting && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-blue-700 font-medium">Adapting to your learning style...</span>
            </div>
            {adaptationReason && (
              <p className="text-sm text-blue-600 mt-2">{adaptationReason}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentAtom.content.title}</CardTitle>
            <div className="flex items-center space-x-2">
              {getAdaptationIcon(adaptationReason)}
              <Badge className={getDifficultyColor(currentAtom.difficulty)}>
                {currentAtom.difficulty}
              </Badge>
              {currentAtom.variantId && (
                <Badge variant="outline" className="text-xs">
                  Adapted
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Narrative Context */}
          <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
            <p className="text-purple-800 text-sm italic">{currentAtom.narrativeContext}</p>
          </div>

          {/* Adaptive Instructions */}
          {currentAtom.content.data?.adaptiveModifications?.simplifiedInstructions && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                💡 {currentAtom.content.data.adaptiveModifications.simplifiedInstructions}
              </p>
            </div>
          )}

          {/* Question */}
          <div className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index.toString() ? "default" : "outline"}
                className={`p-4 h-auto ${
                  showFeedback && selectedAnswer === index.toString()
                    ? index === currentQuestion.correct
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback || isAdapting}
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Hints */}
          {hintsUsed < currentQuestion.hints.length && !showFeedback && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHintRequest}
              className="text-blue-600 hover:text-blue-800"
            >
              💡 Need a hint? ({hintsUsed}/{currentQuestion.hints.length} used)
            </Button>
          )}

          {/* Show Hints */}
          {hintsUsed > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Hint:</strong> {currentQuestion.hints[hintsUsed - 1]}
              </p>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-3 rounded-lg ${
              selectedAnswer === currentQuestion.correct.toString()
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <p className={`font-medium ${
                selectedAnswer === currentQuestion.correct.toString()
                  ? "text-green-800"
                  : "text-red-800"
              }`}>
                {selectedAnswer === currentQuestion.correct.toString()
                  ? "🎉 Correct! Great job!"
                  : "Not quite. Let's try again!"}
              </p>
            </div>
          )}

          {/* Advanced Challenges (for hard difficulty) */}
          {currentAtom.content.data?.adaptiveModifications?.advancedChallenges && (
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm">
                <strong>🏆 Bonus Challenge:</strong> {currentAtom.content.data.adaptiveModifications.advancedChallenges[0]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-700">{currentAttempt}</div>
              <div className="text-xs text-gray-500">Attempts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">{Math.round(sessionDurationSeconds)}s</div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">{hintsUsed}</div>
              <div className="text-xs text-gray-500">Hints Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningAtomRenderer;
