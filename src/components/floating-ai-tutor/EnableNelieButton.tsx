
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
      className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 text-sm"
    >
      <Volume2 className="w-4 h-4 mr-2" />
      Enable Nelie
    </Button>
  );
};

export default EnableNelieButton;
