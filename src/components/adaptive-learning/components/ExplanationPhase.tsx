
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TopicExplanation from './TopicExplanation';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950 bg-slate-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
      
      <TopicExplanation
        subject={subject}
        skillArea={skillArea}
        gradeLevel={gradeLevel}
        standardInfo={learningObjective ? {
          code: learningObjective.id,
          title: learningObjective.title,
          description: learningObjective.description
        } : undefined}
        onStartQuestions={onStartQuestions}
      />
    </div>
  );
};

export default ExplanationPhase;
