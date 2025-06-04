
import { GraduationCap, Clock, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LessonHeaderProps {
  subject: string;
  skillArea: string;
  currentQuestion: number;
  totalQuestions: number;
  difficultyLevel: number;
  timeSpent: number;
  onBack: () => void;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
}

const LessonHeader = ({
  subject,
  skillArea,
  currentQuestion,
  totalQuestions,
  difficultyLevel,
  timeSpent,
  learningObjective
}: LessonHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-500';
    if (level <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-6 h-6 text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-white capitalize">
                Grade 6 - {subject}
              </h2>
              <p className="text-sm text-gray-400">
                Question {currentQuestion} of {totalQuestions} • {skillArea}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="outline" className="text-white border-gray-600 mb-2">
              Score: 5/5
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Target className="w-4 h-4" />
              <span>Level {difficultyLevel}</span>
            </div>
          </div>
          
          {learningObjective && (
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {learningObjective.title}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonHeader;
