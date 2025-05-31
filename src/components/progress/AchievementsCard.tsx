
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

const AchievementsCard = () => {
  const achievements = [
    { name: "7 days in a row", description: "Used the app every day for a week", date: "2024-01-15", emoji: "🔥" },
    { name: "Math Master", description: "Reached 80% in mathematics", date: "2024-01-10", emoji: "🧮" },
    { name: "Spelling Champion", description: "Spelled 100 words correctly", date: "2024-01-08", emoji: "✏️" },
    { name: "Curious Learner", description: "Tried all subjects", date: "2024-01-05", emoji: "🎓" }
  ];

  return (
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
  );
};

export default AchievementsCard;
