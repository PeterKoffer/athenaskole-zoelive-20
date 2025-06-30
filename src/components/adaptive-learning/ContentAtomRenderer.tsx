
import { ContentAtom } from '@/types/content';
import TextExplanationRenderer from './atoms/TextExplanationRenderer';
import MultipleChoiceRenderer from './atoms/MultipleChoiceRenderer';
import FallbackRenderer from './atoms/FallbackRenderer';

interface ContentAtomRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const ContentAtomRenderer = ({ atom, onComplete }: ContentAtomRendererProps) => {
  console.log('🔍 ContentAtomRenderer atom:', {
    atomId: atom.atom_id,
    atomType: atom.atom_type,
    content: atom.content,
    contentKeys: Object.keys(atom.content || {})
  });

  // Route to appropriate renderer based on atom type
  switch (atom.atom_type) {
    case 'TEXT_EXPLANATION':
      return (
        <TextExplanationRenderer
          content={atom.content as { title?: string; explanation?: string; examples?: string[] }}
          atomId={atom.atom_id}
          onComplete={onComplete}
        />
      );

    case 'QUESTION_MULTIPLE_CHOICE':
      return (
        <MultipleChoiceRenderer
          content={atom.content as {
            question?: string;
            options?: string[];
            correctAnswer?: number;
            correct?: number;
            correctFeedback?: string;
            generalIncorrectFeedback?: string;
            explanation?: string;
          }}
          atomId={atom.atom_id}
          onComplete={onComplete}
        />
      );

    default:
      return <FallbackRenderer atom={atom} onComplete={onComplete} />;
  }
};

export default ContentAtomRenderer;
