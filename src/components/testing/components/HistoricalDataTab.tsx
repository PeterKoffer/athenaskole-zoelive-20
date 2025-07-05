
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, RotateCcw } from 'lucide-react';

interface HistoricalDataTabProps {
  historicalData: any;
  isLoadingData: boolean;
  onRefresh: () => void;
}

const HistoricalDataTab: React.FC<HistoricalDataTabProps> = ({
  historicalData,
  isLoadingData,
  onRefresh
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Database className="w-5 h-5" />
          Historical Progress Data
          <Button 
            onClick={onRefresh} 
            size="sm" 
            variant="outline"
            disabled={isLoadingData}
            className="text-gray-900 border-gray-300"
          >
            <RotateCcw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historicalData ? (
          <div className="space-y-4">
            {historicalData.map((stepProgress: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2 text-gray-900">Step {stepProgress.stepId}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Status: <Badge variant={stepProgress.isCompleted ? "default" : "secondary"}>
                    {stepProgress.isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(stepProgress.curriculumProgress).map(([objectiveId, progress]: [string, any]) => (
                    <div key={objectiveId} className="bg-gray-50 p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{objectiveId}</h4>
                        <Badge variant={progress.isCompleted ? "default" : "secondary"}>
                          {progress.isCompleted ? "✓ Complete" : "In Progress"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                        <div>Total Attempts: {progress.totalAttempts}</div>
                        <div>Successful: {progress.successfulAttempts}</div>
                        <div>Time Spent: {progress.totalTimeSpentSeconds}s</div>
                        <div>Success Rate: {((progress.successRate || 0) * 100).toFixed(1)}%</div>
                      </div>
                      
                      {progress.lastAttemptPerformance && (
                        <div className="mt-2 text-xs text-gray-600">
                          Last attempt: {progress.lastAttemptPerformance.success ? 'Success' : 'Failed'} 
                          in {progress.lastAttemptPerformance.timeTakenSeconds}s
                          {progress.lastAttemptPerformance.hintsUsed > 0 && ` (${progress.lastAttemptPerformance.hintsUsed} hints)`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {isLoadingData ? 'Loading historical data...' : 'No historical data available'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalDataTab;
