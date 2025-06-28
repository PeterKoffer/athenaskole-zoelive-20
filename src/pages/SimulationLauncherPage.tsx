// src/pages/SimulationLauncherPage.tsx
import React, { useState } from 'react';
import type { ScenarioDefinition } from '@/types/scenario';
import ScenarioPlayer from '@/components/simulations/ScenarioPlayer';

// Import mock scenarios
// Adjust path if your scenario files are located elsewhere or named differently
import marketingScenarioMock from '@/data/scenarios/marketingScenarioMock.json';
// import crisisScenarioMock from '@/data/scenarios/crisisScenarioMock.json'; // Example for a second scenario

// Prepare a list of available scenarios
const availableScenarios: ScenarioDefinition[] = [
  marketingScenarioMock as ScenarioDefinition,
  // crisisScenarioMock as ScenarioDefinition, // Add more scenarios here
];

const SimulationLauncherPage: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition | null>(null);
  const [scenarioKey, setScenarioKey] = useState<number>(0); // Used to force re-mount of ScenarioPlayer

  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    setSelectedScenario(scenario);
    setScenarioKey(prevKey => prevKey + 1); // Change key to force re-mount and reset ScenarioPlayer state
  };

  const handleScenarioComplete = (pathTaken: string[], finalNodeId: string) => {
    console.log('Scenario completed! Path:', pathTaken, 'Final Node:', finalNodeId);
    // Here you could navigate away, show a summary, or allow selecting another scenario
    // For now, we can allow selecting another scenario by clearing the current one,
    // or simply let them re-select from the list.
    // setSelectedScenario(null); // Option to go back to list after completion
  };

  if (selectedScenario) {
    return (
      <div className="container mx-auto p-4">
        <Button onClick={() => setSelectedScenario(null)} variant="outline" className="mb-4">
          &larr; Back to Scenario List
        </Button>
        <ScenarioPlayer
          key={scenarioKey} // Force re-mount when scenario changes to reset internal state
          scenario={selectedScenario}
          onScenarioComplete={handleScenarioComplete}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Select a Simulation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableScenarios.map((scenario) => (
          <Card key={scenario.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{scenario.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">{scenario.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSelectScenario(scenario)} className="w-full">
                Launch Scenario
              </Button>
            </CardFooter>
          </Card>
        ))}
        {availableScenarios.length === 0 && (
          <p>No scenarios currently available.</p>
        )}
      </div>
    </div>
  );
};

// Minimalist Button, Card components if not using a UI library like ShadCN
// This is just for the component to be runnable if UI components aren't fully set up.
// Replace with actual imports from '@/components/ui/...'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; className?: string }> = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded ${className}`} {...props}>{children}</button>
);
const Card: React.FC<{className?: string, children: React.ReactNode}> = ({ children, className }) => <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>;
const CardHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mb-2">{children}</div>;
const CardTitle: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>;
const CardContent: React.FC<{children: React.ReactNode}> = ({ children }) => <div>{children}</div>;
const CardFooter: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mt-4">{children}</div>;


export default SimulationLauncherPage;
