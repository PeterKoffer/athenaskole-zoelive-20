import React, { useEffect, useState } from 'react';
import { universeGenerationService } from '../services/UniverseGenerationService';
import { CurriculumNode } from '../types/curriculum/CurriculumNode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BookOpen, Target, Award } from 'lucide-react';
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
        
        const studentProfile = user || {};
        const dailyUniverse = await universeGenerationService.generate(studentProfile);
        setUniverse(dailyUniverse);
      } catch (err) {
        setError('Failed to load your daily universe. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniverse();
  }, [user]);

  const handleStartTask = (objective: CurriculumNode) => {
    console.log('Starting task for objective:', objective.name);
    toast.success(`Starting: ${objective.name}`, {
      description: 'Loading your personalized learning experience...'
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
          <p className="text-lg text-muted-foreground">Loading your daily universe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {universe.title || 'Your Learning Universe'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {universe.description || 'Explore exciting learning opportunities tailored just for you!'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{objectives.length}</div>
              <div className="text-sm text-muted-foreground">Learning Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">~45</div>
              <div className="text-sm text-muted-foreground">Minutes Total</div>
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
              <Card key={objective.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                      {objective.name}
                    </CardTitle>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {objective.subjectName}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {objective.description || `Explore key concepts in ${objective.subjectName} through interactive exercises and real-world applications.`}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded">
                      {objective.educationalLevel || 'Grade 4'}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded">
                      ~15 min
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleStartTask(objective)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Learning Journey
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No learning objectives available at the moment.
            </p>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            🌟 Complete all tasks to unlock special achievements and advance your learning journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyUniversePage;
