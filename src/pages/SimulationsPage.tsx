
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScenarioPlayer from '@/components/scenario-engine/ScenarioPlayer';
import { ScenarioDefinition } from '@/types/scenario';
import { testScenario } from '@/components/scenario-engine/data/testScenario';
import SimulationsHeader from '@/components/scenario-engine/components/SimulationsHeader';
import ScenarioCard from '@/components/scenario-engine/components/ScenarioCard';

const SimulationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = React.useState<ScenarioDefinition | null>(null);
  
  console.log('🎭 SimulationsPage rendering...');
  
  const handleBack = () => {
    console.log('⬅️ Navigating back...');
    navigate(-1);
  };

  const handleStartScenario = () => {
    console.log('🎭 Starting test scenario...');
    setCurrentScenario(testScenario);
  };

  const handleScenarioComplete = () => {
    console.log('🎉 Scenario completed!');
    setCurrentScenario(null);
  };

  const handleScenarioExit = () => {
    console.log('🚪 Exiting scenario...');
    setCurrentScenario(null);
  };

  if (currentScenario) {
    return (
      <div className="min-h-screen bg-gray-900">
        <ScenarioPlayer
          scenario={currentScenario}
          onComplete={handleScenarioComplete}
          onExit={handleScenarioExit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <SimulationsHeader onBack={handleBack} />

        {/* Test Environment Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
              Scenario Engine Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              This page is for testing the Scenario Engine functionality. You can run interactive learning scenarios here.
            </p>
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <p className="text-purple-300 text-sm">
                <strong>Test Scenario:</strong> Basic Addition Adventure - A simple math scenario with 
                interactive questions, hints, and branching logic.
              </p>
            </div>
          </CardContent>
        </Card>

        <ScenarioCard 
          scenario={testScenario}
          onStart={handleStartScenario}
        />
      </div>
    </div>
  );
};

export default SimulationsPage;
