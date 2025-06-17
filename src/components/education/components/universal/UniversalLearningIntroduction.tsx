
import NelieIntroduction from '../NelieIntroduction';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';

interface UniversalLearningIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const UniversalLearningIntroduction = ({ subject, skillArea, onIntroductionComplete }: UniversalLearningIntroductionProps) => {
  const classroomConfig = getClassroomConfig(subject);

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <NelieIntroduction
          subject={subject}
          skillArea={skillArea}
          onIntroductionComplete={onIntroductionComplete}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearningIntroduction;
