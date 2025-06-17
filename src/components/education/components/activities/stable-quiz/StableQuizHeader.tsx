
import { Button } from '@/components/ui/button';

interface StableQuizHeaderProps {
  title: string;
  timeLeft: number;
  score: number;
  onToggleMute?: () => void;
}

export const StableQuizHeader = ({ title, timeLeft, score, onToggleMute }: StableQuizHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
        {title}
      </h2>
      <div className="flex items-center space-x-4">
        <div className={`px-4 py-2 rounded-full font-bold ${
          timeLeft > 10 ? 'bg-green-500 text-white' : 
          timeLeft > 5 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
        }`}>
          ⏰ {timeLeft}s
        </div>
        {score > 0 && (
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
            💰 {score} pts
          </div>
        )}
      </div>
    </div>
  );
};
