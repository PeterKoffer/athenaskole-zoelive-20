
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const AdaptiveTestHeader: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Brain className="w-8 h-8" />
          Adaptive Learning Integration Test Suite
        </CardTitle>
        <p className="text-blue-100">
          Comprehensive testing of the adaptive learning loop: InSessionAdaptiveManager → 
          UniverseSessionManager → AdaptiveDifficultyEngine
        </p>
      </CardHeader>
    </Card>
  );
};

export default AdaptiveTestHeader;
