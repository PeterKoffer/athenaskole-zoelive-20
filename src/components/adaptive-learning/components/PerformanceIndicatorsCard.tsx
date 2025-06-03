
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface PerformanceIndicatorsCardProps {
  performanceMetrics: {
    accuracy: number;
    averageTime: number;
    totalAttempts: number;
  };
}

const PerformanceIndicatorsCard = ({ performanceMetrics }: PerformanceIndicatorsCardProps) => {
  if (performanceMetrics.totalAttempts === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Target className="w-5 h-5 text-lime-400" />
          <span>Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-lime-400">
            {Math.round(performanceMetrics.accuracy)}%
          </div>
          <div className="text-xs text-gray-400">Nøjagtighed</div>
        </div>
        <div>
          <div className="text-lg font-bold text-lime-400">
            {Math.round(performanceMetrics.averageTime)}s
          </div>
          <div className="text-xs text-gray-400">Gns. tid</div>
        </div>
        <div>
          <div className="text-lg font-bold text-lime-400">
            {performanceMetrics.totalAttempts}
          </div>
          <div className="text-xs text-gray-400">Forsøg</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicatorsCard;
