
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DailyUniverseExperience from '@/components/dailyUniverse/DailyUniverseExperience';
import { CurriculumStep } from '@/types/curriculum';

const DailyUniversePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [curriculumSteps, setCurriculumSteps] = useState<CurriculumStep[]>([]);

  useEffect(() => {
    // Load curriculum steps from the JSON file
    fetch('/data/curriculum-steps.json')
      .then(response => response.json())
      .then(data => setCurriculumSteps(data))
      .catch(error => console.error('Failed to load curriculum steps:', error));
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🌟</div>
          <p className="text-lg">Preparing your learning universe...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your Daily Universe</h1>
        </div>
      </div>
    );
  }

  return (
    <DailyUniverseExperience 
      curriculumSteps={curriculumSteps}
      studentAge={8} // This could be derived from user profile
    />
  );
};

export default DailyUniversePage;
