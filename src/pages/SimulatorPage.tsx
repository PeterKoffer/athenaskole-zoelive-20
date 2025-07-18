
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Play, Settings, BarChart3 } from 'lucide-react';

const SimulatorPage = () => {
  const navigate = useNavigate();
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const simulations = [
    {
      id: 'math-fraction',
      title: 'Fraction Mastery',
      description: 'Interactive fraction learning with visual representations',
      difficulty: 'Grade 3-5',
      duration: '15-20 minutes',
      icon: '🔢'
    },
    {
      id: 'science-ecosystem',
      title: 'Ecosystem Explorer',
      description: 'Simulate different ecosystems and food chains',
      difficulty: 'Grade 4-6',
      duration: '20-25 minutes',
      icon: '🌿'
    },
    {
      id: 'geography-climate',
      title: 'Climate Simulator',
      description: 'Explore how climate affects different regions',
      difficulty: 'Grade 5-7',
      duration: '25-30 minutes',
      icon: '🌍'
    },
    {
      id: 'physics-motion',
      title: 'Motion & Forces',
      description: 'Experiment with physics concepts in a virtual lab',
      difficulty: 'Grade 6-8',
      duration: '20-30 minutes',
      icon: '⚡'
    }
  ];

  const startSimulation = (simulationId: string) => {
    console.log('Starting simulation:', simulationId);
    setActiveSimulation(simulationId);
    // In a real app, this would navigate to the specific simulation
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-primary" />
              Learning Simulator
            </h1>
            <p className="text-muted-foreground">Interactive simulations for hands-on learning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((simulation) => (
            <Card key={simulation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <span className="text-2xl mr-3">{simulation.icon}</span>
                  {simulation.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    {simulation.difficulty}
                  </span>
                  <span>⏱️ {simulation.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{simulation.description}</p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => startSimulation(simulation.id)}
                    className="flex-1"
                    disabled={activeSimulation === simulation.id}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {activeSimulation === simulation.id ? 'Running...' : 'Start Simulation'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {activeSimulation === simulation.id && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      🎯 Simulation "{simulation.title}" is now active!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This is a demo. In the full version, you would see the interactive simulation here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Simulations</h3>
              <p className="text-muted-foreground mb-4">
                These simulations adapt to your learning style and provide personalized feedback
              </p>
              <Button variant="outline">
                View All Simulations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
