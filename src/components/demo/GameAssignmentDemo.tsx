import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeacherGameAssignments from '@/components/teacher/TeacherGameAssignments';
import GameAnalyticsDashboard from '@/components/teacher/GameAnalyticsDashboard';
import StudentGameAssignments from '@/components/games/StudentGameAssignments';
import { GameEngine } from '@/components/games/GameEngine';
import { useAuth } from '@/hooks/useAuth';

/**
 * Demonstration component showing how the new game assignment and tracking
 * system integrates with the existing ZOELIVE platform.
 * 
 * This component can be used as a reference for integrating the game
 * assignment features into existing teacher and student interfaces.
 */
const GameAssignmentDemo = () => {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [assignmentId, setAssignmentId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState('assignments');

  // Mock game config for demonstration
  const demoGameConfig = {
    id: selectedGame || 'demo-game',
    title: 'Demo Educational Game',
    subject: 'mathematics',
    interactionType: 'multiple-choice' as const,
    difficulty: 2,
    gradeLevel: [3, 4, 5],
    objectives: ['Understand basic arithmetic', 'Apply problem-solving skills'],
    maxScore: 100,
    timeLimit: 600, // 10 minutes
    adaptiveRules: {
      successThreshold: 80,
      failureThreshold: 40,
      difficultyIncrease: 1,
      difficultyDecrease: 1
    }
  };

  const handleGameSelect = (gameId: string, gameAssignmentId?: string) => {
    setSelectedGame(gameId);
    setAssignmentId(gameAssignmentId);
    setActiveTab('play');
  };

  const handleGameComplete = (finalScore: number, achievements: string[]) => {
    console.log('Game completed!', { finalScore, achievements });
    setSelectedGame(null);
    setAssignmentId(undefined);
    setActiveTab('assignments');
  };

  const handleBackToAssignments = () => {
    setSelectedGame(null);
    setAssignmentId(undefined);
    setActiveTab('assignments');
  };

  // Determine user role for demo purposes
  const isTeacher = user?.email?.includes('teacher') || user?.role === 'teacher';

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <GameEngine
          gameConfig={demoGameConfig}
          assignmentId={assignmentId}
          onComplete={handleGameComplete}
          onBack={handleBackToAssignments}
        >
          {(gameState, gameActions) => (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-white mb-4">Demo Game Interface</h2>
              <p className="text-gray-400 mb-6">
                This is where the actual game content would be rendered.
                The GameEngine provides tracking and state management.
              </p>
              <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between text-white">
                    <span>Score:</span>
                    <span>{gameState.score}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Level:</span>
                    <span>{gameState.level}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Time:</span>
                    <span>{Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => gameActions.updateScore(10)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  >
                    Add 10 Points (Test Tracking)
                  </button>
                  <button
                    onClick={() => gameActions.recordHintUsed()}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
                  >
                    Use Hint (Test Tracking)
                  </button>
                  <button
                    onClick={() => gameActions.completeObjective(demoGameConfig.objectives[0])}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    Complete First Objective
                  </button>
                  <button
                    onClick={() => gameActions.completeGame()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                  >
                    Complete Game
                  </button>
                </div>
              </div>
            </div>
          )}
        </GameEngine>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Educational Games Integration Demo
          </h1>
          <p className="text-gray-400">
            Demonstration of the new game assignment and tracking system for the ZOELIVE platform.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            {isTeacher ? (
              <>
                <TabsTrigger value="assignments" className="data-[state=active]:bg-lime-500">
                  Manage Assignments
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-lime-500">
                  Analytics Dashboard
                </TabsTrigger>
                <TabsTrigger value="student-view" className="data-[state=active]:bg-lime-500">
                  Student View (Demo)
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="assignments" className="data-[state=active]:bg-lime-500">
                  My Game Assignments
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="assignments">
            {isTeacher ? (
              <TeacherGameAssignments />
            ) : (
              <StudentGameAssignments onGameSelect={handleGameSelect} />
            )}
          </TabsContent>

          {isTeacher && (
            <>
              <TabsContent value="analytics">
                <GameAnalyticsDashboard />
              </TabsContent>

              <TabsContent value="student-view">
                <div className="space-y-4">
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                    <h3 className="text-yellow-400 font-semibold mb-2">Demo Mode</h3>
                    <p className="text-yellow-200 text-sm">
                      This shows how students would see their assigned games.
                    </p>
                  </div>
                  <StudentGameAssignments onGameSelect={handleGameSelect} />
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default GameAssignmentDemo;