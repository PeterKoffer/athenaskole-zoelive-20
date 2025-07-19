
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NelieAvatarDisplay from "./NelieAvatarDisplay";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (user) {
      navigate('/daily-program');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Nelie Avatar Display */}
        <div className="mb-8">
          <NelieAvatarDisplay isSpeaking={false} onStopSpeech={() => {}} />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Hi! I'm Nelie, your AI learning companion
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto">
            Ready to explore the universe of knowledge together? Let's make learning an adventure!
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-8">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {user ? "Continue Learning" : "Get Started"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
