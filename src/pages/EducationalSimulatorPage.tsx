
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Target, Play } from 'lucide-react';
import ScenarioPlayer from '@/components/scenario-engine/ScenarioPlayer';
import { demoScenarios } from '@/data/demoScenarios';
import { ScenarioDefinition } from '@/types/scenario';

const EducationalSimulatorPage: React.FC = () => {
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            Scenario-Based Learning
          </h1>
          <p className="text-gray-300 text-lg">
            Apply your knowledge in realistic, interactive scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoScenarios.map(scenario => (
            <Card key={scenario.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  {scenario.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{scenario.description}</p>
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">Subject:</span> {scenario.educational.subject}
                  <span className="mx-2">|</span>
                  <span className="font-semibold">Grade:</span> {scenario.educational.gradeLevel}
                </div>
                <Button
                  onClick={() => handleScenarioSelect(scenario.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Scenario
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationalSimulatorPage;
