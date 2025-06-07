
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityApplicationProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
}

const ActivityApplication = ({
  activity,
  timeRemaining,
  onContinue
}: ActivityApplicationProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-orange-900 text-orange-400 border-orange-400">
            <Target className="w-3 h-3 mr-1" />
            {activity.phaseDescription}
          </Badge>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(timeRemaining / 60)} min remaining</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {activity.title}
        </h2>

        <div className="bg-orange-800/20 border border-orange-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-300 mb-4">Real-World Scenario</h3>
          <p className="text-white text-lg leading-relaxed mb-6">
            {activity.content.scenario}
          </p>

          {activity.content.problemSteps && (
            <div className="space-y-4">
              {activity.content.problemSteps.map((step, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-orange-500 text-white mt-1">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{step.step}</p>
                      {step.hint && (
                        <div className="flex items-start space-x-2 text-yellow-300 text-sm">
                          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Hint: {step.hint}</span>
                        </div>
                      )}
                      {step.solution && (
                        <div className="mt-2 p-3 bg-green-800/30 border border-green-600 rounded">
                          <p className="text-green-300 text-sm">
                            <strong>Solution:</strong> {step.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next button to continue to next phase */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onContinue}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue to Next Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityApplication;
