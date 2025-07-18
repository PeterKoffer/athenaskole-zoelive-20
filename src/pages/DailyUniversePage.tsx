
import React, { useEffect, useState } from 'react';
import { aiUniverseGenerator } from '../services/AIUniverseGenerator';
import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BookOpen, Target, Award, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DailyUniversePage: React.FC = () => {
  const [universe, setUniverse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUniverse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📡 DailyUniversePage: Starting AI universe generation...');
        
        const studentProfile = user || {
          name: 'Student',
          gradeLevel: 4,
          interests: ['space', 'dinosaurs'],
          abilities: { math: 'beginner' },
        };
        
        console.log('👤 Student profile:', studentProfile);
        
        const generatedUniverse = await aiUniverseGenerator.generateUniverse(studentProfile);
        
        if (!generatedUniverse) {
          throw new Error('No universe was generated');
        }
        
        console.log('🎯 Generated universe:', generatedUniverse);
        setUniverse(generatedUniverse);
        
        toast.success('AI Universe Generated!', {
          description: `Welcome to "${generatedUniverse.title}"`
        });
        
      } catch (err) {
        console.error('❌ Error generating AI universe:', err);
        const errorMessage = err.message || 'Failed to load your daily universe. Please try again.';
        setError(errorMessage);
        
        toast.error('Failed to Generate Universe', {
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniverse();
  }, [user]);

  const handleStartTask = (objective: CurriculumNode) => {
    console.log('🎯 Starting enhanced task for objective:', objective.name);
    toast.success(`Starting: ${objective.name}`, {
      description: 'Loading your personalized learning adventure...'
    });
    
    setTimeout(() => {
      navigate('/simulator', { 
        state: { 
          objective,
          kcId: objective.id,
          subject: objective.subjectName,
          skillArea: objective.name
        } 
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Creating your AI-powered learning adventure...</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>OpenAI is generating personalized content just for you</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-2xl mx-auto p-6">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">AI Generation Failed</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              {error.includes('API key') && (
                <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                  <p className="text-sm font-medium">To fix this issue:</p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Get an OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></li>
                    <li>Add it as VITE_OPENAI_API_KEY in your environment variables</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">No universe available</p>
          <Button onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }

  const objectives = universe.objectives || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {universe.title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {universe.description}
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Target className="h-4 w-4" />
            AI-Generated Theme: {universe.theme || 'Personalized Learning Quest'}
          </div>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            ✨ Powered by OpenAI
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{objectives.length}</div>
              <div className="text-sm text-muted-foreground">AI-Generated Challenges</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">~45</div>
              <div className="text-sm text-muted-foreground">Minutes of Fun</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Objectives Grid */}
        {objectives.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {objectives.map((objective: CurriculumNode, index: number) => (
              <Card key={objective.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                      {objective.name}
                    </CardTitle>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2 flex-shrink-0 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {objective.subjectName}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {objective.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded">
                      {objective.educationalLevel || 'Grade 4'}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded">
                      ~15 min
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                      AI-Generated
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleStartTask(objective)}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Begin AI Adventure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No learning adventures available at the moment.
            </p>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center py-8">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Complete all AI-generated adventures to unlock special achievements!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyUniversePage;
