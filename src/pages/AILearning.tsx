
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import AILearningDashboard from '@/components/adaptive-learning/AILearningDashboard';

const AILearning = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AILearningDashboard />
      </div>
    </div>
  );
};

export default AILearning;
