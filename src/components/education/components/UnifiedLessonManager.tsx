
import SimplifiedLessonManager from './simplified/SimplifiedLessonManager';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({
  subject,
  skillArea,
  studentName,
  onBackToProgram
}: UnifiedLessonManagerProps) => {
  
  console.log('🎯 Using simplified lesson manager to fix training ground');
  
  return (
    <SimplifiedLessonManager
      subject={subject}
      skillArea={skillArea}
      studentName={studentName}
      onBackToProgram={onBackToProgram}
    />
  );
};

export default UnifiedLessonManager;