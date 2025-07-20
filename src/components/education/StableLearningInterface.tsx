import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// import AdaptiveEducationSession from './AdaptiveEducationSession'; // Temporarily disabled

// Update the props interface
interface StableLearningInterfaceProps {
  subject: string;
  skillArea: string;
  studentName?: string;
  onComplete: () => void;
  onBack: () => void;
}

const StableLearningInterface = ({ 
  subject, 
  skillArea, 
  studentName, 
  onComplete, 
  onBack 
}: StableLearningInterfaceProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h2 className="text-3xl font-bold mb-4">
          Stable Learning Interface
        </h2>
        <p className="text-gray-400 mb-8">
          Subject: {subject}, Skill Area: {skillArea}
        </p>
      
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-300">Learning interface coming soon...</p>
          <Button onClick={onComplete} className="mt-4">Complete Session</Button>
        </div>
    </div>
  </div>
  );
};

export default StableLearningInterface;
