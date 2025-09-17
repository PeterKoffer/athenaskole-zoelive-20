
import React from 'react';
import ProgressDashboard from '@/components/ProgressDashboard';

// Mock user progress data - in a real app this would come from an API/database
const mockUserProgress = {
  mathematics: 75,
  danish: 68,
  english: 82,
  science: 71
};

const ProgressDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
          <p className="text-gray-600">Track your learning progress across all subjects</p>
        </div>
        
        <ProgressDashboard userProgress={mockUserProgress} />
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
