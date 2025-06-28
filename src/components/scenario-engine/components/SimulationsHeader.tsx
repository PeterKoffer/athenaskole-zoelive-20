
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface SimulationsHeaderProps {
  onBack: () => void;
}

const SimulationsHeader: React.FC<SimulationsHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button onClick={onBack} variant="outline" className="border-gray-600 text-slate-950 bg-zinc-50">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">Scenario Engine - Test Environment</h1>
      </div>
    </div>
  );
};

export default SimulationsHeader;
