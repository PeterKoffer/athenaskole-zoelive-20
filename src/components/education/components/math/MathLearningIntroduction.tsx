
import NelieIntroduction from '../NelieIntroduction';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';

interface MathLearningIntroductionProps {
  onIntroductionComplete: () => void;
  isAdvancing?: boolean;
}

const MathLearningIntroduction = ({ onIntroductionComplete, isAdvancing }: MathLearningIntroductionProps) => {
  const classroomConfig = getClassroomConfig('mathematics');

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject="mathematics"
          skillArea="general_math"
          onIntroductionComplete={onIntroductionComplete}
          isAdvancing={isAdvancing}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default MathLearningIntroduction;
