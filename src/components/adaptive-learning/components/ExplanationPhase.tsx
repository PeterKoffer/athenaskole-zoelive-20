
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Target, Clock } from 'lucide-react';
import TextWithSpeaker from '@/components/education/components/shared/TextWithSpeaker';

interface ExplanationPhaseProps {
  subject: string;
  skillArea: string;
  gradeLevel?: number;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
  onBack: () => void;
  onStartQuestions: () => void;
}

const ExplanationPhase = ({
  subject,
  skillArea,
  gradeLevel,
  learningObjective,
  onBack,
  onStartQuestions
}: ExplanationPhaseProps) => {
  const getExplanation = () => {
    if (learningObjective) {
      return learningObjective.description;
    }
    
    return `Let's explore ${skillArea} in ${subject}. This adaptive learning session will help you understand key concepts through interactive practice.`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-400">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <span>Topic Introduction</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextWithSpeaker
            text={`Welcome to your ${subject} learning session focusing on ${skillArea}.`}
            context="explanation-welcome"
            position="corner"
            className="group"
          >
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-3">
                {learningObjective?.title || `${skillArea} - ${subject}`}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {getExplanation()}
              </p>
            </div>
          </TextWithSpeaker>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Learning Goal</span>
              </div>
              <p className="text-white text-sm">
                Master key concepts through adaptive practice and immediate feedback.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Session Info</span>
              </div>
              <p className="text-white text-sm">
                Interactive questions with explanations and progress tracking.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={onStartQuestions}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold"
            >
              Start Learning Session
            </Button>
            <p className="text-blue-200 text-sm mt-2">
              Questions will adapt to your learning pace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplanationPhase;
