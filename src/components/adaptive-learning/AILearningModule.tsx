
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Brain } from 'lucide-react';
import SimplifiedLearningSession from './components/SimplifiedLearningSession';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, difficultyLevel, onBack }: AILearningModuleProps) => {
  const { user } = useAuth();

  console.log('🎯 AILearningModule rendering with:', {
    subject,
    skillArea,
    difficultyLevel,
    hasUser: !!user
  });

  if (!user) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center text-white">
          <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-red-300">You need to be logged in to use AI learning.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SimplifiedLearningSession
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={difficultyLevel}
        onBack={onBack}
      />
    </div>
  );
};

export default AILearningModule;
