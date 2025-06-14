
import { Brain } from 'lucide-react';

interface MathLearningLoadingProps {
  studentName: string;
}

const MathLearningLoading = ({ studentName }: MathLearningLoadingProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-800 border-gray-700 rounded-lg p-8 text-center">
          <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Preparing Your Math Lesson</h3>
          <p className="text-gray-400">Setting up your personalized learning experience, {studentName}...</p>
        </div>
      </div>
    </div>
  );
};

export default MathLearningLoading;
