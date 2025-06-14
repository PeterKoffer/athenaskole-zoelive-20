
import { Button } from "@/components/ui/button";
import DateWidget from "./DateWidget";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const handleGetStartedClick = () => {
    console.log("HeroSection Get Started button clicked");
    onGetStarted();
  };

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-white mb-4">
        Welcome to NELIE
      </h1>
      <p className="text-xl text-gray-300 mb-4">
        Your personal platform for learning and growth.
      </p>
      <p className="text-lg text-gray-400 mb-8">
        Meet Nelie - your AI tutor who guides you through your daily learning program
      </p>
      <div className="flex flex-col items-center space-y-6">
        <DateWidget className="max-w-xs" />
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl px-12 py-6 h-16 font-semibold"
          onClick={handleGetStartedClick}
        >
          Click here to go to today's lessons
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
