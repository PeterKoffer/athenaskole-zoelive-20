
import NelieIntroduction from '../NelieIntroduction';

interface MathLearningIntroductionProps {
  onIntroductionComplete: () => void;
  isAdvancing?: boolean;
}

const MathLearningIntroduction = ({
  onIntroductionComplete,
  isAdvancing,
}: MathLearningIntroductionProps) => {
  return (
    <NelieIntroduction
      subject="mathematics"
      skillArea="general_math"
      onIntroductionComplete={onIntroductionComplete}
      isAdvancing={isAdvancing}
    />
  );
};

export default MathLearningIntroduction;
