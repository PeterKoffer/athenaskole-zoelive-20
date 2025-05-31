
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdaptiveContent {
  id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  content_type: string;
  title: string;
  content: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  learning_objectives: string[];
  estimated_time: number;
}

interface UserPerformance {
  current_level: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
}

interface AdaptiveLearningEngineProps {
  subject: string;
  skillArea: string;
  onComplete?: (score: number) => void;
}

const AdaptiveLearningEngine = ({ subject, skillArea, onComplete }: AdaptiveLearningEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<AdaptiveContent | null>(null);
  const [performance, setPerformance] = useState<UserPerformance | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserPerformance();
      loadAdaptiveContent();
    }
  }, [user, subject, skillArea]);

  const loadUserPerformance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading performance:', error);
        return;
      }

      setPerformance(data || {
        current_level: 1,
        accuracy_rate: 0,
        attempts_count: 0,
        completion_time_avg: 0
      });
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const loadAdaptiveContent = async () => {
    if (!performance && !user) return;

    try {
      // Default to level 1 if no performance data
      const targetLevel = performance?.current_level || 1;
      
      const { data, error } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', targetLevel)
        .limit(1);

      if (error) {
        console.error('Error loading content:', error);
        toast({
          title: "Fejl",
          description: "Kunne ikke indlæse læringsindhold",
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        setContent(data[0]);
        setSessionStartTime(new Date());
        await createLearningSession(data[0].id, targetLevel);
      } else {
        toast({
          title: "Intet indhold",
          description: "Intet læringsindhold fundet for dit niveau",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLearningSession = async (contentId: string, difficultyLevel: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: user.id,
          subject,
          skill_area: skillArea,
          difficulty_level: difficultyLevel,
          content_id: contentId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return;
      }

      setSessionId(data.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!content || selectedAnswer === null || !user || !sessionStartTime) return;

    const isCorrect = selectedAnswer === content.content.correct;
    const completionTime = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);

    try {
      // Update learning session
      if (sessionId) {
        await supabase
          .from('learning_sessions')
          .update({
            end_time: new Date().toISOString(),
            completed: true,
            score: isCorrect ? 100 : 0,
            time_spent: completionTime
          })
          .eq('id', sessionId);
      }

      // Update user performance using the database function
      const { error: performanceError } = await supabase.rpc('update_user_performance', {
        p_user_id: user.id,
        p_subject: subject,
        p_skill_area: skillArea,
        p_is_correct: isCorrect,
        p_completion_time: completionTime
      });

      if (performanceError) {
        console.error('Error updating performance:', performanceError);
      }

      setShowExplanation(true);

      // Show feedback
      toast({
        title: isCorrect ? "Rigtigt! 🎉" : "Forkert svar",
        description: content.content.explanation,
        variant: isCorrect ? "default" : "destructive"
      });

      // Call completion callback
      if (onComplete) {
        onComplete(isCorrect ? 100 : 0);
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme dit svar",
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionStartTime(null);
    loadUserPerformance();
    loadAdaptiveContent();
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Indlæser adaptivt indhold...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-white">
            <Target className="w-12 h-12 text-lime-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Intet indhold tilgængeligt</h3>
            <p className="text-gray-400">Der er intet læringsindhold for {subject} - {skillArea} på dit niveau.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance Header */}
      {performance && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-lime-400 text-black border-lime-400">
                  Niveau {performance.current_level}
                </Badge>
                <div className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-4 h-4 text-lime-400" />
                  <span className="text-sm">{performance.accuracy_rate.toFixed(1)}% nøjagtighed</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{performance.completion_time_avg || 0}s gennemsnit</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {performance.attempts_count} forsøg
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Content */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-lime-400" />
            <span>{content.title}</span>
            <Badge variant="outline" className="ml-auto">
              Niveau {content.difficulty_level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-white">
            <h3 className="text-lg font-medium mb-4">{content.content.question}</h3>
            
            <div className="space-y-2">
              {content.content.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedAnswer === index 
                      ? "bg-lime-400 text-black hover:bg-lime-500" 
                      : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  }`}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Forklaring:</h4>
              <p className="text-gray-300">{content.content.explanation}</p>
              
              {content.learning_objectives && content.learning_objectives.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-lime-400 mb-1">Læringsmål:</h5>
                  <ul className="text-sm text-gray-400 list-disc list-inside">
                    {content.learning_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {!showExplanation ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-lime-400 hover:bg-lime-500 text-black"
              >
                Indsend Svar
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Næste Spørgsmål
              </Button>
            )}
            
            <div className="text-sm text-gray-400 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>~{content.estimated_time} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningEngine;
