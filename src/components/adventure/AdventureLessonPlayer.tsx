import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen } from 'lucide-react';

interface AdventureLessonStage {
  id: string;
  title: string;
  description: string;
  duration: number;
  activities: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

interface AdventureLessonData {
  title: string;
  subject: string;
  description: string;
  stages: AdventureLessonStage[];
  estimatedTime: number;
  materials: string[];
  assessmentCriteria: string[];
}

interface AdventureLessonPlayerProps {
  lessonData: AdventureLessonData;
  onComplete: () => void;
  onBack: () => void;
}

const AdventureLessonPlayer: React.FC<AdventureLessonPlayerProps> = ({ 
  lessonData, 
  onComplete, 
  onBack 
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());

  const currentStage = lessonData.stages[currentStageIndex];
  const isLastStage = currentStageIndex === lessonData.stages.length - 1;
  const isFirstStage = currentStageIndex === 0;

  const handleNextStage = () => {
    // Mark current stage as completed
    setCompletedStages(prev => new Set([...prev, currentStageIndex]));
    
    if (isLastStage) {
      onComplete();
    } else {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handlePreviousStage = () => {
    if (!isFirstStage) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  const progressPercentage = ((currentStageIndex + 1) / lessonData.stages.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="text-white border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Adventure
          </Button>
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{lessonData.title}</h1>
            <p className="text-blue-200">{lessonData.subject}</p>
          </div>
          <div className="text-white text-right">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{lessonData.estimatedTime} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Stage Counter */}
        <div className="text-center text-white">
          <span className="text-lg">
            Stage {currentStageIndex + 1} of {lessonData.stages.length}
          </span>
        </div>

        {/* Current Stage Content */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {currentStage.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStage.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{currentStage.duration} minutes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stage Activities */}
            <div className="space-y-3">
              <h3 className="font-semibold">Activities:</h3>
              {currentStage.activities.map((activity, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 capitalize">
                    {activity.type.replace('_', ' ')}: {activity.title}
                  </h4>
                  <p className="text-sm text-blue-600 mt-1">{activity.description}</p>
                </div>
              ))}
            </div>

            {/* Materials (show on first stage) */}
            {currentStageIndex === 0 && lessonData.materials.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Materials Needed:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {lessonData.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assessment Criteria (show on last stage) */}
            {isLastStage && lessonData.assessmentCriteria.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Assessment Criteria:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {lessonData.assessmentCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousStage}
            disabled={isFirstStage}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Stage
          </Button>

          <Button
            onClick={handleNextStage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLastStage ? (
              <>
                Complete Adventure
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next Stage
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Stage Overview */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Adventure Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lessonData.stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    index === currentStageIndex
                      ? 'border-blue-500 bg-blue-50'
                      : completedStages.has(index)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {completedStages.has(index) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <h4 className="font-medium text-sm">{stage.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{stage.duration} min</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdventureLessonPlayer;