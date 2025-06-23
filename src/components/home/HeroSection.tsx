
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NelieAvatarDisplay from "./NelieAvatarDisplay";
import TextWithSpeaker from '../education/components/shared/TextWithSpeaker';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('🚀 Hero: Get Started clicked');
    if (onGetStarted) {
      onGetStarted();
    } else {
      // Navigate directly to mathematics learning
      navigate("/learn/mathematics");
    }
  };

  const handleViewDailyProgram = () => {
    console.log('🚀 Hero: View Daily Program clicked');
    navigate("/daily-program");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 scale-150"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content with Speaker */}
          <TextWithSpeaker 
            text="Welcome to the Future of Learning. Meet Nelie, your AI-powered learning companion. Experience personalized education that adapts to your unique learning style, making every lesson engaging and effective." 
            context="hero-main-content"
            position="corner"
            className="text-left lg:text-left relative"
            showOnHover={false}
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to the Future of{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Learning
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Meet <strong className="text-blue-400">Nelie</strong>, your AI-powered learning companion. 
                Experience personalized education that adapts to your unique learning style, 
                making every lesson engaging and effective.
              </p>

              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Learning Now
                </Button>
                
                <Button
                  onClick={handleViewDailyProgram}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  View Daily Program
                </Button>
              </div>
            </div>
          </TextWithSpeaker>

          {/* Nelie Avatar */}
          <div className="flex justify-center lg:justify-end">
            <NelieAvatarDisplay isSpeaking={false} onStopSpeech={() => {}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
