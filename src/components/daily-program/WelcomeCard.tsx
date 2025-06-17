
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface WelcomeCardProps {
  firstName: string;
  todaysDate: string;
  activityCount?: number;
}

const WelcomeCard = ({ firstName, todaysDate, activityCount = 6 }: WelcomeCardProps) => {
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleSpeakWelcome = async () => {
    if (isSpeaking) {
      stop();
    } else {
      const welcomeText = `Welcome to your personal learning day! I have prepared an exciting program for you. You can choose where you want to start, and I will guide you through each activity. Today is ${todaysDate}. You have ${activityCount} activities to choose from today!`;
      await speakAsNelie(welcomeText, true, 'daily-welcome-card');
    }
  };

  return (
    <Card className="relative bg-gradient-to-r from-purple-600 to-blue-600 border-none mb-8">
      <button
        onClick={handleSpeakWelcome}
        className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
        title="Ask Nelie to read this"
      >
        <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
      </button>
      
      <CardContent className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 pr-12">
          Welcome to your personal learning day! I have prepared an exciting program for you. You can choose where you want to start, and I will guide you through each activity.
        </h1>
        <p className="text-lg opacity-90 mb-4">{todaysDate}</p>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-lg">You have {activityCount} activities to choose from today!</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
