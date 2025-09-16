import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star, Zap, Trophy, Sparkles, Target } from 'lucide-react';

interface LessonActivity {
  type: 'multipleChoice' | 'creativeTask' | 'experiment' | 'puzzle' | 'matching';
  title: string;
  instructions: string;
  content?: {
    question: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    points?: number;
  };
}

interface LessonStage {
  id: string;
  title: string;
  description: string;
  duration: number;
  storyText?: string;
  activities: LessonActivity[];
  materials?: string[];
  assessmentCriteria?: string[];
}

interface GameElements {
  points: string;
  achievements: string[];
  progression: string;
}

interface AdventureLesson {
  title: string;
  subject: string;
  gradeLevel: number;
  scenario: string;
  learningObjectives: string[];
  stages: LessonStage[];
  bonusMissions?: Array<{
    title: string;
    description: string;
    type: string;
    instructions: string;
    duration: number;
  }>;
  estimatedTime: number;
  gameElements?: GameElements;
}

interface AdventureLessonPlayerProps {
  lessonData: AdventureLesson;
  onBack: () => void;
  onComplete: () => void;
}

export default function AdventureLessonPlayer({ lessonData, onBack, onComplete }: AdventureLessonPlayerProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = ((currentStage + 1) / lessonData.stages.length) * 100;
  const stage = lessonData.stages[currentStage];
  const activity = stage?.activities[0];

  const handleNextStage = () => {
    if (currentStage < lessonData.stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (activity?.content?.correctAnswer === answerIndex) {
      setScore(score + (activity.content.points || 10));
      setCompletedActivities(prev => new Set(prev).add(currentStage));
    }
  };

  const isCorrectAnswer = selectedAnswer === activity?.content?.correctAnswer;
  const hasAnswered = selectedAnswer !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-foreground overflow-auto">
      {/* Animated Header */}
      <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{lessonData.title}</h1>
              <p className="text-white/90 font-medium">{lessonData.subject} • Grade {lessonData.gradeLevel} • {lessonData.estimatedTime} min</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-100">{score} pts</span>
            </div>
            <Button onClick={onBack} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Adventures
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/90 font-medium">Adventure Progress</span>
              <span className="text-sm text-white/90 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/10" />
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white/90 border-purple-300/30 font-medium">
            Stage {currentStage + 1} of {lessonData.stages.length}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-8">
        <div className="grid gap-6">
          {/* Scenario (first stage only) */}
          {currentStage === 0 && lessonData.scenario && (
            <Card className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">🚀 Your Mission Begins!</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/95 text-lg leading-relaxed font-medium">{lessonData.scenario}</p>
                {lessonData.learningObjectives && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">🎯 Learning Objectives:</h3>
                    <ul className="list-disc list-inside space-y-1 text-white/90">
                      {lessonData.learningObjectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Story Section */}
          {stage?.storyText && (
            <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-cyan-300/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-white">{stage.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/95 text-lg leading-relaxed font-medium">{stage.storyText}</p>
              </CardContent>
            </Card>
          )}

          {/* Activity Section */}
          {activity && (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{currentStage + 1}</span>
                      </div>
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="text-white/80 font-medium">
                      {activity.instructions}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-blue-200" />
                    <span className="text-white/90 font-medium">{stage.duration} min</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Debug info - remove later */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-red-500/20 p-4 rounded text-white text-xs">
                    <p>Debug - Activity Type: {activity.type}</p>
                    <p>Debug - Has Content: {activity.content ? 'Yes' : 'No'}</p>
                    <p>Debug - Activity Keys: {Object.keys(activity).join(', ')}</p>
                  </div>
                )}
                
                {activity.type === 'multipleChoice' && activity.content && (
                  <>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-400/30">
                      <h3 className="font-semibold text-white mb-3 text-lg">{activity.content.question}</h3>
                    </div>
                    
                    <div className="grid gap-3">
                      {activity.content.options?.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={hasAnswered}
                          variant="outline"
                          className={`
                            h-auto p-4 text-left justify-start border-2 transition-all duration-300 transform hover:scale-105
                            ${hasAnswered 
                              ? index === activity.content?.correctAnswer
                                ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400 text-green-100 shadow-green-400/20 shadow-lg'
                                : selectedAnswer === index
                                  ? 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400 text-red-100 shadow-red-400/20 shadow-lg'
                                  : 'bg-gray-500/10 border-gray-600 text-gray-300'
                              : 'hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 border-white/30 text-white hover:border-purple-400'
                            }
                          `}
                        >
                          <span className="flex items-center gap-3 w-full">
                            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold bg-white/10">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {hasAnswered && index === activity.content?.correctAnswer && (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            )}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {showExplanation && activity.content.explanation && (
                      <div className={`
                        p-6 rounded-lg border-l-4 backdrop-blur-sm transition-all duration-500 animate-in slide-in-from-bottom
                        ${isCorrectAnswer 
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400' 
                          : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400'
                        }
                      `}>
                        <div className="flex items-start gap-3">
                          {isCorrectAnswer ? (
                            <Trophy className="w-6 h-6 text-yellow-400 mt-0.5 animate-bounce" />
                          ) : (
                            <Target className="w-6 h-6 text-blue-400 mt-0.5" />
                          )}
                          <div>
                            <p className="font-bold text-white mb-2 text-lg">
                              {isCorrectAnswer ? '🎉 Outstanding! You got it right!' : '💪 Great attempt! Keep learning!'}
                            </p>
                            <p className="text-white/95 mb-3 leading-relaxed">{activity.content.explanation}</p>
                            {isCorrectAnswer && activity.content.points && (
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-100 font-bold">+{activity.content.points} points earned!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activity.type === 'creativeTask' && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg text-center border border-purple-400/30">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-pink-400" />
                      {activity.title}
                    </h3>
                    <p className="text-white/90 mb-6 font-medium leading-relaxed">{activity.instructions}</p>
                    <div className="bg-white/10 p-6 rounded-lg border-2 border-dashed border-white/30 min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                        <p className="text-white font-semibold text-lg">🎨 Creative Workspace</p>
                        <p className="text-white/80 text-sm">Use your imagination and creativity!</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Fallback rendering for any unhandled activity types */}
                {!['multipleChoice', 'creativeTask'].includes(activity.type) && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-400/30">
                    <h3 className="font-semibold text-white mb-3 text-lg">Activity: {activity.title}</h3>
                    <p className="text-white/90 mb-4">{activity.instructions}</p>
                    
                    {/* Show any content if available */}
                    {activity.content && (
                      <div className="space-y-4">
                        {activity.content.question && (
                          <div className="bg-white/10 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-2">Question:</h4>
                            <p className="text-white/90">{activity.content.question}</p>
                          </div>
                        )}
                        
                        {activity.content.options && Array.isArray(activity.content.options) && (
                          <div className="space-y-2">
                            <h4 className="text-white font-medium">Options:</h4>
                            {activity.content.options.map((option: string, index: number) => (
                              <Button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={hasAnswered}
                                variant="outline"
                                className="w-full text-left justify-start border-white/30 text-white hover:bg-white/10"
                              >
                                {String.fromCharCode(65 + index)}. {option}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {showExplanation && activity.content.explanation && (
                          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-lg border border-green-400/30">
                            <p className="text-white/95">{activity.content.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Generic activity completion button */}
                    {!activity.content?.options && (
                      <Button 
                        onClick={() => setCompletedActivities(prev => new Set(prev).add(currentStage))}
                        className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              onClick={() => {
                setCurrentStage(Math.max(0, currentStage - 1));
                setSelectedAnswer(null);
                setShowExplanation(false);
              }}
              disabled={currentStage === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              ← Previous Stage
            </Button>
            <Button 
              onClick={handleNextStage}
              disabled={!hasAnswered && activity?.type === 'multipleChoice'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-transform"
            >
              {currentStage === lessonData.stages.length - 1 ? '🏆 Complete Adventure' : 'Next Stage →'}
            </Button>
          </div>
        </div>
      </div>

      {/* Adventure Overview */}
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-black/30 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Adventure Progress Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lessonData.stages.map((s, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105
                    ${index === currentStage 
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400 shadow-blue-400/20 shadow-lg' 
                      : completedActivities.has(index)
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400'
                        : 'bg-white/5 border-2 border-white/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-center mb-2">
                    {completedActivities.has(index) ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : index === currentStage ? (
                      <div className="w-6 h-6 bg-blue-400 rounded-full animate-pulse" />
                    ) : (
                      <div className="w-6 h-6 bg-white/20 rounded-full" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-white">{s.title}</div>
                  <div className="text-xs text-white/70 font-medium">{s.duration} min</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}