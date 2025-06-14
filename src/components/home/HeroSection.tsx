
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const handleGetStartedClick = () => {
    console.log("HeroSection Get Started button clicked");
    onGetStarted();
  };

  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
      <div className="space-y-3">
        <p className="text-purple-300 text-lg font-medium">{todaysDate}</p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xl px-12 py-6 h-16 font-semibold"
          onClick={handleGetStartedClick}
        >
          Your Program for Today
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
