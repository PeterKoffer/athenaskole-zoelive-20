
import { Star } from "lucide-react";

const GameSelectorHeader = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
      <Star className="w-6 h-6 mr-2 text-lime-400" />
      Curriculum-Aligned Educational Games
    </h1>
    <p className="text-gray-400">
      Interactive games designed to match your grade level and learning objectives
    </p>
  </div>
);

export default GameSelectorHeader;
