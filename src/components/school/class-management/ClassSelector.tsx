
import { Button } from "@/components/ui/button";
import { Class } from "@/types/school";

interface ClassSelectorProps {
  classes: Class[];
  selectedClass: string;
  onClassSelect: (classId: string) => void;
}

const ClassSelector = ({ classes, selectedClass, onClassSelect }: ClassSelectorProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-3">
      {classes.map((cls) => (
        <Button
          key={cls.id}
          variant={selectedClass === cls.id ? "default" : "outline"}
          onClick={() => onClassSelect(cls.id)}
          className={`p-4 h-auto flex flex-col items-start ${
            selectedClass === cls.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 border-gray-600 hover:bg-gray-600'
          }`}
        >
          <span className="font-semibold">{cls.name}</span>
          <span className="text-sm opacity-75">{cls.students.length}/{cls.capacity} elever</span>
          <span className="text-xs opacity-60">{cls.teacher}</span>
        </Button>
      ))}
    </div>
  );
};

export default ClassSelector;
