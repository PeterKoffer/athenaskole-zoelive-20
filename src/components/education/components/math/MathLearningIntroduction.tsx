
import NelieIntroduction from '../NelieIntroduction';

interface MathLearningIntroductionProps {
  onIntroductionComplete: () => void;
}

const MathLearningIntroduction = ({ onIntroductionComplete }: MathLearningIntroductionProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject="mathematics"
          skillArea="general_math"
          onIntroductionComplete={onIntroductionComplete}
        />
      </div>
    </div>
  );
};

export default MathLearningIntroduction;
