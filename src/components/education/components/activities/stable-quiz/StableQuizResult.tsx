
interface StableQuizResultProps {
  isCorrect: boolean;
  explanation?: string;
}

export const StableQuizResult = ({ isCorrect, explanation }: StableQuizResultProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="text-8xl mb-4">
        {isCorrect ? '🎉' : '💀'}
      </div>
      <div className={`text-3xl font-bold ${
        isCorrect ? 'text-green-400' : 'text-red-400'
      }`}>
        {isCorrect ? 'VICTORY! 🏆' : 'DEFEATED! ⚔️'}
      </div>
      {explanation && (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg">{explanation}</p>
        </div>
      )}
      <div className="text-gray-400 text-lg">
        Next adventure begins in 3 seconds...
      </div>
    </div>
  );
};
