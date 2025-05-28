
import { Button } from "@/components/ui/button";
import { LearningOption } from "./types";

interface LearningOptionsProps {
  onOptionSelect: (option: LearningOption) => void;
}

const LearningOptions = ({ onOptionSelect }: LearningOptionsProps) => {
  const learningOptions: LearningOption[] = [
    {
      id: "review",
      title: "Gennemgå",
      description: "Gentag hvad du lærte i går",
      icon: "🔄"
    },
    {
      id: "new",
      title: "Nyt emne",
      description: "Lær noget helt nyt",
      icon: "✨"
    },
    {
      id: "practice",
      title: "Øv dig",
      description: "Træn dine færdigheder",
      icon: "💪"
    },
    {
      id: "test",
      title: "Test dig selv",
      description: "Se hvor god du er",
      icon: "🎯"
    },
    {
      id: "pronunciation",
      title: "Udtale",
      description: "Træn din udtale med AI",
      icon: "🎤"
    },
    {
      id: "language",
      title: "Sprogtræning",
      description: "Lær nye sprog interaktivt",
      icon: "🌍"
    }
  ];

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {learningOptions.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          className="h-auto p-4 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-left"
          onClick={() => onOptionSelect(option)}
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{option.icon}</span>
            <div>
              <div className="font-medium text-white">{option.title}</div>
              <div className="text-sm text-gray-300">{option.description}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default LearningOptions;
