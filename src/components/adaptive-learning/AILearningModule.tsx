import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, LogIn } from 'lucide-react';
import ImprovedLearningSession from './components/ImprovedLearningSession';
interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}
const AILearningModule = ({
  subject,
  skillArea,
  difficultyLevel,
  onBack
}: AILearningModuleProps) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  console.log('🎯 AILearningModule rendering with improved session:', {
    subject,
    skillArea,
    difficultyLevel,
    hasUser: !!user
  });
  if (!user) {
    return <Card className="bg-red-900 border-red-700">
        <CardContent className="p-8 text-center text-white">
          <Brain className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4">Login Required</h3>
          <p className="text-red-300 mb-8 text-lg">You need to be logged in to use AI learning.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <LogIn className="w-5 h-5 mr-2" />
              Login / Sign Up
            </Button>
            
            <Button onClick={onBack} variant="outline" className="border-gray-600 px-8 py-3 text-lg bg-slate-50 text-slate-950">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-6">
      <ImprovedLearningSession subject={subject} skillArea={skillArea} difficultyLevel={difficultyLevel} onBack={onBack} />
    </div>;
};
export default AILearningModule;