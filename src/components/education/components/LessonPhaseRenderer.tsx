
import NelieIntroduction from './NelieIntroduction';
import EnhancedLessonManager from './EnhancedLessonManager';
import LessonPausedView from './LessonPausedView';
import LessonCompletedView from './LessonCompletedView';
import { LessonState } from './LessonStateManager';

interface LessonPhaseRendererProps {
  lessonState: LessonState;
  onLessonStart: () => void;
  onLessonComplete: () => void;
  onLessonResume: () => void;
  onBackToProgram: () => void;
  subject?: string;
  skillArea?: string;
}

const LessonPhaseRenderer = ({
  lessonState,
  onLessonStart,
  onLessonComplete,
  onLessonResume,
  onBackToProgram,
  subject = "mathematics",
  skillArea = "arithmetic"
}: LessonPhaseRendererProps) => {
  console.log('🎬 LessonPhaseRenderer rendering phase:', lessonState.phase, 'for subject:', subject);

  switch (lessonState.phase) {
    case 'introduction':
      return (
        <NelieIntroduction 
          subject={subject}
          skillArea={skillArea}
          onIntroductionComplete={onLessonStart}
        />
      );
    
    case 'lesson':
      return (
        <EnhancedLessonManager 
          subject={subject}
          skillArea={skillArea}
          onLessonComplete={onLessonComplete}
          onBack={onBackToProgram}
        />
      );
    
    case 'paused':
      return (
        <LessonPausedView 
          onResume={onLessonResume}
          onBackToProgram={onBackToProgram}
        />
      );
    
    case 'completed':
      return (
        <LessonCompletedView 
          onBackToProgram={onBackToProgram}
        />
      );
    
    default:
      return null;
  }
};

export default LessonPhaseRenderer;
