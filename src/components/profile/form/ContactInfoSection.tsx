
import { Input } from "@/components/ui/input";
import { LearnerProfile } from "@/types/learnerProfile";

interface ContactInfoSectionProps {
  profileData: LearnerProfile;
  onDataChange: (data: Partial<LearnerProfile>) => void;
}

const ContactInfoSection = ({ profileData, onDataChange }: ContactInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-300">Contact Information</h3>
      <div className="space-y-2">
        <label htmlFor="address" className="text-gray-300">Address</label>
        <Input
          id="address"
          type="text"
          value={profileData?.address || ''}
          onChange={(e) => onDataChange({ address: e.target.value })}
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
