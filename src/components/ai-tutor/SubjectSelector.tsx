
import { Button } from "@/components/ui/button";
import { Calculator, BookOpen, Globe, Atom, Microscope, History } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SubjectSelectorProps {
  currentSubject: string;
  onSubjectChange: (subjectId: string) => void;
  onLanguageSelect: () => void;
}

const SubjectSelector = ({ currentSubject, onSubjectChange, onLanguageSelect }: SubjectSelectorProps) => {
  const subjects: Subject[] = [
    { id: "math", name: "Math", emoji: "🔢", icon: Calculator },
    { id: "english", name: "English", emoji: "📝", icon: BookOpen },
    { id: "science", name: "Science", emoji: "🧪", icon: Atom },
    { id: "foreign-languages", name: "Languages", emoji: "🌍", icon: Globe },
    { id: "social-studies", name: "Social Studies", emoji: "🏛️", icon: History },
    { id: "biology", name: "Biology", emoji: "🔬", icon: Microscope }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
      {subjects.map((subject) => {
        const IconComponent = subject.icon;
        return (
          <Button
            key={subject.id}
            variant={currentSubject === subject.id ? "default" : "outline"}
            className={`flex flex-col space-y-1 h-auto py-3 ${
              currentSubject === subject.id 
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none" 
                : "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-purple-400 text-white"
            }`}
            onClick={() => {
              onSubjectChange(subject.id);
              if (subject.id === "foreign-languages") {
                onLanguageSelect();
              }
            }}
          >
            <IconComponent className="w-4 h-4" />
            <span className="text-xs">{subject.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default SubjectSelector;
