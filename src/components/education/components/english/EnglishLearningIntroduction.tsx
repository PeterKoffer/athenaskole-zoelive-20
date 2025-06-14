
import NelieIntroduction from '../NelieIntroduction';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';

interface EnglishLearningIntroductionProps {
  onIntroductionComplete: () => void;
}

const EnglishLearningIntroduction = ({ onIntroductionComplete }: EnglishLearningIntroductionProps) => {
  const classroomConfig = getClassroomConfig('english');

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject="english"
          skillArea="general_english"
          onIntroductionComplete={onIntroductionComplete}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default EnglishLearningIntroduction;
