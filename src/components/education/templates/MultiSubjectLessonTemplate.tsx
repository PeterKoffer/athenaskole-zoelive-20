
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Star, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface MultiSubjectActivity {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  difficulty: 1 | 2 | 3;
  points: number;
  type: 'exploration' | 'practice' | 'creative' | 'assessment';
  content: {
    instructions: string;
    task: string;
    successCriteria: string;
  };
}

interface MultiSubjectLessonTemplateProps {
  topic: string;
  gradeLevel: number;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const MultiSubjectLessonTemplate: React.FC<MultiSubjectLessonTemplateProps> = ({
  topic,
  gradeLevel,
  onComplete,
  onBack
}) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Generate multi-subject activities based on the topic and grade level
  const activities: MultiSubjectActivity[] = [
    // Mathematics Activity
    {
      id: 'math-exploration',
      title: `Mathematical Patterns in ${topic}`,
      subject: 'Mathematics',
      description: `Discover mathematical relationships and patterns within ${topic}`,
      duration: 15,
      difficulty: Math.min(Math.max(gradeLevel - 1, 1), 3) as 1 | 2 | 3,
      points: 25,
      type: 'exploration',
      content: {
        instructions: `Explore the mathematical aspects of ${topic}`,
        task: `Find and describe numerical patterns, measurements, or calculations related to ${topic}`,
        successCriteria: 'Identify at least 2 mathematical connections'
      }
    },
    // Science Activity
    {
      id: 'science-investigation',
      title: `Scientific Understanding of ${topic}`,
      subject: 'Science',
      description: `Investigate the scientific principles behind ${topic}`,
      duration: 20,
      difficulty: Math.min(Math.max(gradeLevel - 1, 1), 3) as 1 | 2 | 3,
      points: 30,
      type: 'exploration',
      content: {
        instructions: `Examine ${topic} from a scientific perspective`,
        task: `Observe, hypothesize, and explain the scientific concepts involved in ${topic}`,
        successCriteria: 'Complete observation and form a hypothesis'
      }
    },
    // English/Language Arts Activity
    {
      id: 'language-expression',
      title: `Expressing Ideas About ${topic}`,
      subject: 'English Language Arts',
      description: `Use language skills to communicate understanding of ${topic}`,
      duration: 18,
      difficulty: Math.min(Math.max(gradeLevel - 1, 1), 3) as 1 | 2 | 3,
      points: 25,
      type: 'creative',
      content: {
        instructions: `Write or speak about ${topic} using rich vocabulary`,
        task: `Create a story, poem, or explanation that incorporates ${topic}`,
        successCriteria: 'Use descriptive language and clear communication'
      }
    },
    // Social Studies Activity
    {
      id: 'social-connection',
      title: `${topic} in Our Community`,
      subject: 'Social Studies',
      description: `Connect ${topic} to community and social contexts`,
      duration: 16,
      difficulty: Math.min(Math.max(gradeLevel - 1, 1), 3) as 1 | 2 | 3,
      points: 20,
      type: 'exploration',
      content: {
        instructions: `Think about how ${topic} relates to people and communities`,
        task: `Discuss the role of ${topic} in society, history, or culture`,
        successCriteria: 'Make connections to community or historical context'
      }
    },
    // Art Activity
    {
      id: 'artistic-creation',
      title: `Creative Expression of ${topic}`,
      subject: 'Art',
      description: `Express understanding through artistic creation`,
      duration: 22,
      difficulty: Math.min(Math.max(gradeLevel - 1, 1), 3) as 1 | 2 | 3,
      points: 30,
      type: 'creative',
      content: {
        instructions: `Create an artistic representation of ${topic}`,
        task: `Draw, design, or craft something that represents your understanding of ${topic}`,
        successCriteria: 'Complete an original creative work'
      }
    },
    // Synthesis Activity
    {
      id: 'synthesis-assessment',
      title: `Bringing It All Together`,
      subject: 'Integrated Learning',
      description: `Combine insights from all subjects to demonstrate comprehensive understanding`,
      duration: 25,
      difficulty: Math.min(Math.max(gradeLevel, 1), 3) as 1 | 2 | 3,
      points: 40,
      type: 'assessment',
      content: {
        instructions: `Show how all subjects connect in understanding ${topic}`,
        task: `Create a presentation or project that demonstrates learning from multiple perspectives`,
        successCriteria: 'Integrate concepts from at least 3 different subjects'
      }
    }
  ];

  const currentActivity = activities[currentActivityIndex];
  const progress = (completedActivities.size / activities.length) * 100;
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);

  const handleActivityComplete = () => {
    if (!completedActivities.has(currentActivity.id)) {
      const newCompletedActivities = new Set(completedActivities);
      newCompletedActivities.add(currentActivity.id);
      setCompletedActivities(newCompletedActivities);
      
      const newScore = totalScore + currentActivity.points;
      setTotalScore(newScore);
      
      // Add achievement for completing activities from different subjects
      const subjectsCompleted = activities
        .filter(activity => newCompletedActivities.has(activity.id))
        .map(activity => activity.subject);
      
      const uniqueSubjects = [...new Set(subjectsCompleted)];
      const newAchievements = [...achievements];
      
      if (uniqueSubjects.length >= 3 && !achievements.includes('Interdisciplinary Explorer')) {
        newAchievements.push('Interdisciplinary Explorer');
      }
      
      if (uniqueSubjects.length >= 5 && !achievements.includes('Renaissance Learner')) {
        newAchievements.push('Renaissance Learner');
      }
      
      setAchievements(newAchievements);
      
      toast.success(`Completed: ${currentActivity.title}`, {
        description: `+${currentActivity.points} points earned!`
      });
      
      // Check if all activities are completed
      if (newCompletedActivities.size === activities.length) {
        setIsCompleted(true);
        if (newAchievements.length > achievements.length) {
          toast.success('Achievement Unlocked!', {
            description: newAchievements[newAchievements.length - 1]
          });
        }
      }
    }
  };

  const handleNext = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  const handleFinish = () => {
    onComplete(totalScore, achievements);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exploration': return '🔍';
      case 'practice': return '📝';
      case 'creative': return '🎨';
      case 'assessment': return '📊';
      default: return '📚';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Multi-Subject Learning: {topic}</h1>
          <p className="text-muted-foreground">Grade {gradeLevel} • {totalDuration} minutes</p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">{totalScore} points</span>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedActivities.size} of {activities.length} activities
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getTypeIcon(currentActivity.type)}</span>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentActivity.title}
                  {completedActivities.has(currentActivity.id) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{currentActivity.subject}</Badge>
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(currentActivity.difficulty)}`} />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentActivity.duration} min
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{currentActivity.points} pts</div>
              <div className="text-sm text-muted-foreground">
                Activity {currentActivityIndex + 1} of {activities.length}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{currentActivity.description}</p>
          
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
                Instructions
              </h4>
              <p>{currentActivity.content.instructions}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
                Your Task
              </h4>
              <p>{currentActivity.content.task}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-1">
                Success Criteria
              </h4>
              <p>{currentActivity.content.successCriteria}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentActivityIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {!completedActivities.has(currentActivity.id) && (
                <Button onClick={handleActivityComplete} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Complete Activity
                </Button>
              )}
              
              {completedActivities.has(currentActivity.id) && currentActivityIndex < activities.length - 1 && (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next Activity
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="default" className="bg-yellow-500/10 text-yellow-700">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subjects Covered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...new Set(activities.map(activity => activity.subject))].map((subject) => {
              const subjectActivities = activities.filter(activity => activity.subject === subject);
              const completedInSubject = subjectActivities.filter(activity => 
                completedActivities.has(activity.id)
              ).length;
              
              return (
                <div key={subject} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm">{subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {completedInSubject} of {subjectActivities.length} completed
                  </div>
                  <Progress 
                    value={(completedInSubject / subjectActivities.length) * 100} 
                    className="h-1 mt-1"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      {isCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-green-700 mb-4">
              You've successfully completed the multi-subject lesson on {topic}!
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{totalScore}</div>
                <div className="text-sm text-green-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{achievements.length}</div>
                <div className="text-sm text-green-600">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{activities.length}</div>
                <div className="text-sm text-green-600">Subjects Explored</div>
              </div>
            </div>
            <Button onClick={handleFinish} size="lg" className="bg-green-600 hover:bg-green-700">
              Finish Lesson
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiSubjectLessonTemplate;
