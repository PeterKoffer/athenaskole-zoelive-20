
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Target } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Nelie
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your personalized AI-powered learning companion that adapts to your unique learning style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Adaptive Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Content that adjusts to your pace and learning preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Powered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Smart recommendations based on your progress and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Goal-Oriented
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track progress and achieve your learning objectives.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/daily-universe')}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Learning Journey
            </Button>
            
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
