
import { CardContent } from "@/components/ui/card";
import { SpeakableCard } from "@/components/ui/speakable-card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex h-56">
      <SpeakableCard
        speakText={`${subject.title}. ${subject.description}. Key Areas: ${subject.keyAreas.join(', ')}`}
        context={`subject-card-${index}`}
        className="border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 backdrop-blur-sm w-full flex bg-gray-800/70"
      >
        <CardContent className="p-6 flex flex-col h-full w-full relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <span className="text-4xl mb-3 filter drop-shadow-lg" style={{
                textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {subject.icon}
              </span>
              <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                {subject.title}
              </h3>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400 hover:text-white transition-colors p-1">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-80 bg-gray-800 border-gray-700 text-white p-4 z-50"
                align="end"
                side="bottom"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Key Areas:
                    </h4>
                    <ul className="space-y-1">
                      {subject.keyAreas.map((area, areaIndex) => (
                        <li key={areaIndex} className="flex items-center text-sm text-gray-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-grow"></div>

          <Button
            onClick={() => onStartLearning(subject.path)}
            className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 transition-opacity text-sm py-3 font-semibold`}
          >
            Start Learning
          </Button>
        </CardContent>
      </SpeakableCard>
    </div>
  );
};

export default SubjectCard;
