import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Play, Settings, BarChart3, Target } from 'lucide-react';
import ScenarioPlayer from '@/components/scenario-engine/ScenarioPlayer';
import { demoScenarios } from '@/data/demoScenarios';
import { ScenarioDefinition } from '@/types/scenario';

const ConsolidatedSimulatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition | null>(null);

  useEffect(() => {
    // If a scenario is passed via state, use it
    if (location.state?.scenario) {
      setSelectedScenario(location.state.scenario);
    }
  }, [location.state]);

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
  };

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };

  const handleComplete = () => {
    console.log('Scenario completed!');
    setSelectedScenario(null);
  };

  const handleExit = () => {
    console.log('Exiting scenario...');
    setSelectedScenario(null);
  };

  // If a scenario is active, show the scenario player
  if (selectedScenario) {
    return (
      <ScenarioPlayer
        scenario={selectedScenario}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/daily-program')}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Daily Program
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-primary" />
              Learning Simulator
            </h1>
            <p className="text-muted-foreground">Interactive simulations and scenario-based learning</p>
          </div>
        </div>

        <Tabs defaultValue="simulations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simulations">Virtual Labs</TabsTrigger>
            <TabsTrigger value="scenarios">Real-World Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="simulations" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Interactive Virtual Labs</h2>
              <p className="text-muted-foreground">Hands-on simulations for experiential learning</p>
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
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Scenario-Based Learning</h2>
              <p className="text-muted-foreground">Apply your knowledge in realistic, interactive scenarios</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoScenarios.map(scenario => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {scenario.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{scenario.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">Subject:</span> {scenario.educational.subject}
                      <span className="mx-2">|</span>
                      <span className="font-semibold">Grade:</span> {scenario.educational.gradeLevel}
                    </div>
                    <Button
                      onClick={() => handleScenarioSelect(scenario.id)}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Scenario
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-muted-foreground mb-4">
                These simulations and scenarios adapt to your learning style and provide personalized feedback
              </p>
              <Button variant="outline">
                View Progress Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedSimulatorPage;