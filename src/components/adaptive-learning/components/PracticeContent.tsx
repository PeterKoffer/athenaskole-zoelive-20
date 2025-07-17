
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp } from 'lucide-react';

interface LearnerProfile {
  id: string;
  strengths: string[];
  weaknesses: string[];
  preferredDifficulty: number;
  kcMasteryMap?: Record<string, number>;
}

interface PracticeContentProps {
  subject: string;
  skillArea: string;
  learnerProfile: LearnerProfile;
  onComplete: (performance: any) => void;
}

const PracticeContent = ({ subject, skillArea, learnerProfile, onComplete }: PracticeContentProps) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setCurrentExercise(prev => prev + 1);
  };

  const handleComplete = () => {
    const performance = {
      score,
      timeSpent,
      totalExercises: 5,
      accuracy: (score / 5) * 100
    };
    onComplete(performance);
  };

  // Safe access to kcMasteryMap
  const masteryScore = learnerProfile.kcMasteryMap?.[skillArea] || 0;
  const recommendedLevel = learnerProfile.kcMasteryMap?.[skillArea] 
    ? Math.min(learnerProfile.kcMasteryMap[skillArea] * 10, 10) 
    : learnerProfile.preferredDifficulty;

  if (currentExercise >= 5) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Practice Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{score}/5</div>
              <div className="text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
              <div className="text-gray-400">Time Spent</div>
            </div>
          </div>
          <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Practice: {subject} - {skillArea}</span>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {currentExercise + 1}/5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Mastery: {Math.round(masteryScore * 100)}%
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Level: {Math.round(recommendedLevel)}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Exercise {currentExercise + 1}
          </h3>
          <p className="text-gray-300 mb-6">
            Sample practice question for {skillArea} would appear here.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => handleAnswerSubmit(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-left"
            >
              Correct Answer
            </Button>
            <Button 
              onClick={() => handleAnswerSubmit(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-left"
            >
              Incorrect Answer
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Badge className="bg-purple-600">
            Strengths: {learnerProfile.strengths.join(', ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeContent;
