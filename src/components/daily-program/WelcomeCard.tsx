
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface WelcomeCardProps {
  firstName: string;
  todaysDate: string;
}

const WelcomeCard = ({ firstName, todaysDate }: WelcomeCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none mb-8">
      <CardContent className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to your personal learning day! I have prepared an exciting program for you. You can choose where you want to start, and I will guide you through each activity.
        </h1>
        <p className="text-lg opacity-90 mb-4">{todaysDate}</p>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-lg">You have 5 activities to choose from today!</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
