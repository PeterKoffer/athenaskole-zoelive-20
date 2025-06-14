
import { useState, useCallback } from 'react';
import { getSubjectIntroduction, getEstimatedIntroductionTime } from '../components/utils/subjectIntroductions';

interface UseClassIntroductionProps {
  subject: string;
  skillArea?: string;
  userLevel?: string;
  onComplete?: () => void;
}

export const useClassIntroduction = ({
  subject,
  skillArea,
  userLevel = 'beginner',
  onComplete
}: UseClassIntroductionProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  const introduction = getSubjectIntroduction(subject, skillArea, userLevel);
  const estimatedTime = getEstimatedIntroductionTime(subject, skillArea);

  const handleIntroductionComplete = useCallback(() => {
    console.log('🎯 Class introduction completed for:', subject);
    setShowIntroduction(false);
    setHasCompleted(true);
    onComplete?.();
  }, [subject, onComplete]);

  const skipIntroduction = useCallback(() => {
    console.log('⏭️ Skipping introduction for:', subject);
    setShowIntroduction(false);
    setHasCompleted(true);
    onComplete?.();
  }, [subject, onComplete]);

  const restartIntroduction = useCallback(() => {
    console.log('🔄 Restarting introduction for:', subject);
    setShowIntroduction(true);
    setHasCompleted(false);
  }, [subject]);

  return {
    showIntroduction,
    hasCompleted,
    introduction,
    estimatedTime,
    handleIntroductionComplete,
    skipIntroduction,
    restartIntroduction
  };
};
