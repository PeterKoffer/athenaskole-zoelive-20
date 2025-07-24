import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Star, Trophy } from 'lucide-react';

interface TrainingGroundActivityRendererProps {
  activity: {
    id: string;
    title: string;
    content: {
      trainingGroundData: {
        title: string;
        objective: string;
        explanation: string;
        activity: {
          type: string;
          instructions: string;
        };
        assessmentElement?: string;
        optionalExtension?: string;
        studentSkillTargeted?: string;
        learningStyleAdaptation?: string;
      };
    };
  };
  onComplete: (success: boolean, timeSpent: number) => void;
}

const TrainingGroundActivityRenderer = ({ activity, onComplete }: TrainingGroundActivityRendererProps) => {
  const [currentStep, setCurrentStep] = useState<'introduction' | 'activity' | 'assessment' | 'complete'>('introduction');
  const [startTime] = useState(Date.now());
  const [assessmentAnswer, setAssessmentAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);

  const trainingData = activity.content.trainingGroundData;

  const handleStartActivity = () => {
    setCurrentStep('activity');
  };

  const handleActivityComplete = () => {
    if (trainingData.assessmentElement) {
      setCurrentStep('assessment');
    } else {
      handleComplete(true);
    }
  };

  const handleAssessmentSubmit = () => {
    setShowResults(true);
    setTimeout(() => {
      handleComplete(true);
    }, 2000);
  };

  const handleComplete = (success: boolean) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete(success, timeSpent);
    }, 1500);
  };

  const getActivityTypeIcon = (type?: string) => {
    if (!type) return '🎯'; // Default icon if type is undefined
    
    const icons = {
      'CookingGame': '👨‍🍳',
      'ScienceExperiment': '🔬',
      'ArtChallenge': '🎨',
      'MusicComposer': '🎵',
      'StoryBuilder': '📖',
      'PuzzleSolver': '🧩'
    };
    return icons[type as keyof typeof icons] || '🎯';
  };

  if (currentStep === 'introduction') {
    return (
      <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-400 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <span className="text-4xl">{getActivityTypeIcon(trainingData.activity?.type)}</span>
            {trainingData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-cyan-200 mb-2">🎯 Learning Objective</h3>
            <p className="text-blue-100">{trainingData.objective}</p>
          </div>

          <div className="bg-blue-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-cyan-200 mb-2">📚 What You'll Learn</h3>
            <p className="text-blue-100">{trainingData.explanation}</p>
          </div>

          {trainingData.studentSkillTargeted && (
            <div className="bg-blue-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-cyan-200 mb-2">🎓 Skill Focus</h3>
              <p className="text-blue-100">{trainingData.studentSkillTargeted}</p>
            </div>
          )}

          <Button 
            onClick={handleStartActivity}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 text-lg"
          >
            Start Your Adventure! <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'activity') {
    return (
      <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-400 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{getActivityTypeIcon(trainingData.activity?.type)}</span>
            {trainingData.activity?.type?.replace(/([A-Z])/g, ' $1').trim() || 'Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-200 mb-3">🚀 Your Mission</h3>
            <div className="prose prose-invert prose-green max-w-none">
              <div className="whitespace-pre-wrap text-green-100">{trainingData.activity?.instructions || 'Complete the learning activity'}</div>
            </div>
          </div>

          {trainingData.learningStyleAdaptation && (
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-200 mb-2">💡 Learning Tip</h3>
              <p className="text-green-100">{trainingData.learningStyleAdaptation}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleActivityComplete}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
            >
              I've Completed This! <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {trainingData.optionalExtension && (
            <div className="bg-yellow-900/50 border border-yellow-600 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-200 mb-2">⭐ Bonus Challenge</h3>
              <p className="text-yellow-100">{trainingData.optionalExtension}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-400 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Trophy className="text-3xl text-yellow-400" />
            Quick Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-800/50 p-4 rounded-lg">
            <p className="text-purple-100 text-lg">{trainingData.assessmentElement}</p>
          </div>

          <textarea
            value={assessmentAnswer}
            onChange={(e) => setAssessmentAnswer(e.target.value)}
            placeholder="Share your thoughts, what you learned, or your answer here..."
            className="w-full p-4 rounded-lg bg-purple-800/50 border border-purple-600 text-white placeholder-purple-300"
            rows={4}
          />

          <Button 
            onClick={handleAssessmentSubmit}
            disabled={!assessmentAnswer.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 disabled:opacity-50"
          >
            Submit My Response <Star className="ml-2 h-5 w-5" />
          </Button>

          {showResults && (
            <div className="bg-green-800/50 border border-green-600 p-4 rounded-lg animate-in slide-in-from-bottom">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="font-semibold text-green-200">Excellent work! You've shown great understanding.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'complete') {
    return (
      <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 border-yellow-400 text-white">
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Adventure Complete!</h2>
          <p className="text-yellow-100">You've mastered this challenge. Moving to the next adventure...</p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TrainingGroundActivityRenderer;