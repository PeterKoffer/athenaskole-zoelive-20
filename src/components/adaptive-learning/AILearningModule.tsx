
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  onComplete?: (score: number) => void;
}

interface AdaptiveQuestion {
  id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  content: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  learning_objectives: string[];
  estimated_time: number;
}

const AILearningModule = ({ subject, skillArea, onComplete }: AILearningModuleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState<AdaptiveQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user, subject, skillArea]);

  const initializeSession = async () => {
    if (!user) return;

    try {
      // Get user's current level for this subject/skill area
      const { data: performanceData } = await supabase
        .from('user_performance')
        .select('current_level')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      const userLevel = performanceData?.current_level || 1;
      setCurrentLevel(userLevel);

      // Create a new learning session
      const { data: sessionData, error: sessionError } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: user.id,
          subject,
          skill_area: skillArea,
          difficulty_level: userLevel,
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return;
      }

      setSessionId(sessionData.id);
      await loadQuestion(userLevel);
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke starte AI-læringsmodul",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (level: number) => {
    try {
      const { data, error } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', level)
        .limit(1);

      if (error) {
        console.error('Error loading question:', error);
        return;
      }

      if (data && data.length > 0) {
        const rawContent = data[0];
        
        const parsedContent = typeof rawContent.content === 'string' 
          ? JSON.parse(rawContent.content) 
          : rawContent.content;

        const adaptiveQuestion: AdaptiveQuestion = {
          id: rawContent.id,
          subject: rawContent.subject,
          skill_area: rawContent.skill_area,
          difficulty_level: rawContent.difficulty_level,
          content: parsedContent,
          learning_objectives: rawContent.learning_objectives || [],
          estimated_time: rawContent.estimated_time || 0
        };

        setQuestion(adaptiveQuestion);
        setProgress(25);
      } else {
        toast({
          title: "Intet indhold",
          description: `Intet AI-genereret indhold fundet for ${subject} niveau ${level}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!question || selectedAnswer === null || !user || !sessionId) return;

    const isCorrect = selectedAnswer === question.content.correct;
    setShowExplanation(true);
    setProgress(75);

    try {
      // Log AI interaction
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        ai_service: 'openai',
        interaction_type: 'content_generation',
        prompt_text: `Adaptive learning question for ${subject} - ${skillArea}`,
        response_data: { question: question.content.question, user_answer: selectedAnswer, correct: isCorrect },
        success: true,
        subject,
        skill_area: skillArea,
        difficulty_level: question.difficulty_level
      });

      // Update session
      await supabase
        .from('learning_sessions')
        .update({
          score: isCorrect ? 100 : 0,
          completed: true,
          end_time: new Date().toISOString(),
          time_spent: 5 // Estimate 5 minutes for now
        })
        .eq('id', sessionId);

      // Update user performance
      await supabase.rpc('update_user_performance', {
        p_user_id: user.id,
        p_subject: subject,
        p_skill_area: skillArea,
        p_is_correct: isCorrect,
        p_completion_time: 300 // 5 minutes in seconds
      });

      toast({
        title: isCorrect ? "Rigtigt! 🎉" : "Forkert svar",
        description: question.content.explanation,
        variant: isCorrect ? "default" : "destructive"
      });

      setProgress(100);

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
    setProgress(0);
    
    // Load a new question or adjust difficulty based on performance
    const newLevel = selectedAnswer === question?.content.correct 
      ? Math.min(currentLevel + 1, 10) 
      : Math.max(currentLevel - 1, 1);
    
    setCurrentLevel(newLevel);
    loadQuestion(newLevel);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">AI lærer dig at kende...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-white">
            <Sparkles className="w-12 h-12 text-lime-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI-læringsmodul ikke tilgængeligt</h3>
            <p className="text-gray-400">Intet AI-genereret indhold for {subject} - {skillArea} på niveau {currentLevel}.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Learning Header */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-lime-400" />
              <div>
                <h3 className="text-white font-semibold">AI-Tilpasset Læring</h3>
                <p className="text-gray-300 text-sm">Personligt niveau {currentLevel}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-lime-400 text-black border-lime-400">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Genereret
            </Badge>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Learning Content */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="w-5 h-5 text-lime-400" />
            <span className="capitalize">{subject} - {skillArea}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-white">
            <h3 className="text-lg font-medium mb-4">{question.content.question}</h3>
            
            <div className="space-y-2">
              {question.content.options.map((option, index) => (
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
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-lime-400 mr-2" />
                <h4 className="font-semibold text-white">AI Forklaring:</h4>
              </div>
              <p className="text-gray-300 mb-3">{question.content.explanation}</p>
              
              {question.learning_objectives && question.learning_objectives.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-lime-400 mb-1">Læringsmål:</h5>
                  <ul className="text-sm text-gray-400 list-disc list-inside">
                    {question.learning_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            {!showExplanation ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-lime-400 hover:bg-lime-500 text-black"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Indsend Svar
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Næste AI Spørgsmål
              </Button>
            )}
            
            <div className="text-sm text-gray-400 flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>~{question.estimated_time} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningModule;
