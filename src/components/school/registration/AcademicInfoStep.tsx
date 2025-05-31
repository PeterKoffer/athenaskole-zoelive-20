
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_SUBJECTS, CLASS_OPTIONS } from "@/constants/school";
import { StudentProfile } from "@/types/school";

interface AcademicInfoStepProps {
  profileData: StudentProfile;
  onInputChange: (section: keyof StudentProfile, field: string, value: string) => void;
  onSubjectToggle: (subject: string) => void;
}

const AcademicInfoStep = ({ profileData, onInputChange, onSubjectToggle }: AcademicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold mb-4">Akademiske Oplysninger</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Klasse *</Label>
          <Select 
            value={profileData.academicInfo.grade} 
            onValueChange={(value) => onInputChange('academicInfo', 'grade', value)}
          >
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Vælg klasse" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Start Dato</Label>
          <Input
            type="date"
            value={profileData.academicInfo.startDate}
            onChange={(e) => onInputChange('academicInfo', 'startDate', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Tidligere Skole</Label>
          <Input
            value={profileData.academicInfo.previousSchool}
            onChange={(e) => onInputChange('academicInfo', 'previousSchool', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Navn på tidligere skole"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Fag (vælg alle relevante)</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {AVAILABLE_SUBJECTS.map((subject) => (
              <Button
                key={subject}
                variant={profileData.academicInfo.subjects.includes(subject) ? "default" : "outline"}
                size="sm"
                onClick={() => onSubjectToggle(subject)}
                className={`text-left justify-start ${
                  profileData.academicInfo.subjects.includes(subject)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Særlige Behov</Label>
          <Input
            value={profileData.academicInfo.specialNeeds}
            onChange={(e) => onInputChange('academicInfo', 'specialNeeds', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Beskriv eventuelle særlige behov"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoStep;
