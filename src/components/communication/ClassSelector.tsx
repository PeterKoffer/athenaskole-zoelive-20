
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassSelectorProps {
  selectedGrade: string;
  selectedClass: string;
  onGradeChange: (grade: string) => void;
  onClassChange: (cls: string) => void;
  onCreateClassGroup: () => void;
}

const ClassSelector = ({
  selectedGrade,
  selectedClass,
  onGradeChange,
  onClassChange,
  onCreateClassGroup
}: ClassSelectorProps) => {
  // Generate grade options (0-10)
  const gradeOptions = Array.from({ length: 11 }, (_, i) => i.toString());
  
  // Generate class letter options (a-e)
  const classOptions = ['a', 'b', 'c', 'd', 'e'];

  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-4">
      <h4 className="text-white font-medium">Select Specific Class</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Grade (0-10)</label>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent className="bg-gray-600 border-gray-500">
              {gradeOptions.map((grade) => (
                <SelectItem key={grade} value={grade} className="text-white hover:bg-gray-500">
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Class (A-E)</label>
          <Select value={selectedClass} onValueChange={onClassChange}>
            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent className="bg-gray-600 border-gray-500">
              {classOptions.map((cls) => (
                <SelectItem key={cls} value={cls} className="text-white hover:bg-gray-500">
                  Class {cls.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        onClick={onCreateClassGroup}
        disabled={!selectedGrade || !selectedClass}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        Select Class {selectedGrade && selectedClass ? `${selectedGrade}.${selectedClass.toUpperCase()}` : ''}
      </Button>
    </div>
  );
};

export default ClassSelector;
