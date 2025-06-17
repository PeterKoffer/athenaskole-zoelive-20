
interface StableQuizBattleContextProps {
  battleScenario?: string;
}

export const StableQuizBattleContext = ({ battleScenario }: StableQuizBattleContextProps) => {
  if (!battleScenario) return null;

  return (
    <div className="bg-purple-900/50 border border-purple-400 rounded-lg p-6 text-center">
      <p className="text-purple-200 font-medium text-xl">{battleScenario}</p>
    </div>
  );
};
