
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import LearningModeSelector from "@/components/adaptive-learning/LearningModeSelector";
import SubjectSelector from "@/components/ai-tutor/SubjectSelector";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

const AdaptiveLearning = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<LearningMode | null>({
    id: 'adaptive',
    name: 'Adaptiv Læring',
    description: 'AI tilpasser sværhedsgraden baseret på din præstation',
    icon: null,
    difficulty: 'Tilpasset',
    estimatedTime: '10-15 min',
    benefits: ['Personlig tilpasning', 'Optimal udfordring', 'Hurtigere fremgang']
  }); // Default to adaptive mode
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSkillArea, setSelectedSkillArea] = useState<string>("");
  const [difficultyLevel, setDifficultyLevel] = useState<number>(2); // Default adaptive difficulty

  const handleBack = () => {
    if (selectedSubject && selectedSkillArea) {
      // Reset to subject selection
      setSelectedSubject("");
      setSelectedSkillArea("");
    } else if (selectedMode) {
      // Reset to mode selection
      setSelectedMode(null);
    } else {
      // Go back to main app
      navigate('/');
    }
  };

  const handleModeSelect = (mode: LearningMode) => {
    setSelectedMode(mode);
    
    // Set difficulty based on mode
    switch (mode.id) {
      case 'adaptive':
        setDifficultyLevel(2);
        break;
      case 'focused':
        setDifficultyLevel(1);
        break;
      case 'challenge':
        setDifficultyLevel(4);
        break;
      case 'mastery':
        setDifficultyLevel(1);
        break;
      default:
        setDifficultyLevel(2);
    }
  };

  const handleSubjectSelect = (subject: string, skillArea: string) => {
    setSelectedSubject(subject);
    setSelectedSkillArea(skillArea);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="text-white border-gray-600 hover:bg-gray-700 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tilbage</span>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">AI Adaptiv Læring</h1>
            <p className="text-gray-400">
              {selectedMode ? `${selectedMode.name} Mode` : 'Vælg din læringsstrategi'}
            </p>
          </div>
        </div>

        {/* Show AI Learning Module if subject and skill area are selected */}
        {selectedSubject && selectedSkillArea ? (
          <AILearningModule
            subject={selectedSubject}
            skillArea={selectedSkillArea}
            difficultyLevel={difficultyLevel}
            onBack={handleBack}
          />
        ) : selectedMode ? (
          /* Show Subject Selector if mode is selected */
          <SubjectSelector 
            onSubjectSelect={handleSubjectSelect}
            selectedMode={selectedMode}
          />
        ) : (
          /* Show Learning Mode Selector */
          <LearningModeSelector onModeSelect={handleModeSelect} />
        )}
      </div>
    </div>
  );
};

export default AdaptiveLearning;
