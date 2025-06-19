// src/components/education/LifeEssentialsLearning.tsx
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ClassroomEnvironment from './components/shared/ClassroomEnvironment';
import { getClassroomConfig } from './components/shared/classroomConfigs';
import EnhancedLifeEssentialsLearning from './EnhancedLifeEssentialsLearning';

const LifeEssentialsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const classroomConfig = getClassroomConfig('lifeEssentials') || getClassroomConfig('default');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center p-8 bg-gray-800 bg-opacity-75 rounded-lg">
            <div className="text-5xl mb-6 animate-pulse">{classroomConfig.loadingIcon || '🛠️'}</div>
            <p className="text-xl font-semibold text-gray-200">{classroomConfig.loadingMessage || 'Loading Life Essentials...'}</p>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-10 px-2 flex items-center justify-center">
        <EnhancedLifeEssentialsLearning />
      </div>
    </ClassroomEnvironment>
  );
};

export default LifeEssentialsLearning;
