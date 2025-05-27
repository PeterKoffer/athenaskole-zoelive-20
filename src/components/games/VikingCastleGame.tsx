
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sword, Shield, Hammer, Calculator } from "lucide-react";

const VikingCastleGame = ({ onBack }) => {
  const [gameStage, setGameStage] = useState("planning"); // planning, building, defending, completed
  const [resources, setResources] = useState({
    wood: 100,
    stone: 50,
    gold: 25
  });
  const [castleHealth, setCastleHealth] = useState(100);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [playerAnswer, setPlayerAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const mathProblems = [
    {
      question: "Hvor mange træstykker skal du bruge til at bygge en væg der er 8 meter lang, hvis hvert træstykke er 2 meter?",
      answer: 4,
      hint: "Del 8 med 2",
      type: "division"
    },
    {
      question: "Hvis hver sten vejer 5 kg, og du har 12 sten, hvor meget vejer alle stenene tilsammen?",
      answer: 60,
      hint: "Gang 5 med 12",
      type: "multiplication"
    },
    {
      question: "Du har 45° vinkel på dit tårn. Hvor stor er den anden vinkel hvis trekanten skal have 90° i toppen?",
      answer: 45,
      hint: "90° - 45° = ?",
      type: "subtraction"
    },
    {
      question: "Hvis din vikingborg har 6 sider og hver side koster 15 guld, hvor meget koster det i alt?",
      answer: 90,
      hint: "Gang 6 med 15",
      type: "multiplication"
    }
  ];

  useEffect(() => {
    if (gameStage === "building" && !currentProblem) {
      generateNewProblem();
    }
  }, [gameStage]);

  const generateNewProblem = () => {
    const problem = mathProblems[Math.floor(Math.random() * mathProblems.length)];
    setCurrentProblem(problem);
    setPlayerAnswer("");
  };

  const checkAnswer = () => {
    if (parseInt(playerAnswer) === currentProblem.answer) {
      setScore(score + 25);
      setProblemsCompleted(problemsCompleted + 1);
      setResources(prev => ({
        wood: prev.wood + 10,
        stone: prev.stone + 5,
        gold: prev.gold + 3
      }));
      
      if (problemsCompleted + 1 >= 3) {
        setGameStage("defending");
      } else {
        generateNewProblem();
      }
    } else {
      alert(`Ikke helt rigtigt! Prøv igen. Hint: ${currentProblem.hint}`);
    }
  };

  const defendCastle = () => {
    const damage = Math.floor(Math.random() * 20) + 10;
    setCastleHealth(prev => Math.max(0, prev - damage));
    
    if (castleHealth - damage <= 0) {
      setGameStage("completed");
    } else {
      setTimeout(() => {
        setCastleHealth(prev => Math.min(100, prev + 15));
      }, 1000);
    }
  };

  const getStageEmoji = (stage) => {
    switch (stage) {
      case "planning": return "📐";
      case "building": return "🔨";
      case "defending": return "⚔️";
      case "completed": return "🏆";
      default: return "🏰";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbage til spil
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStageEmoji(gameStage)}</span>
              <CardTitle>Byg En Vikingborg</CardTitle>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Score: {score}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="border-2 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🪵</div>
                <div className="font-bold text-orange-700">{resources.wood}</div>
                <div className="text-sm text-gray-600">Træ</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-gray-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🪨</div>
                <div className="font-bold text-gray-700">{resources.stone}</div>
                <div className="text-sm text-gray-600">Sten</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-300">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🪙</div>
                <div className="font-bold text-yellow-700">{resources.gold}</div>
                <div className="text-sm text-gray-600">Guld</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {gameStage === "planning" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📐</span>
              <span>Planlæg din vikingborg</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Velkommen, unge vikingebygger! Du skal bygge en stærk borg for at beskytte dit folk. 
              Først skal vi planlægge hvor stor og stærk borgen skal være.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Hvad skal vi bygge?</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Høje mure til forsvar</li>
                <li>• Et stærkt tårn til udkig</li>
                <li>• En stor port til at komme ind og ud</li>
                <li>• Magasiner til at opbevare mad og våben</li>
              </ul>
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => setGameStage("building")}
            >
              Start byggeri! 🔨
            </Button>
          </CardContent>
        </Card>
      )}

      {gameStage === "building" && currentProblem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hammer className="w-5 h-5" />
              <span>Byg din borg - Løs matematikopgaver</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">Bygge-udfordring #{problemsCompleted + 1}</h4>
              <p className="text-yellow-700">{currentProblem.question}</p>
            </div>

            <div className="flex space-x-2">
              <input
                type="number"
                value={playerAnswer}
                onChange={(e) => setPlayerAnswer(e.target.value)}
                placeholder="Dit svar..."
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <Button onClick={checkAnswer} className="bg-green-600 hover:bg-green-700">
                <Calculator className="w-4 h-4 mr-2" />
                Tjek svar
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Byggeprogress</span>
                <span>{problemsCompleted}/3 opgaver løst</span>
              </div>
              <Progress value={(problemsCompleted / 3) * 100} className="h-2" />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Brug din lommeregner hvis du har brug for det! Det vigtige er at forstå hvordan du løser opgaven.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {gameStage === "defending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sword className="w-5 h-5" />
              <span>Forsvar din borg!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🏰</div>
              <p className="text-lg text-gray-700 mb-4">
                Din borg er færdig! Nu kommer fjenderne - forsvar din borg!
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Borgens styrke</span>
                </span>
                <span>{castleHealth}/100 HP</span>
              </div>
              <Progress value={castleHealth} className="h-3" />
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={defendCastle}
            >
              ⚔️ Angrib fjenderne!
            </Button>

            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-700">
                Klik på "Angrib fjenderne" for at forsvare din borg! Din matematik-færdigheder har gjort borgen stærk!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {gameStage === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-800">
              🏆 Tillykke! Du vandt! 🏆
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl mb-4">🎉</div>
            
            <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">Du har optjent:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold">50 Lære-Kroner</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span className="font-bold">Matematik Viking Badge</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">⭐</span>
                  <span className="font-bold">{score} Point</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700">
              Fantastisk arbejde! Du har lært om division, multiplikation og geometri mens du byggede din vikingborg. 
              Du er nu en ægte Matematik Viking! 🇩🇰
            </p>

            <div className="flex space-x-4 justify-center">
              <Button onClick={onBack} variant="outline">
                Spil andre spil
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Spil igen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VikingCastleGame;
