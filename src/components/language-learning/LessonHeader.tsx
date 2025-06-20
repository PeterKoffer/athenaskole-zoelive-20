
import { BookOpenText } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  currentSectionIndex: number;
  totalSections: number;
}

const LessonHeader = ({ title, currentSectionIndex, totalSections }: LessonHeaderProps) => {
  return (
    <div className="p-5 bg-gray-700/50 rounded-lg border border-gray-600">
      <h2 className="text-2xl font-bold text-lime-400 mb-1 flex items-center">
        <BookOpenText className="w-7 h-7 mr-2 text-purple-400"/> {title}
      </h2>
      <p className="text-sm text-gray-400 mb-4">Section {currentSectionIndex + 1} of {totalSections}</p>
    </div>
  );
};

export default LessonHeader;
