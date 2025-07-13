import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, BookOpen, Award, Play } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Daily Learning Program</h1>
            <p className="text-muted-foreground">Your personalized daily learning journey</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete 3 learning activities and earn achievements.
              </p>
              <Button className="w-full">
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Learning Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Interactive lessons tailored to your learning style.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/daily-universe')}
              >
                Explore Universe
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                Progress & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track your progress and unlock new achievements.
              </p>
              <Button className="w-full">
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Play className="w-5 h-5 mr-2 text-primary" />
                Quick Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Quick 5-minute exercises to reinforce learning.
              </p>
              <Button className="w-full">
                Quick Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyProgramPage;