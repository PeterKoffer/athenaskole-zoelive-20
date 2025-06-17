
interface StableQuizQuestionProps {
  question: string;
}

export const StableQuizQuestion = ({ question }: StableQuizQuestionProps) => {
  return (
    <div className="bg-slate-800/90 rounded-lg p-6 border-2 border-blue-400/50">
      <p className="text-white text-xl leading-relaxed font-semibold">{question}</p>
    </div>
  );
};
