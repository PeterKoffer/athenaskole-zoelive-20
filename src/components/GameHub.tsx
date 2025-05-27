
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
      case "Let": return "bg-green-100 text-green-800";
      case "Mellem": return "bg-yellow-100 text-yellow-800";
      case "Svær": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Matematik": "bg-blue-100 text-blue-800",
      "Dansk": "bg-red-100 text-red-800",
      "Programmering": "bg-purple-100 text-purple-800",
      "Historie": "bg-orange-100 text-orange-800",
      "Natur & Teknik": "bg-green-100 text-green-800",
      "Musik": "bg-pink-100 text-pink-800"
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  if (selectedGame === "viking-castle") {
    return <VikingCastleGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Skjult Læring Spil</span>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Lær mens du leger!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {game.status === "coming-soon" && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600">
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
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{game.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{game.timeEstimate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-green-600">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-500" />
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
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                player.name.includes("Dig") ? "bg-red-50 border-2 border-red-200" : "bg-gray-50"
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{player.badge}</span>
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-600">{player.points}</span>
                  <span className="text-sm text-gray-500">point</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Godt gået!</strong> Du er #2 i klassen. Fortsæt med at spille for at komme på førstepladsen! 🇩🇰
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHub;
