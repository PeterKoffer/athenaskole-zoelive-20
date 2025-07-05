
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ScenarioResult {
  initialDifficulty: string;
  finalDifficulty: string;
  sessionMetrics: any;
  historicalUpdate: any;
  consoleLogs: string[];
}

interface ScenarioResultsCardProps {
  title: string;
  results: ScenarioResult | null;
  icon: React.ReactNode;
}

const ScenarioResultsCard: React.FC<ScenarioResultsCardProps> = ({ 
  title, 
  results, 
  icon 
}) => {
  if (!results) return null;

  return (
    <Card className="mt-4 bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          {icon}
          {title} - Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="summary" className="text-gray-900">Summary</TabsTrigger>
            <TabsTrigger value="metrics" className="text-gray-900">Session Metrics</TabsTrigger>
            <TabsTrigger value="historical" className="text-gray-900">Historical Update</TabsTrigger>
            <TabsTrigger value="logs" className="text-gray-900">Console Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Initial Difficulty</h4>
                <Badge variant="outline" className="text-gray-900">{results.initialDifficulty}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Final Difficulty</h4>
                <Badge variant="outline" className="text-gray-900">{results.finalDifficulty}</Badge>
              </div>
            </div>
            
            {results.initialDifficulty !== results.finalDifficulty && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  Difficulty suggestion changed from {results.initialDifficulty} to {results.finalDifficulty}!
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="metrics">
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-gray-900 border">
              {JSON.stringify(results.sessionMetrics, null, 2)}
            </pre>
          </TabsContent>
          
          <TabsContent value="historical">
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto text-gray-900 border">
              {JSON.stringify(results.historicalUpdate, null, 2)}
            </pre>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="space-y-2">
              {results.consoleLogs.map((log, index) => (
                <div key={index} className="font-mono text-sm bg-gray-100 p-2 rounded border text-gray-900">
                  {log}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScenarioResultsCard;
