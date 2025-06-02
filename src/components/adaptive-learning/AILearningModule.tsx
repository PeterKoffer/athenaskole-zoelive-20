
import LearningSession from "./components/LearningSession";

export interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, difficultyLevel, onBack }: AILearningModuleProps) => {
  return (
    <LearningSession
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
    />
  );
};

export default AILearningModule;
