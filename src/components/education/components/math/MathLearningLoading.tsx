
import { Brain, Calculator } from 'lucide-react';
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="w-8 h-8 text-blue-400 animate-bounce" />
            <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Generating Fresh Math Questions</h3>
          <p className="text-gray-400 mb-4">Creating 8 unique math challenges for you, {studentName}...</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default MathLearningLoading;
