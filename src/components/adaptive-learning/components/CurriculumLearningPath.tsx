
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { learningPathService, LearningPathway, LearningPathStep } from '@/services/learningPathService';
import { Play, CheckCircle, Clock, Target } from 'lucide-react';

interface CurriculumLearningPathProps {
  subject: string;
  onStartObjective: (objective: { id: string; title: string; description: string; difficulty_level: number }) => void;
}

const CurriculumLearningPath = ({ subject, onStartObjective }: CurriculumLearningPathProps) => {
  const { user } = useAuth();
  const [pathways, setPathways] = useState<LearningPathway[]>([]);
  const [pathSteps, setPathSteps] = useState<Record<string, LearningPathStep[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLearningPaths();
    }
  }, [user, subject]);

  const loadLearningPaths = async () => {
    if (!user) return;

    try {
      const userPaths = await learningPathService.getUserLearningPaths(user.id);
      const subjectPaths = userPaths.filter(path => path.subject === subject);
      
      setPathways(subjectPaths);

      // Load steps for each pathway
      const stepsData: Record<string, LearningPathStep[]> = {};
      for (const pathway of subjectPaths) {
        const steps = await learningPathService.getLearningPathSteps(pathway.id);
        stepsData[pathway.id] = steps;
      }
      setPathSteps(stepsData);
    } catch (error) {
      console.error('Error loading learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPath = async () => {
    if (!user) return;

    try {
      const pathId = await learningPathService.generateLearningPath(user.id, subject);
      if (pathId) {
        loadLearningPaths(); // Reload paths
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
    }
  };

  const getNextStep = (pathway: LearningPathway): LearningPathStep | null => {
    const steps = pathSteps[pathway.id] || [];
    return steps.find(step => !step.isCompleted) || null;
  };

  const getCompletionPercentage = (pathway: LearningPathway): number => {
    const steps = pathSteps[pathway.id] || [];
    if (steps.length === 0) return 0;
    const completed = steps.filter(step => step.isCompleted).length;
    return Math.round((completed / steps.length) * 100);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Target className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Loading learning paths...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5 text-lime-400" />
              <span>Personalized Learning Paths</span>
            </CardTitle>
            <Button onClick={generateNewPath} className="bg-lime-500 hover:bg-lime-600">
              Generate New Path
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pathways.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No learning paths found for {subject}</p>
              <Button onClick={generateNewPath} className="bg-lime-500 hover:bg-lime-600">
                Create Your First Learning Path
              </Button>
            </div>
          ) : (
            pathways.map((pathway) => {
              const nextStep = getNextStep(pathway);
              const completion = getCompletionPercentage(pathway);
              
              return (
                <Card key={pathway.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{pathway.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{pathway.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {pathway.currentStep} / {pathway.totalSteps} steps
                            </Badge>
                            <div className="flex items-center text-gray-400 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {pathway.estimatedCompletionTime}min estimated
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold text-lg">{completion}%</div>
                          <div className="text-gray-400 text-xs">Complete</div>
                        </div>
                      </div>
                      
                      <Progress value={completion} className="h-2" />
                      
                      {nextStep && (
                        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium">Next Step</div>
                            <div className="text-gray-300 text-sm">Step {nextStep.stepNumber}</div>
                          </div>
                          <Button
                            onClick={() => onStartObjective({
                              id: nextStep.learningObjectiveId,
                              title: `Step ${nextStep.stepNumber}`,
                              description: 'Continue your learning path',
                              difficulty_level: 1
                            })}
                            className="bg-lime-500 hover:bg-lime-600"
                            size="sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      )}
                      
                      {completion === 100 && (
                        <div className="flex items-center justify-center bg-green-900/30 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-green-400 font-medium">Path Completed!</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumLearningPath;
