
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Award } from "lucide-react";

interface UserProgress {
  matematik: number;
  dansk: number;
  engelsk: number;
  naturteknik: number;
}

interface ProgressDashboardProps {
  userProgress: UserProgress;
}

const ProgressDashboard = ({ userProgress }: ProgressDashboardProps) => {
  const weeklyData = [
    { day: "Mandag", matematik: 45, dansk: 30, engelsk: 20 },
    { day: "Tirsdag", matematik: 60, dansk: 40, engelsk: 35 },
    { day: "Onsdag", matematik: 30, dansk: 55, engelsk: 25 },
    { day: "Torsdag", matematik: 75, dansk: 20, engelsk: 40 },
    { day: "Fredag", matematik: 40, dansk: 35, engelsk: 30 },
    { day: "Lørdag", matematik: 20, dansk: 15, engelsk: 45 },
    { day: "Søndag", matematik: 35, dansk: 25, engelsk: 20 }
  ];

  const achievements = [
    { name: "7 dage i træk", description: "Brugt appen hver dag i en uge", date: "2024-01-15", emoji: "🔥" },
    { name: "Matematik Mester", description: "Nået 80% i matematik", date: "2024-01-10", emoji: "🧮" },
    { name: "Stavning Champion", description: "Stavet 100 ord korrekt", date: "2024-01-08", emoji: "✏️" },
    { name: "Nysgerrig Lærer", description: "Prøvet alle fag", date: "2024-01-05", emoji: "🎓" }
  ];

  const getPerformanceMessage = (score: number) => {
    if (score >= 80) return { message: "Fantastisk! Du mestrer dette fag! 🌟", color: "text-green-400" };
    if (score >= 65) return { message: "Godt arbejde! Du er på rette vej! 👍", color: "text-blue-400" };
    if (score >= 50) return { message: "Fortsæt det gode arbejde! 💪", color: "text-yellow-400" };
    return { message: "Du kan gøre det! Bliv ved! 🚀", color: "text-orange-400" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-6 h-6 text-lime-400" />
            <span>Din Læringsrejse</span>
            <Badge variant="outline" className="bg-lime-400 text-black border-lime-400">
              Uge 3, 2024
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(userProgress).map(([subject, score]) => {
              const performance = getPerformanceMessage(score);
              return (
                <Card key={subject} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold capitalize text-white">{subject}</h3>
                      <span className="text-2xl font-bold text-lime-400">{score}%</span>
                    </div>
                    <Progress value={score} className="h-3 mb-3 bg-gray-700" />
                    <p className={`text-sm ${performance.color}`}>
                      {performance.message}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Calendar className="w-5 h-5 text-lime-400" />
              <span>Ugentlig Aktivitet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-white">
                    <span>{day.day}</span>
                    <span>{day.matematik + day.dansk + day.engelsk} minutter</span>
                  </div>
                  <div className="flex space-x-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${(day.matematik / 120) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(day.dansk / 120) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(day.engelsk / 120) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Matematik</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Dansk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Engelsk</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-lime-400" />
              <span>Seneste Præstationer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">{achievement.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Opnået {new Date(achievement.date).toLocaleDateString('da-DK')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5 text-lime-400" />
            <span>Ugentlige Mål</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Læring (180 min/uge)</span>
                <span>145/180 min</span>
              </div>
              <Progress value={80} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">35 minutter tilbage</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Spil gennemført (5/uge)</span>
                <span>3/5 spil</span>
              </div>
              <Progress value={60} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">2 spil tilbage</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Perfekte scores (3/uge)</span>
                <span>1/3 scores</span>
              </div>
              <Progress value={33} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">2 perfekte scores tilbage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-lime-400">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Forældremail næste uge 📧</h3>
          <p className="text-gray-300 mb-4">
            Dine forældre vil modtage en rapport om dine fremskridt:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-green-400">Forbedring</div>
              <div className="text-white">Matematik: +15%</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-blue-400">Mest Aktiv</div>
              <div className="text-white">Tirsdag: 2 timer</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-purple-400">Nye Badges</div>
              <div className="text-white">2 denne uge</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
