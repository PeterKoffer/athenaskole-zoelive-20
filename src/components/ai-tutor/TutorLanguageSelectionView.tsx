
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import { ArrowLeft } from "lucide-react";

interface TutorLanguageSelectionViewProps {
  onBackToHome?: () => void;
  onBackToTutor: () => void;
  onLanguageSelect: (languageCode: string) => void;
}

const TutorLanguageSelectionView = ({
  onBackToHome,
  onBackToTutor,
  onLanguageSelect
}: TutorLanguageSelectionViewProps) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      {onBackToHome && (
        <Button
          variant="outline"
          onClick={onBackToHome}
          className="text-white border-gray-600 hover:bg-gray-700 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onBackToTutor}
        className="text-white border-gray-600 hover:bg-gray-700"
      >
        ← Back to AI Tutor
      </Button>
    </div>
    <LanguageSelector
      onLanguageSelect={onLanguageSelect}
      onBack={onBackToTutor}
    />
  </div>
);

export default TutorLanguageSelectionView;
