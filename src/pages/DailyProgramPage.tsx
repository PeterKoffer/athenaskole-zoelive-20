
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen, Play } from 'lucide-react';

const DailyProgramPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your daily program...</p>
        </div>
      </div>
    );
  }

  const handleStartUniverse = () => {
    navigate('/daily-universe');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-primary" />
              Today's Program
            </h1>
            <p className="text-muted-foreground">Welcome back! Here's your personalized AI-generated learning universe for today.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-primary" />
                Your AI-Generated Learning Universe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Today's learning adventure is uniquely crafted just for you! Dive into an immersive, 
                AI-generated educational universe filled with interactive content, engaging storylines, 
                and personalized challenges that adapt to your learning style.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎯 Personalized Content</h4>
                  <p className="text-sm text-muted-foreground">
                    AI-crafted lessons that adapt to your progress and interests
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🌟 Interactive Universe</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore characters, locations, and activities in your learning world
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">⚡ Dynamic Learning</h4>
                  <p className="text-sm text-muted-foreground">
                    Content that evolves based on your performance and engagement
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">🎮 Gamified Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn through engaging activities and achievement systems
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleStartUniverse}
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Today's Learning Universe
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Need More Practice?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Looking for specific subject practice? Visit the Training Ground for focused learning activities.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/training-ground')}
                className="border-border text-foreground hover:bg-accent"
              >
                Go to Training Ground
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyProgramPage;
