
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
        className="bg-white/90 backdrop-blur-sm rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] transition-all duration-300 hover:scale-[1.02] border-0"
      >
        <CardContent className="p-0 flex flex-col items-center text-center space-y-6">
          {/* Icon Container */}
          <div className={`w-20 h-20 rounded-[20px] ${subject.gradient} flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20 rounded-[20px]"></div>
            <span className="text-3xl relative z-10" style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {subject.icon}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 leading-tight">
            {subject.title}
          </h3>

          {/* Start Learning Button */}
          <Button
            onClick={() => onStartLearning(subject.path)}
            className={`w-full h-12 ${subject.gradient} hover:opacity-90 transition-all duration-200 rounded-2xl font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.98] border-0`}
          >
            Start Learning!
          </Button>
        </CardContent>
      </SpeakableCard>
    </div>
  );
};

export default SubjectCard;
