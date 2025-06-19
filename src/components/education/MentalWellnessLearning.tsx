import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Assuming this path is correct
import { useNavigate } from 'react-router-dom';
import ClassroomEnvironment from './components/shared/ClassroomEnvironment';
import { getClassroomConfig } from './components/shared/classroomConfigs';
import EnhancedMentalWellnessLearning from './EnhancedMentalWellnessLearning'; // Will be created

const MentalWellnessLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // It's good practice to ensure 'mentalWellness' key exists or handle potential undefined
  const classroomConfig = getClassroomConfig('mentalWellness') || getClassroomConfig('default'); // Fallback to a default if needed

  useEffect(() => {
jules_wip_15189971815575095135
    console.log(`[${classroomConfig?.subjectName || 'MentalWellnessLearning'}] Auth Check: Loading: ${loading}, User: ${user?.id}`);
    if (!loading && !user) {
      console.warn(`[${classroomConfig?.subjectName || 'MentalWellnessLearning'}] Redirecting to /auth. Loading: ${loading}, User: ${user === null}`);
      navigate('/auth'); // Navigate to login/auth page if not authenticated
    }
  }, [user, loading, navigate, classroomConfig?.subjectName]);
    if (!loading && !user) {
      navigate('/auth'); // Navigate to login/auth page if not authenticated
    }
  }, [user, loading, navigate]);
main

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center p-8 bg-gray-800 bg-opacity-50 rounded-lg">
            {/* Use an appropriate icon, e.g., from classroomConfig or a default */}
            <div className="text-5xl mb-6 animate-pulse">{classroomConfig.loadingIcon || '🧠'}</div>
            <p className="text-xl font-semibold text-gray-200">{classroomConfig.loadingMessage || 'Loading your Mental Wellness lesson...'}</p>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  if (!user) {
    // Optionally, you can render a message or redirect again,
    // but useEffect should handle the redirect. Returning null is fine.
    return null;
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-8 md:py-10 px-2 flex flex-col items-center justify-start"> {/* Changed to justify-start for better layout */}
        {/*
          The EnhancedMentalWellnessLearning component will take the full width
          and manage its own padding and centering for content.
        */}
        <EnhancedMentalWellnessLearning />
      </div>
    </ClassroomEnvironment>
  );
};

export default MentalWellnessLearning;
