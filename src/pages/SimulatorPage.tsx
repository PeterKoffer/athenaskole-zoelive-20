
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Target } from 'lucide-react';
import AdaptiveLearningEngine from '@/components/adaptive-learning/AdaptiveLearningEngine';

const SimulatorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract learning objective data from navigation state
  const objective = location.state?.objective;
  const subject = location.state?.subject || 'Mathematics';
  const skillArea = location.state?.skillArea || 'Basic Skills';

  const handleBack = () => {
    navigate('/daily-universe');
  };

  if (!objective) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Universe
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Learning Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Learning Objective Selected</h3>
              <p className="text-muted-foreground mb-6">
                Please select a learning objective from the Daily Universe page to begin your adventure.
              </p>
              <Button onClick={handleBack}>
                Return to Daily Universe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Universe
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{objective.name}</h1>
            <p className="text-muted-foreground">{subject} • {skillArea}</p>
          </div>
        </div>

        <AdaptiveLearningEngine
          subject={subject}
          skillArea={skillArea}
          onComplete={(score) => {
            console.log('Learning session completed with score:', score);
            // Could show completion modal or navigate somewhere
          }}
        />
      </div>
    </div>
  );
};

export default SimulatorPage;
