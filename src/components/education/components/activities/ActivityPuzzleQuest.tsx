
import { useState, useEffect } from 'react';
import { LessonActivity } from '../types/LessonTypes';
import PuzzleQuestBriefing from './puzzle-quest/PuzzleQuestBriefing';
import PuzzleQuestSolving from './puzzle-quest/PuzzleQuestSolving';
import PuzzleQuestTriumph from './puzzle-quest/PuzzleQuestTriumph';

interface ActivityPuzzleQuestProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityPuzzleQuest = ({ activity, onActivityComplete }: ActivityPuzzleQuestProps) => {
  const [questPhase, setQuestPhase] = useState<'briefing' | 'solving' | 'triumph'>('briefing');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleStartQuest = () => {
    setQuestPhase('solving');
    // Simulate puzzle solving time
    setTimeout(() => {
      setQuestPhase('triumph');
    }, 4000);
  };

  const handleShowHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  };

  const handleCompleteQuest = () => {
    onActivityComplete(true);
  };

  useEffect(() => {
    if (questPhase === 'triumph') {
      const timer = setTimeout(() => {
        handleCompleteQuest();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [questPhase]);

  if (questPhase === 'briefing') {
    return (
      <PuzzleQuestBriefing
        activity={activity}
        onStartQuest={handleStartQuest}
      />
    );
  }

  if (questPhase === 'solving') {
    return (
      <PuzzleQuestSolving
        hintsUsed={hintsUsed}
        showHint={showHint}
        onShowHint={handleShowHint}
      />
    );
  }

  return <PuzzleQuestTriumph />;
};

export default ActivityPuzzleQuest;
