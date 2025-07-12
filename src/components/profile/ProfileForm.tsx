
import AvatarColorPicker from "./AvatarColorPicker";
import PersonalInfoSection from "./form/PersonalInfoSection";
import ContactInfoSection from "./form/ContactInfoSection";
import AcademicInfoSection from "./form/AcademicInfoSection";
import ProfileFormActions from "./form/ProfileFormActions";
import { LearnerProfile } from "@/types/learnerProfile";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  profileData: LearnerProfile;
  loading: boolean;
  onDataChange: (data: Partial<LearnerProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({ profileData, loading, onDataChange, onSubmit }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8 mt-6">
       <div className="space-y-2">
            <label htmlFor="name" className="text-gray-300">Name</label>
            <Input
              id="name"
              type="text"
              value={profileData?.name || ''}
              onChange={(e) => onDataChange({ name: e.target.value })}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-300">Email</label>
            <Input
              id="email"
              type="email"
              value={profileData?.email || ''}
              disabled
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>

      <ProfileFormActions loading={loading} />
    </form>
  );
};

export default ProfileForm;
