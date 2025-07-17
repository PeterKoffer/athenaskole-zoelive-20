
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface ImprovedLearningSessionProps {
  subject: string;
  skillArea: string;
  onBack: () => void;
}

const ImprovedLearningSession = ({ subject, skillArea, onBack }: ImprovedLearningSessionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{subject}</h2>
          <p className="text-muted-foreground">{skillArea}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Improved Learning Session
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Learning session for {subject} - {skillArea} is being prepared...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedLearningSession;
