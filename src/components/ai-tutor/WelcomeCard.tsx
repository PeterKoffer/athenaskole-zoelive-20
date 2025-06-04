
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface WelcomeCardProps {
  userName: string;
}

const WelcomeCard = ({ userName }: WelcomeCardProps) => {
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-3 text-white">
          <div className="text-4xl">🎓</div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Hi {userName}! I'm Nelie</h1>
            <p className="text-purple-100 text-lg">{todaysDate}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <p className="text-xl mb-4 text-center leading-relaxed">
            Welcome to your personal AI tutor! I've prepared an exciting program for you today. 
            You can choose where to start, and I'll guide you through each activity.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-6 h-6 text-yellow-300" />
            <span className="text-lg">Let's learn something amazing together!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
