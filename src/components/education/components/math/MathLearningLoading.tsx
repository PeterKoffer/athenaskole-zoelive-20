
import { Brain } from 'lucide-react';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';

interface MathLearningLoadingProps {
  studentName: string;
}

const MathLearningLoading = ({ studentName }: MathLearningLoadingProps) => {
  const classroomConfig = getClassroomConfig('mathematics');

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-800/80 border-gray-700 rounded-lg p-8 text-center backdrop-blur-sm">
          <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Preparing Your Math Lesson</h3>
          <p className="text-gray-400">Setting up your personalized learning experience, {studentName}...</p>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default MathLearningLoading;
