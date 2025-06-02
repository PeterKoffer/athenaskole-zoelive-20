
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Coins } from "lucide-react";

interface VikingCastleGameProps {
  onBack: () => void;
}

const VikingCastleGame = ({ onBack }: VikingCastleGameProps) => {
  const [gameState, setGameState] = useState<'planning' | 'building' | 'defending' | 'complete'>('planning');
  const [resources, setResources] = useState({
    wood: 100,
    stone: 50,
    gold: 25
  });
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      question: "What should we build first?",
      options: [
        "High walls for defense",
        "A strong tower for lookout", 
        "Storage for weapons",
        "Storehouses for food and weapons"
      ],
      correct: 0,
      explanation: "High walls are the first priority for defense in a Viking castle!"
    },
    {
      question: "How many wooden planks do we need for the main gate?",
      options: ["15 planks", "25 planks", "35 planks", "45 planks"],
      correct: 1,
      explanation: "25 wooden planks will create a strong and sturdy main gate."
    },
    {
      question: "What angle should the castle walls be for maximum strength?",
      options: ["45 degrees", "60 degrees", "90 degrees", "120 degrees"],
      correct: 2,
      explanation: "90-degree walls (vertical) provide the best structural strength for castle walls."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 100);
      setResources(prev => ({
        wood: prev.wood + 10,
        stone: prev.stone + 5,
        gold: prev.gold + 2
      }));
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameState('complete');
    }
  };

  const renderPlanning = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Plan Your Viking Castle</h2>
        <p className="text-gray-300 mb-6">
          Welcome, young Viking builder! You must build a strong castle to protect your people. 
          First, let's plan how big and strong the castle should be.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-orange-100 border-orange-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🪵</div>
            <div className="font-bold text-red-600">{resources.wood}</div>
            <div className="text-sm">Wood</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100 border-gray-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🪨</div>
            <div className="font-bold">{resources.stone}</div>
            <div className="text-sm">Stone</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 border-yellow-300">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🪙</div>
            <div className="font-bold text-orange-600">{resources.gold}</div>
            <div className="text-sm">Gold</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {questions[currentQuestion].question}
          </h3>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setGameState('building')}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
      >
        Start Building! ⚒️
      </Button>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🏰</div>
      <h2 className="text-3xl font-bold text-white">Castle Complete!</h2>
      <p className="text-gray-300 text-lg">
        Congratulations! You have successfully built a strong Viking castle!
      </p>
      
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-6 h-6" />
            <span className="font-bold text-lg">Final Score: {score} points</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>You earned 50 Learning Coins + Math Viking badge!</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => {
            setGameState('planning');
            setCurrentQuestion(0);
            setScore(0);
            setResources({ wood: 100, stone: 50, gold: 25 });
          }}
          variant="outline" 
          className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
        >
          Play Again
        </Button>
        <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 text-white">
          Back to Games
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-white border-gray-600 hover:bg-gray-700 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </Button>
        <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
          Score: {score}
        </Badge>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <span className="text-2xl">🏰</span>
            <span>Build A Viking Castle</span>
            <Badge variant="outline" className="bg-orange-600 text-white border-orange-600">
              Mathematics
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === 'planning' && renderPlanning()}
          {gameState === 'complete' && renderComplete()}
        </CardContent>
      </Card>
    </div>
  );
};

export default VikingCastleGame;
