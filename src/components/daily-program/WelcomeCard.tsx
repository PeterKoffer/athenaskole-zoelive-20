
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface WelcomeCardProps {
  firstName: string;
  todaysDate: string;
}

const WelcomeCard = ({ firstName, todaysDate }: WelcomeCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <div className="text-4xl">🎓</div>
          <div>
            <h1 className="text-2xl font-bold">Hi {firstName}! I'm Nelie</h1>
            <p className="text-purple-100">{todaysDate}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-lg mb-4">
            Welcome to your personal learning day! I have prepared an exciting program for you. 
            You can choose where you want to start, and I will guide you through each activity.
          </p>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-sm">You have 4 activities to choose from today!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
