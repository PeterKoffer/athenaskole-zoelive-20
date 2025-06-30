
import { memo } from 'react';
import TextExplanationRenderer from './atoms/TextExplanationRenderer';
import StableMultipleChoiceRenderer from './atoms/StableMultipleChoiceRenderer';
import InteractiveExerciseRenderer from './atoms/InteractiveExerciseRenderer';
import FallbackRenderer from './atoms/FallbackRenderer';

interface ContentAtomRendererProps {
  atom: any;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const ContentAtomRenderer = memo(({ atom, onComplete }: ContentAtomRendererProps) => {
  if (!atom) {
    console.error('❌ ContentAtomRenderer: No atom provided');
    return <FallbackRenderer atom={null} onComplete={onComplete} />;
  }

  console.log('🎯 ContentAtomRenderer routing atom:', {
    atomId: atom.atom_id,
    atomType: atom.atom_type,
    hasContent: !!atom.content,
    contentKeys: atom.content ? Object.keys(atom.content) : []
  });

  // Route to appropriate renderer based on atom type
  switch (atom.atom_type) {
    case 'TEXT_EXPLANATION':
      return (
        <TextExplanationRenderer 
          content={atom.content || {}} 
          atomId={atom.atom_id} 
          onComplete={onComplete} 
        />
      );
    
    case 'QUESTION_MULTIPLE_CHOICE':
      return <StableMultipleChoiceRenderer atom={atom} onComplete={onComplete} />;
    
    case 'INTERACTIVE_EXERCISE':
      return (
        <InteractiveExerciseRenderer 
          content={atom.content || {}} 
          atomId={atom.atom_id} 
          onComplete={onComplete} 
        />
      );
    
    default:
      console.warn('⚠️ Unknown atom type:', atom.atom_type);
      return <FallbackRenderer atom={atom} onComplete={onComplete} />;
  }
});

ContentAtomRenderer.displayName = 'ContentAtomRenderer';

export default ContentAtomRenderer;
