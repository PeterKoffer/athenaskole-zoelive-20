
import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { Button } from "@/components/ui/button";

interface Subject {
  title: string;
  description: string;
  keyAreas: string[];
  path: string;
  gradient: string;
  icon: string;
}

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onStartLearning: (path: string) => void;
}

const SubjectCard = ({ subject, index, onStartLearning }: SubjectCardProps) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <SpeakableCard
        speakText={`${subject.title}. ${subject.description}`}
        context={`subject-card-${index}`}
        className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
      >
        <CardContent className="p-0 flex flex-col items-center text-center space-y-6">
          {/* Speaker Icon - Top Right */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-xs">🔊</span>
          </div>

          {/* Icon Container */}
          <div className="mt-2">
            <div className={`w-20 h-20 rounded-2xl ${subject.gradient} flex items-center justify-center shadow-lg`}>
              <span className="text-3xl">{subject.icon}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 leading-tight px-2 line-clamp-2">
            {subject.title}
          </h3>

          {/* Start Learning Button */}
          <Button
            onClick={() => onStartLearning(subject.path)}
            className={`w-full h-12 ${subject.gradient} hover:opacity-90 transition-all duration-200 rounded-xl font-semibold text-white shadow-md hover:shadow-lg active:scale-[0.98] border-0`}
          >
            Start Learning!
          </Button>
        </CardContent>
      </SpeakableCard>
    </div>
  );
};

export default SubjectCard;
