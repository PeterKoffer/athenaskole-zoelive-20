
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface GameFiltersProps {
  selectedSubject: string;
  selectedGrade: string;
  selectedDifficulty: string;
  subjects: string[];
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
}

const GameFilters = ({
  selectedSubject,
  selectedGrade,
  selectedDifficulty,
  subjects,
  onSubjectChange,
  onGradeChange,
  onDifficultyChange
}: GameFiltersProps) => (
  <div className="mb-4 flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-lg">
    <Filter className="w-5 h-5 text-gray-400" />
    
    <Select value={selectedSubject} onValueChange={onSubjectChange}>
      <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        {subjects.map(subject => (
          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={selectedGrade} onValueChange={onGradeChange}>
      <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600">
        <SelectValue placeholder="Grade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Grades</SelectItem>
        {[1,2,3,4,5,6,7,8].map(grade => (
          <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
      <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Levels</SelectItem>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default GameFilters;
