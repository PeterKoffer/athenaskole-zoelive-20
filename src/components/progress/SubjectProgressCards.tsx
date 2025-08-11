
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface UserProgress {
  matematik: number;
  dansk: number;
  engelsk: number;
  naturteknik: number;
}

interface SubjectProgressCardsProps {
  userProgress: UserProgress;
}

const SubjectProgressCards = ({ userProgress }: SubjectProgressCardsProps) => {
  const getPerformanceMessage = (score: number) => {
    if (score >= 80) return { message: "Fantastic! You're mastering this subject! 🌟", color: "text-green-400" };
    if (score >= 65) return { message: "Good work! You're on the right track! 👍", color: "text-blue-400" };
    if (score >= 50) return { message: "Keep up the good work! 💪", color: "text-yellow-400" };
    return { message: "You can do it! Keep going! 🚀", color: "text-orange-400" };
  };

  const subjectNames = {
    matematik: "Mathematics",
    dansk: "Danish",
    engelsk: "English", 
    naturteknik: "Science & Tech"
  };

  return (
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
            const subjectLabel = (subjectNames as Record<string, string>)[subject] ?? subject;
            return (
              <Card key={subject} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize text-white">{subjectLabel}</h3>
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
  );
};

export default SubjectProgressCards;
