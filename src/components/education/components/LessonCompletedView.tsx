
import { CheckCircle, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonCompletedViewProps {
  onBackToProgram: () => void;
  subject?: string;
  score?: number;
  timeSpent?: number;
  achievements?: string[];
}

const LessonCompletedView = ({ 
  onBackToProgram, 
  subject = 'mathematics',
  score = 0,
  timeSpent = 0,
  achievements = []
}: LessonCompletedViewProps) => {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-800/80 border-gray-700 rounded-lg p-8 text-center backdrop-blur-sm">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Lesson Complete!</h2>
            <p className="text-gray-300 text-lg">
              Congratulations on completing your {subject} lesson!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-900/50 rounded-lg p-4 backdrop-blur-sm">
              <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">Score</h3>
              <p className="text-2xl text-blue-400 font-bold">{score}</p>
            </div>

            <div className="bg-green-900/50 rounded-lg p-4 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">Time Spent</h3>
              <p className="text-2xl text-green-400 font-bold">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </p>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-4 backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">Achievements</h3>
              <p className="text-2xl text-purple-400 font-bold">{achievements.length}</p>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">🎉 New Achievements</h3>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-yellow-300">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-400">
              Great job! Nelie is proud of your progress. Keep up the excellent work!
            </p>
            
            <Button
              onClick={onBackToProgram}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Back to Daily Program
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCompletedView;
