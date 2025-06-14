
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
      className="w-16 h-16 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-gray-600 hover:border-gray-500 flex items-center justify-center p-0"
    >
      <div className="flex flex-col items-center justify-center">
        <Volume2 className="w-5 h-5 mb-1" />
        <span className="text-xs font-semibold leading-tight">START</span>
      </div>
    </Button>
  );
};

export default EnableNelieButton;
