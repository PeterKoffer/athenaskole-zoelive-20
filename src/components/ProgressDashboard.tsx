
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Target, Award, Brain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const weeklyData = [
    { day: "Monday", matematik: 45, dansk: 30, engelsk: 20 },
    { day: "Tuesday", matematik: 60, dansk: 40, engelsk: 35 },
    { day: "Wednesday", matematik: 30, dansk: 55, engelsk: 25 },
    { day: "Thursday", matematik: 75, dansk: 20, engelsk: 40 },
    { day: "Friday", matematik: 40, dansk: 35, engelsk: 30 },
    { day: "Saturday", matematik: 20, dansk: 15, engelsk: 45 },
    { day: "Sunday", matematik: 35, dansk: 25, engelsk: 20 }
  ];

  const achievements = [
    { name: "7 days in a row", description: "Used the app every day for a week", date: "2024-01-15", emoji: "🔥" },
    { name: "Math Master", description: "Reached 80% in mathematics", date: "2024-01-10", emoji: "🧮" },
    { name: "Spelling Champion", description: "Spelled 100 words correctly", date: "2024-01-08", emoji: "✏️" },
    { name: "Curious Learner", description: "Tried all subjects", date: "2024-01-05", emoji: "🎓" }
  ];

  const getPerformanceMessage = (score: number) => {
    if (score >= 80) return { message: "Fantastic! You're mastering this subject! 🌟", color: "text-green-400" };
    if (score >= 65) return { message: "Good work! You're on the right track! 👍", color: "text-blue-400" };
    if (score >= 50) return { message: "Keep up the good work! 💪", color: "text-yellow-400" };
    return { message: "You can do it! Keep going! 🚀", color: "text-orange-400" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* AI-Powered Adaptive Learning CTA */}
      <Card className="bg-gradient-to-r from-lime-900 via-lime-800 to-green-900 border-lime-400">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Brain className="w-12 h-12 text-lime-400" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Try Adaptive AI Learning!</h3>
                <p className="text-lime-200">
                  Nelie automatically adjusts difficulty based on your performance
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/adaptive-learning')}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
            >
              Start AI Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-6 h-6 text-lime-400" />
            <span>Your Learning Journey</span>
            <Badge variant="outline" className="bg-lime-400 text-black border-lime-400">
              Week 3, 2024
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(userProgress).map(([subject, score]) => {
              const performance = getPerformanceMessage(score);
              const subjectNames = {
                matematik: "Mathematics",
                dansk: "Danish",
                engelsk: "English", 
                naturteknik: "Science & Tech"
              };
              return (
                <Card key={subject} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold capitalize text-white">{subjectNames[subject] || subject}</h3>
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
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-white">
                    <span>{day.day}</span>
                    <span>{day.matematik + day.dansk + day.engelsk} minutes</span>
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
                  <span>Mathematics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Danish</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>English</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-lime-400" />
              <span>Recent Achievements</span>
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
                      Achieved {new Date(achievement.date).toLocaleDateString('en-US')}
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
            <span>Weekly Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Learning (180 min/week)</span>
                <span>145/180 min</span>
              </div>
              <Progress value={80} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">35 minutes remaining</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Games completed (5/week)</span>
                <span>3/5 games</span>
              </div>
              <Progress value={60} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">2 games remaining</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Perfect scores (3/week)</span>
                <span>1/3 scores</span>
              </div>
              <Progress value={33} className="h-2 bg-gray-700" />
              <p className="text-xs text-gray-400">2 perfect scores remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-lime-400">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Parent email next week 📧</h3>
          <p className="text-gray-300 mb-4">
            Your parents will receive a report about your progress:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-green-400">Improvement</div>
              <div className="text-white">Mathematics: +15%</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-blue-400">Most Active</div>
              <div className="text-white">Tuesday: 2 hours</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="font-semibold text-purple-400">New Badges</div>
              <div className="text-white">2 this week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
