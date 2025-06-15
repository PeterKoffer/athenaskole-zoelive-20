
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WorldClassTeachingTemplate from './WorldClassTeachingTemplate';
import OptimizedMathLearningContent from './math/OptimizedMathLearningContent';

interface EnhancedMathLearningWithTemplateProps {
  onBackToProgram: () => void;
}

const EnhancedMathLearningWithTemplate = ({ onBackToProgram }: EnhancedMathLearningWithTemplateProps) => {
  const { user } = useAuth();
  const [showTemplate, setShowTemplate] = useState(true);
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

  const handleStartLesson = () => {
    console.log('🎯 Starting world-class math lesson');
    setShowTemplate(false);
    setHasStartedLesson(true);
  };

  const handleBackToTemplate = () => {
    setShowTemplate(true);
    setHasStartedLesson(false);
  };

  // Show template first
  if (showTemplate && !hasStartedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="container mx-auto py-8">
          <WorldClassTeachingTemplate
            subject="Mathematics"
            studentName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}
            gradeLevel={6}
            onStartLesson={handleStartLesson}
          />
        </div>
      </div>
    );
  }

  // Show the actual lesson
  return (
    <OptimizedMathLearningContent onBackToProgram={onBackToProgram} />
  );
};

export default EnhancedMathLearningWithTemplate;
