
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Clock, Users } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: "viking-castle",
      title: "Byg En Vikingborg",
      description: "Lær geometri og matematik ved at bygge en vikingborg og forsvare den mod angreb!",
      subject: "Matematik",
      difficulty: "Mellem",
      timeEstimate: "15-20 min",
      emoji: "🏰",
      rewards: "50 Lære-Kroner + Matematik Viking badge",
      status: "available"
    },
    {
      id: "word-hunt",
      title: "Ordjagt AR",
      description: "Brug din telefon til at finde genstande i den virkelige verden og stav dem korrekt!",
      subject: "Dansk",
      difficulty: "Let",
      timeEstimate: "10-15 min",
      emoji: "🔍",
      rewards: "30 Lære-Kroner + Ordjæger badge",
      status: "coming-soon"
    },
    {
      id: "sandwich-coding",
      title: "Kod en Smørrebrød",
      description: "Lær logik og algoritmer ved at stable ingredienser i den rigtige rækkefølge!",
      subject: "Programmering",
      difficulty: "Mellem",
      timeEstimate: "20-25 min",
      emoji: "🥪",
      rewards: "60 Lære-Kroner + Kode Mester badge",
      status: "coming-soon"
    },
    {
      id: "time-travel",
      title: "Vikingetids Eventyr",
      description: "Rejse tilbage til vikingetiden og hjælp Harald Blåtand med at løse problemer!",
      subject: "Historie",
      difficulty: "Let",
      timeEstimate: "25-30 min",
      emoji: "⚔️",
      rewards: "40 Lære-Kroner + Tidsrejsende badge",
      status: "coming-soon"
    },
    {
      id: "windmill-builder",
      title: "Byg Et Vindmølle",
      description: "Lær om vedvarende energi ved at designe og bygge din egen vindmølle!",
      subject: "Natur & Teknik",
      difficulty: "Svær",
      timeEstimate: "30-35 min",
      emoji: "🌪️",
      rewards: "80 Lære-Kroner + Grøn Ingeniør badge",
      status: "coming-soon"
    },
    {
      id: "music-composer",
      title: "Komponer med Carl Nielsen",
      description: "Skab smukke melodier sammen med den berømte danske komponist Carl Nielsen!",
      subject: "Musik",
      difficulty: "Mellem",
      timeEstimate: "20-25 min",
      emoji: "🎵",
      rewards: "50 Lære-Kroner + Komponist badge",
      status: "coming-soon"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Let": return "bg-green-900 text-green-400 border-green-400";
      case "Mellem": return "bg-yellow-900 text-yellow-400 border-yellow-400";
      case "Svær": return "bg-red-900 text-red-400 border-red-400";
      default: return "bg-gray-900 text-gray-400 border-gray-400";
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Matematik": "bg-blue-900 text-blue-400 border-blue-400",
      "Dansk": "bg-red-900 text-red-400 border-red-400",
      "Programmering": "bg-purple-900 text-purple-400 border-purple-400",
      "Historie": "bg-orange-900 text-orange-400 border-orange-400",
      "Natur & Teknik": "bg-green-900 text-green-400 border-green-400",
      "Musik": "bg-pink-900 text-pink-400 border-pink-400"
    };
    return colors[subject] || "bg-gray-900 text-gray-400 border-gray-400";
  };

  if (selectedGame === "viking-castle") {
    return <VikingCastleGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="w-6 h-6 text-lime-400" />
            <span>Skjult Læring Spil</span>
            <Badge variant="outline" className="bg-lime-400 text-gray-900 border-lime-400">
              Lær mens du leger!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="relative overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 hover:border-lime-400">
                {game.status === "coming-soon" && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                      Kommer snart
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{game.emoji}</span>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={getSubjectColor(game.subject)}>
                        {game.subject}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white">{game.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{game.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{game.timeEstimate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-lime-400">
                      <Star className="w-4 h-4" />
                      <span>{game.rewards}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={game.status === "available" ? "default" : "secondary"}
                    disabled={game.status === "coming-soon"}
                    onClick={() => game.status === "available" && setSelectedGame(game.id)}
                  >
                    {game.status === "available" ? "Spil Nu" : "Kommer Snart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Users className="w-6 h-6 text-lime-400" />
            <span>Klassens Rangliste</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Sofie M.", points: 2450, badge: "🏆" },
              { name: "Dig (Emil)", points: 2210, badge: "🥈" },
              { name: "Marcus L.", points: 2180, badge: "🥉" },
              { name: "Anna K.", points: 1950, badge: "⭐" },
              { name: "Tobias R.", points: 1820, badge: "⭐" }
            ].map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                player.name.includes("Dig") ? "bg-lime-900/20 border-lime-400" : "bg-gray-800 border-gray-700"
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{player.badge}</span>
                  <span className="font-medium text-white">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lime-400">{player.points}</span>
                  <span className="text-sm text-gray-400">point</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-800 border border-lime-400 rounded-lg">
            <p className="text-sm text-lime-400">
              <strong>Godt gået!</strong> <span className="text-gray-300">Du er #2 i klassen. Fortsæt med at spille for at komme på førstepladsen! 🇩🇰</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHub;
