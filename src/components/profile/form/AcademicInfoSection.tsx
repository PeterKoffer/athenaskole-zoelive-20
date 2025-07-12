
import { Input } from "@/components/ui/input";
import { LearnerProfile } from "@/types/learnerProfile";

interface AcademicInfoSectionProps {
  profileData: LearnerProfile;
  onDataChange: (data: Partial<LearnerProfile>) => void;
}

const AcademicInfoSection = ({ profileData, onDataChange }: AcademicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Academic Information</h3>
      <div className="space-y-2">
        <label htmlFor="school" className="text-gray-300">School</label>
        <Input
          id="school"
          type="text"
          value={profileData?.school || ''}
          onChange={(e) => onDataChange({ school: e.target.value })}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
    </div>
  );
};

export default AcademicInfoSection;
