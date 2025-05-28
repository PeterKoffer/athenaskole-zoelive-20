
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-white mb-4">
        Velkommen til Athena
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Din personlige platform for sprog og læring.
      </p>
      <Button
        size="lg"
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        onClick={onGetStarted}
      >
        Kom i gang
      </Button>
    </div>
  );
};

export default HeroSection;
