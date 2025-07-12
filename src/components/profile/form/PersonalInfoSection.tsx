
import { Input } from "@/components/ui/input";
import { LearnerProfile } from "@/types/learnerProfile";

interface PersonalInfoSectionProps {
  profileData: LearnerProfile;
  onDataChange: (data: Partial<LearnerProfile>) => void;
}

const PersonalInfoSection = ({ profileData, onDataChange }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="birth_date" className="text-gray-300">Birth Date</label>
          <Input
            id="birth_date"
            type="date"
            value={profileData?.birth_date || ''}
            onChange={(e) => onDataChange({ birth_date: e.target.value })}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="grade" className="text-gray-300">Grade</label>
          <Input
            id="grade"
            type="text"
            value={profileData?.grade || ''}
            onChange={(e) => onDataChange({ grade: e.target.value })}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
