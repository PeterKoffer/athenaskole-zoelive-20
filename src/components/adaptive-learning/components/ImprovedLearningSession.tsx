
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import GradeContentSetup from './GradeContentSetup';
import TopicExplanation from './TopicExplanation';
import LoadingStates from './LoadingStates';
import SessionHeader from './SessionHeader';
import QuestionDisplay from './QuestionDisplay';
import ImprovedSessionManager from './ImprovedSessionManager';
import GameEngine from '@/components/games/engine/GameEngine'; // Import GameEngine

interface ImprovedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const ImprovedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: ImprovedLearningSessionProps) => {
  const { user } = useAuth();
  const { gradeConfig } = useGradeLevelContent(subject);
  
  const [gradeContentConfig, setGradeContentConfig] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(true);

  const handleContentGenerated = (contentConfig: any) => {
    setGradeContentConfig(contentConfig);
    console.log('📚 Using grade-appropriate content configuration:', contentConfig);
  };

  const handleStartQuestions = () => {
    console.log('📖 Moving from explanation to questions phase');
    setShowExplanation(false);
  };

  if (!user) {
    return <LoadingStates type="login-required" />;
  }

  // Show grade-level content configuration first
  if (!gradeContentConfig) {
    return (
      <GradeContentSetup
        subject={subject}
        skillArea={skillArea}
        onBack={onBack}
        onContentGenerated={handleContentGenerated}
      />
    );
  }

  // Show topic explanation before questions
  if (showExplanation) {
    return (
      <TopicExplanation
        subject={subject}
        skillArea={skillArea}
        gradeLevel={gradeConfig?.userGrade}
        standardInfo={gradeContentConfig.standard}
        onStartQuestions={handleStartQuestions}
      />
    );
  }

  return (
    <ImprovedSessionManager
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      gradeContentConfig={gradeContentConfig}
    >
      {(sessionData) => {
        const {
          currentActivity, // Changed from currentQuestion
          selectedAnswer,
          showResult,
          questionNumber,
          totalQuestions,
          correctAnswers,
          isGenerating,
          gradeLevel,
          loadNextQuestion,
          handleAnswerSelect
        } = sessionData;

          handleGameComplete, // New handler from sessionData
        } = sessionData;

        // Generate first activity after explanation phase
        useEffect(() => {
          if (user?.id && gradeContentConfig && !currentActivity && !isGenerating) {
            console.log('🎬 Starting grade-appropriate session for Grade', gradeLevel);
            loadNextQuestion();
          }
        }, [user?.id, gradeContentConfig, currentActivity, isGenerating, gradeLevel, loadNextQuestion]);

        const handleRefresh = () => {
          if (!isGenerating) {
            loadNextQuestion();
          }
        };

        if (isGenerating && !currentActivity) {
          return (
            <LoadingStates 
              type="generating" 
              gradeLevel={gradeLevel}
              standardCode={gradeContentConfig.standard?.code}
            />
          );
        }

        if (!currentActivity) {
          return (
            <LoadingStates 
              type="no-question"
              onRefresh={handleRefresh}
            />
          );
        }

        // Conditional rendering based on activity type
        if (currentActivity.type === 'interactive-game' && currentActivity.gameData) {
          return (
            <GameEngine
              game={currentActivity.gameData}
              onComplete={(score) => {
                console.log("GameEngine onComplete score:", score); // For debugging
                handleGameComplete(score); // Use the new handler
              }}
              onBack={onBack}
            />
          );
        } else if (currentActivity.type === 'interactive-question') {
          return (
            <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
              <CardHeader>
                <SessionHeader
                  onBack={onBack}
                  gradeLevel={gradeLevel}
                  subject={subject}
                  questionNumber={questionNumber}
                  totalQuestions={totalQuestions}
                  standardCode={gradeContentConfig.standard?.code}
                  correctAnswers={correctAnswers}
                  showResult={showResult}
                  isGenerating={isGenerating}
                  onRefresh={handleRefresh}
                />
              </CardHeader>
              <CardContent className="p-6">
                <QuestionDisplay
                  question={currentActivity.question}
                  options={currentActivity.options}
                  selectedAnswer={selectedAnswer}
                  correctAnswer={currentActivity.correct}
                  showResult={showResult}
                  explanation={currentActivity.explanation}
                  standardInfo={gradeContentConfig.standard ? {
                    code: gradeContentConfig.standard.code,
                    title: gradeContentConfig.standard.title
                  } : undefined}
                  questionNumber={questionNumber}
                  totalQuestions={totalQuestions}
                  onAnswerSelect={handleAnswerSelect}
                  subject={subject} // Pass subject to QuestionDisplay
                />
              </CardContent>
            </Card>
          );
        }
        // Fallback or loading for unknown activity type
        return <LoadingStates type="generating" gradeLevel={gradeLevel} />;
      }}
    </ImprovedSessionManager>
  );
};

export default ImprovedLearningSession;
