
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NelieAvatarDisplay from "./NelieAvatarDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogIn, User } from "lucide-react";

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
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Welcome to the <br />
            Future of <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Learning</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-200 max-w-2xl mx-auto">
            Meet <span className="text-cyan-400 font-semibold">Nelie</span>, your AI-powered learning companion. Experience personalized education that adapts to your unique learning style, making every lesson engaging and effective.
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Learning Now
          </Button>
          
          <Button
            onClick={() => navigate('/daily-program')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            View Daily Program
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                More Options
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => navigate('/auth')}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
