
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface EnableNelieButtonProps {
  showEnableButton: boolean;
  hasUserInteracted: boolean;
  isOnHomepage: boolean;
  onEnableNelie: () => void;
}

const EnableNelieButton = ({ 
  showEnableButton, 
  hasUserInteracted, 
  isOnHomepage, 
  onEnableNelie 
}: EnableNelieButtonProps) => {
  if (!showEnableButton || hasUserInteracted || !isOnHomepage) {
    return null;
  }

  return (
    <Button
      onClick={onEnableNelie}
      className="bg-white hover:bg-gray-100 text-purple-600 font-bold px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-bounce"
    >
      <Volume2 className="w-5 h-5 mr-2" />
      Enable Nelie
    </Button>
  );
};

export default EnableNelieButton;
