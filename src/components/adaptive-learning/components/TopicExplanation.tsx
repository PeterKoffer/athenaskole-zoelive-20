
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';

interface TopicExplanationProps {
  subject: string;
  skillArea: string;
  gradeLevel?: number;
  standardInfo?: {
    code: string;
    title: string;
    description?: string;
  };
  onStartQuestions: () => void;
}

const TopicExplanation = ({
  subject,
  skillArea,
  gradeLevel = 6,
  standardInfo,
  onStartQuestions
}: TopicExplanationProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartQuestions();
    }, 500);
  };

  const learningSteps = [
    {
      icon: <Target className="w-5 h-5 text-green-400" />,
      text: "We'll start with fundamental concepts"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-green-400" />,
      text: "Practice with guided examples"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      text: "Apply your knowledge to solve problems"
    },
    {
      icon: <Award className="w-5 h-5 text-green-400" />,
      text: "Build confidence through step-by-step learning"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Learning Steps */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {learningSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {step.icon}
                <span className="text-white">{step.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Standard Info */}
      {standardInfo && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Curriculum Standard</span>
            </div>
            <p className="text-gray-300 mt-1">
              {standardInfo.title || `${skillArea} for Grade ${gradeLevel}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Start Learning Section */}
      <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-green-400 mb-2">
            Ready to Start Learning? 🚀
          </h3>
          <p className="text-green-300 mb-6">
            Your personalized questions are ready! Let's practice what we've discussed.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 text-lg min-w-[280px]"
            >
              {isStarting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Starting...</span>
                </div>
              ) : (
                <>Start Practice Questions →</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicExplanation;
