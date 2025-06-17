
import { SpeakableCard } from '@/components/ui/speakable-card';

interface StableQuizQuestionProps {
  question: string;
}

export const StableQuizQuestion = ({ question }: StableQuizQuestionProps) => {
  return (
    <SpeakableCard
      speakText={question}
      context="quiz-question"
      className="bg-slate-800/90 rounded-lg border-2 border-blue-400/50"
    >
      <div className="p-6">
        <p className="text-white text-xl leading-relaxed font-semibold">{question}</p>
      </div>
    </SpeakableCard>
  );
};
