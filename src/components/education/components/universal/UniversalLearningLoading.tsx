
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';

interface UniversalLearningLoadingProps {
  subject: string;
  studentName: string;
}

const UniversalLearningLoading = ({ subject, studentName }: UniversalLearningLoadingProps) => {
  const classroomConfig = getClassroomConfig(subject);

  const getSubjectEmoji = (subject: string): string => {
    const emojiMap: Record<string, string> = {
      'mathematics': '🧮',
      'science': '🔬',
      'english': '📚',
      'computer-science': '💻',
      'history-religion': '🏛️',
      'world-history-religions': '🕌',
      'geography': '🌎',
      'global-geography': '🗺️',
      'creative-arts': '🎨',
      'music': '🎵',
      'body-lab': '🫀',
      'mental-wellness': '🧠',
      'life-essentials': '🏠',
      'language-lab': '🌍'
    };
    return emojiMap[subject] || '📖';
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-6 animate-bounce">
            {getSubjectEmoji(subject)}
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Welcome {studentName}!
          </h2>
          <p className="text-lg mb-2">
            Preparing your {classroomConfig.subjectName} lesson...
          </p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearningLoading;
