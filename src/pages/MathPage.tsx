import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Book, Target, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MathPage = () => {
  const navigate = useNavigate();

  const mathTopics = [
    { 
      name: 'Basic Arithmetic', 
      description: 'Addition, subtraction, multiplication, and division',
      icon: Calculator,
      difficulty: 'Beginner'
    },
    { 
      name: 'Fractions & Decimals', 
      description: 'Understanding parts of wholes and decimal places',
      icon: Target,
      difficulty: 'Intermediate'
    },
    { 
      name: 'Geometry', 
      description: 'Shapes, angles, and spatial relationships',
      icon: Book,
      difficulty: 'Intermediate'
    },
    { 
      name: 'Algebra', 
      description: 'Variables, equations, and problem solving',
      icon: Trophy,
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Calculator className="w-10 h-10 mr-3" />
            Mathematics Learning
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore interactive math lessons and activities tailored to your level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mathTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card key={topic.name} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center">
                    <IconComponent className="w-6 h-6 mr-2" />
                    {topic.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {topic.difficulty}
                    </span>
                    <Button 
                      onClick={() => navigate('/daily-universe')}
                      variant="default"
                      size="sm"
                    >
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Your Math Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Level:</span>
                <span className="font-semibold text-foreground">Beginner</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lessons Completed:</span>
                <span className="font-semibold text-foreground">0 / 20</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <Button 
                onClick={() => navigate('/daily-universe')}
                className="w-full"
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathPage;