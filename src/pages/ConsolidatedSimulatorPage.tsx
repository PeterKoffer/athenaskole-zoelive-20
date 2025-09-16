import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, Brain, Play, Target } from 'lucide-react';
import ScenarioPlayer from '@/components/scenario-engine/ScenarioPlayer';
import { demoScenarios } from '@/data/demoScenarios';
import { ScenarioDefinition } from '@/types/scenario';

const ConsolidatedSimulatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition | null>(null);

  useEffect(() => {
    // If a scenario is passed via state, use it
    if (location.state?.scenario) {
      setSelectedScenario(location.state.scenario);
    }
  }, [location.state]);

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
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Daily Program
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-primary" />
              Real-World Scenarios
            </h1>
            <p className="text-muted-foreground">Apply your knowledge in realistic, interactive scenarios</p>
          </div>
        </div>

        <div className="space-y-6">
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
        </div>

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