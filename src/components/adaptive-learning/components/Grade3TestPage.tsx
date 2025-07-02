
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Grade3FractionTestTrigger from './Grade3FractionTestTrigger';

interface Grade3TestPageProps {
  onBack: () => void;
}

const Grade3TestPage: React.FC<Grade3TestPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tests
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Grade 3 Fraction Content Analysis</h1>
          <p className="text-gray-600">Targeted testing for 3.NF.A.1 standard and unit fraction concepts</p>
        </div>
      </div>

      <Grade3FractionTestTrigger />
    </div>
  );
};

export default Grade3TestPage;
