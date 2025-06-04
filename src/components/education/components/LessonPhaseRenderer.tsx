
import NelieIntroduction from './NelieIntroduction';
import ExtendedLessonManager from './ExtendedLessonManager';
import LessonPausedView from './LessonPausedView';
import LessonCompletedView from './LessonCompletedView';
import { LessonState } from './LessonStateManager';

interface LessonPhaseRendererProps {
  lessonState: LessonState;
  onLessonStart: () => void;
  onLessonComplete: () => void;
  onLessonResume: () => void;
  onBackToProgram: () => void;
}

const LessonPhaseRenderer = ({
  lessonState,
  onLessonStart,
  onLessonComplete,
  onLessonResume,
  onBackToProgram
}: LessonPhaseRendererProps) => {
  switch (lessonState.phase) {
    case 'introduction':
      return (
        <NelieIntroduction 
          subject="mathematics"
          skillArea="arithmetic"
          onIntroductionComplete={onLessonStart}
        />
      );
    
    case 'lesson':
      return (
        <ExtendedLessonManager 
          subject="mathematics"
          skillArea="arithmetic"
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
