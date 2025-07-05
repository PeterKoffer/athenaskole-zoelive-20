
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface DifficultyPredictionsTabProps {
  objectives: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  difficultyPredictions: Record<string, string>;
}

const DifficultyPredictionsTab: React.FC<DifficultyPredictionsTabProps> = ({
  objectives,
  difficultyPredictions
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Brain className="w-5 h-5" />
          Current Difficulty Predictions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on historical performance, here are the initial difficulty suggestions:
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectives.map((objective) => (
            <div key={objective.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-sm mb-2 text-gray-900">{objective.id}</h3>
              <p className="text-xs text-gray-600 mb-3">{objective.title}</p>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={
                  objective.status === 'completed' ? 'border-green-500 text-green-600' :
                  objective.status === 'struggling' ? 'border-red-500 text-red-600' :
                  'border-yellow-500 text-yellow-600'
                }>
                  {objective.status}
                </Badge>
                
                <Badge className={
                  difficultyPredictions[objective.id] === 'easy' ? 'bg-green-100 text-green-800' :
                  difficultyPredictions[objective.id] === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  difficultyPredictions[objective.id] === 'hard' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {difficultyPredictions[objective.id] || 'loading...'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyPredictionsTab;
