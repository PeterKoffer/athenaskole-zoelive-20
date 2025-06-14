
import { Button } from "@/components/ui/button";
import LanguageLearning from "../LanguageLearning";
import { ArrowLeft } from "lucide-react";

interface TutorLanguageLearningViewProps {
  selectedLanguage: string;
  onBackToHome?: () => void;
  onBackToTutor: () => void;
}

const TutorLanguageLearningView = ({
  selectedLanguage,
  onBackToHome,
  onBackToTutor
}: TutorLanguageLearningViewProps) => (
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
    <LanguageLearning initialLanguage={selectedLanguage} />
  </div>
);

export default TutorLanguageLearningView;
