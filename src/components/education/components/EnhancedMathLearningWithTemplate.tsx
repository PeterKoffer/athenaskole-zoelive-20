
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import WorldClassTeachingTemplate from './WorldClassTeachingTemplate';
import OptimizedMathLearningContent from './math/OptimizedMathLearningContent';

interface EnhancedMathLearningWithTemplateProps {
  onBackToProgram: () => void;
}

const EnhancedMathLearningWithTemplate = ({ onBackToProgram }: EnhancedMathLearningWithTemplateProps) => {
  const { user } = useAuth();
  const { userRole, isTeacher } = useRoleAccess();
  const [showTemplate, setShowTemplate] = useState(true);
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

  // Only allow teachers and parents to see the template
  const canViewTeachingTemplate =
    isTeacher() || userRole === 'parent';

  const handleStartLesson = () => {
    console.log('🎯 Starting world-class math lesson');
    setShowTemplate(false);
    setHasStartedLesson(true);
  };

  const handleBackToTemplate = () => {
    setShowTemplate(true);
    setHasStartedLesson(false);
  };

  if (!user) {
    return null;
  }

  // Render template only for teachers and parents
  if (canViewTeachingTemplate && showTemplate && !hasStartedLesson) {
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

  // For students (and other roles), show lesson content directly
  return (
    <OptimizedMathLearningContent onBackToProgram={onBackToProgram} />
  );
};

export default EnhancedMathLearningWithTemplate;

