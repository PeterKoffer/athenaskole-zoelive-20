
import NelieIntroduction from '../NelieIntroduction';

interface EnglishLearningIntroductionProps {
  onIntroductionComplete: () => void;
}

const EnglishLearningIntroduction = ({ onIntroductionComplete }: EnglishLearningIntroductionProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject="english"
          skillArea="creative_writing"
          onIntroductionComplete={onIntroductionComplete}
        />
      </div>
    </div>
  );
};

export default EnglishLearningIntroduction;
