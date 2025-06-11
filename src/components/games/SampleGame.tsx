
import { useState, useEffect } from 'react';
import GameEngine, { GameConfig } from './GameEngine';
import DragDropGame from './interactions/DragDropGame';
import NumberLineGame from './interactions/NumberLineGame';
import FractionPizzaGame from './interactions/FractionPizzaGame';
import { Card, CardContent } from '@/components/ui/card';
import { getMathematicsGames } from './data/MathematicsGames';
import { CurriculumGame } from './types/GameTypes';

interface SampleGameProps {
  gameId: string;
  onBack: () => void;
  onComplete: (finalScore: number, achievements: string[]) => void;
}

const SampleGame = ({ gameId, onBack, onComplete }: SampleGameProps) => {
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [gameData, setGameData] = useState<CurriculumGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameConfig = async () => {
      try {
        const games = await getMathematicsGames();
        const foundGame = games.find(game => game.id === gameId);
        
        if (foundGame) {
          setGameData(foundGame);
          
          const config: GameConfig = {
            id: foundGame.id,
            title: foundGame.title,
            subject: foundGame.subject,
            interactionType: foundGame.interactionType,
            difficulty: foundGame.gradeLevel[0] || 1,
            gradeLevel: foundGame.gradeLevel,
            objectives: foundGame.learningObjectives,
            maxScore: 1000,
            timeLimit: 1200, // 20 minutes
            adaptiveRules: {
              successThreshold: 0.8,
              failureThreshold: 0.4,
              difficultyIncrease: 1,
              difficultyDecrease: 1
            }
          };
          
          setGameConfig(config);
        }
      } catch (error) {
        console.error('Failed to load game config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGameConfig();
  }, [gameId]);

  const renderGameContent = (gameState: any, gameActions: any) => {
    if (!gameData) return null;

    // Render different game types based on game ID
    switch (gameId) {
      case 'math-addition-castle':
      case 'counting-kingdom':
        return (
          <DragDropGame
            gameState={gameState}
            gameActions={gameActions}
            items={[
              { id: 'num1', content: '5', type: 'draggable', correctTarget: 'sum1', value: 5 },
              { id: 'num2', content: '3', type: 'draggable', correctTarget: 'sum2', value: 3 },
              { id: 'num3', content: '7', type: 'draggable', correctTarget: 'sum3', value: 7 },
              { id: 'sum1', content: '2 + 3 = ?', type: 'dropzone', value: 5 },
              { id: 'sum2', content: '1 + 2 = ?', type: 'dropzone', value: 3 },
              { id: 'sum3', content: '4 + 3 = ?', type: 'dropzone', value: 7 }
            ]}
            instruction="Drag the correct answers to solve these addition problems!"
            onComplete={(success) => {
              if (success) {
                gameActions.addAchievement('Addition Master');
                gameActions.completeGame();
              }
            }}
          />
        );

      case 'geometry-shape-builder':
        return (
          <DragDropGame
            gameState={gameState}
            gameActions={gameActions}
            items={[
              { id: 'triangle', content: '△', type: 'draggable', category: 'triangle' },
              { id: 'square', content: '□', type: 'draggable', category: 'square' },
              { id: 'circle', content: '○', type: 'draggable', category: 'circle' },
              { id: 'zone1', content: '3 sides', type: 'dropzone', category: 'triangle' },
              { id: 'zone2', content: '4 equal sides', type: 'dropzone', category: 'square' },
              { id: 'zone3', content: 'Round shape', type: 'dropzone', category: 'circle' }
            ]}
            instruction="Match each shape to its correct description!"
            onComplete={(success) => {
              if (success) {
                gameActions.addAchievement('Geometry Expert');
                gameActions.completeGame();
              }
            }}
          />
        );

      case 'multiplication-mission':
        return (
          <NumberLineGame
            gameState={gameState}
            gameActions={gameActions}
            minValue={10}
            maxValue={50}
            targetValue={24}
            instruction="Find the result of 6 × 4 on the number line!"
            onComplete={(success) => {
              if (success) {
                gameActions.addAchievement('Multiplication Hero');
                gameActions.completeGame();
              }
            }}
          />
        );

      case 'fraction-pizza-party':
        return (
          <FractionPizzaGame
            gameState={gameState}
            gameActions={gameActions}
            targetFraction={{ numerator: 3, denominator: 8 }}
            instruction="Select exactly 3/8 of the pizza by clicking on the slices!"
            onComplete={(success) => {
              if (success) {
                gameActions.addAchievement('Fraction Master');
                gameActions.completeGame();
              }
            }}
          />
        );

      case 'decimal-treasure-hunt':
        return (
          <NumberLineGame
            gameState={gameState}
            gameActions={gameActions}
            minValue={0}
            maxValue={10}
            targetValue={7.5}
            instruction="Find the treasure at 7.5 on the number line!"
            onComplete={(success) => {
              if (success) {
                gameActions.addAchievement('Decimal Detective');
                gameActions.completeGame();
              }
            }}
          />
        );

      default:
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">{gameData.title}</h3>
              <p className="text-gray-300 mb-6">{gameData.description}</p>
              <div className="text-6xl mb-4">{gameData.emoji}</div>
              <p className="text-gray-400">
                This is a placeholder for the {gameData.interactionType} game type.
                <br />
                The game engine is ready - specific game mechanics will be implemented next!
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!gameConfig) {
    return (
      <Card className="bg-red-900 border-red-700 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Game Not Found</h3>
          <p className="text-red-300 mb-4">Could not load game configuration for: {gameId}</p>
          <button 
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Back to Games
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <GameEngine
      gameConfig={gameConfig}
      onComplete={onComplete}
      onBack={onBack}
    >
      {renderGameContent}
    </GameEngine>
  );
};

export default SampleGame;
