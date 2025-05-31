
import { Button } from "@/components/ui/button";
import { LearningOption } from "./types";

interface LearningOptionsProps {
  onOptionSelect: (option: LearningOption) => void;
}

const LearningOptions = ({ onOptionSelect }: LearningOptionsProps) => {
  const learningOptions: LearningOption[] = [
    {
      id: "review",
      title: "Review",
      description: "Review what you learned yesterday",
      icon: "🔄"
    },
    {
      id: "new",
      title: "New Topic",
      description: "Learn something completely new",
      icon: "✨"
    },
    {
      id: "practice",
      title: "Practice",
      description: "Train your skills",
      icon: "💪"
    },
    {
      id: "test",
      title: "Test Yourself",
      description: "See how good you are",
      icon: "🎯"
    },
    {
      id: "pronunciation",
      title: "Pronunciation",
      description: "Practice your pronunciation with AI",
      icon: "🎤"
    },
    {
      id: "language",
      title: "Language Training",
      description: "Learn new languages interactively",
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
