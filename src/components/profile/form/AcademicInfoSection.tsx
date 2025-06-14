
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";
import { ProfileData } from "../hooks/types";

interface AcademicInfoSectionProps {
  profileData: ProfileData;
  onInputChange: (field: keyof ProfileData, value: string) => void;
}

const AcademicInfoSection = ({ profileData, onInputChange }: AcademicInfoSectionProps) => {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="grade" className="text-gray-300">Grade</Label>
        <Input
          id="grade"
          value={profileData.grade}
          onChange={(e) => onInputChange('grade', e.target.value)}
          placeholder="e.g. 5th grade"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="school" className="text-gray-300 flex items-center">
          <School className="w-4 h-4 mr-2" />
          School
        </Label>
        <Input
          id="school"
          value={profileData.school}
          onChange={(e) => onInputChange('school', e.target.value)}
          placeholder="Your school name"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>
    </>
  );
};

export default AcademicInfoSection;
