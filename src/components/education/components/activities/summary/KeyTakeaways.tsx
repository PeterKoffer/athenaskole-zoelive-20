
import { CheckCircle } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: string[];
}

const KeyTakeaways = ({ takeaways }: KeyTakeawaysProps) => {
  const defaultTakeaways = [
    "Animals live in habitats that provide food, water, shelter, and space",
    "Plants need sunlight, water, air, and nutrients to grow", 
    "The water cycle moves water between oceans, sky, and land",
    "Living things have special adaptations for their environment",
    "Scientists learn by observing the natural world carefully"
  ];

  return (
    <div className="bg-emerald-800/30 rounded-lg p-4 sm:p-6">
      <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-4">🎯 Key Takeaways</h4>
      <ul className="space-y-3">
        {(takeaways.length > 0 ? takeaways : defaultTakeaways).map((takeaway: string, index: number) => (
          <li key={index} className="flex items-start space-x-3 text-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyTakeaways;
