import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LearningModeDropdown from "@/components/adaptive-learning/LearningModeDropdown";
import { useState } from "react";
interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}
interface LearningHeaderProps {
  title?: string;
  backTo?: string;
  backLabel?: string;
  onModeChange?: (mode: LearningMode) => void;
  currentMode?: string;
}
const LearningHeader = ({
  title = "Læring med Nelie",
  backTo = "/daily-program",
  backLabel = "Tilbage til Program",
  onModeChange,
  currentMode = "adaptive"
}: LearningHeaderProps) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(backTo);
  };
  const handleModeChange = (mode: LearningMode) => {
    if (onModeChange) {
      onModeChange(mode);
    }
  };
  return <div className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack} className="border-gray-600 text-slate-950 bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
          
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">AI-drevet tilpasset læring</p>
          </div>
        </div>

        {onModeChange && <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">Læringsstil:</span>
            <LearningModeDropdown selectedMode={currentMode} onModeChange={handleModeChange} />
          </div>}
      </div>
    </div>;
};
export default LearningHeader;