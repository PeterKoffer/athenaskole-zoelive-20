
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLearningProfile } from '@/hooks/useLearningProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, Target } from 'lucide-react';

interface AdaptiveEducationSessionProps {
  subject: string;
  skillArea: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const AdaptiveEducationSession: React.FC<AdaptiveEducationSessionProps> = ({
  subject,
  skillArea,
  onComplete,
  onBack
}) => {
  const { user } = useAuth();
  const { profile, preferences, getRecommendedDifficulty, getPersonalizedSettings } = useLearningProfile();
  const [sessionProgress, setSessionProgress] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('assessment');

  useEffect(() => {
    if (user && profile) {
      console.log('🎓 Starting adaptive education session');
      initializeSession();
    }
  }, [user, profile]);

  const initializeSession = () => {
    const difficulty = getRecommendedDifficulty(subject, skillArea);
    const settings = getPersonalizedSettings(subject, skillArea);
    
    console.log('📊 Session initialized with:', { difficulty, settings });
    setSessionProgress(10);
  };

  const handleActivityComplete = () => {
    setSessionProgress(prev => Math.min(prev + 25, 100));
    
    if (sessionProgress >= 75) {
      console.log('✅ Session completed successfully');
      onComplete?.();
    }
  };

  if (!user || !profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Loading Your Learning Profile</h2>
          <p className="text-gray-600">Preparing personalized content...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Adaptive Learning: {subject} - {skillArea}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Session Progress</span>
              <span className="text-sm text-gray-600">{sessionProgress}%</span>
            </div>
            <Progress value={sessionProgress} className="w-full" />
          </div>
          {onBack && (
            <Button onClick={onBack} variant="outline" className="mt-4">
              ← Back
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Learning Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Learning Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Knowledge Level</h4>
              <p className="text-sm text-gray-600">{profile.knowledgeLevel}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Learning Style</h4>
              <p className="text-sm text-gray-600">{preferences?.learningStyle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Area */}
      <Card>
        <CardHeader>
          <CardTitle>Current Activity: {currentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-24 h-24 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">
              Adaptive Learning Experience
            </h3>
            <p className="text-gray-600 mb-6">
              This would contain the actual learning content and activities
              tailored to your profile and performance.
            </p>
            <Button onClick={handleActivityComplete} className="bg-blue-600 hover:bg-blue-700">
              Complete Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveEducationSession;
