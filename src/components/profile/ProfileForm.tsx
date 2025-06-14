
import AvatarColorPicker from "./AvatarColorPicker";
import PersonalInfoSection from "./form/PersonalInfoSection";
import ContactInfoSection from "./form/ContactInfoSection";
import AcademicInfoSection from "./form/AcademicInfoSection";
import ProfileFormActions from "./form/ProfileFormActions";

interface ProfileData {
  name: string;
  email: string;
  birth_date: string;
  grade: string;
  school: string;
  address: string;
  avatar_url: string;
  avatar_color?: string;
}

interface ProfileFormProps {
  profileData: ProfileData;
  loading: boolean;
  onDataChange: (data: ProfileData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({ profileData, loading, onDataChange, onSubmit }: ProfileFormProps) => {
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    onDataChange({ ...profileData, [field]: value });
  };

  const handleColorChange = (color: string) => {
    onDataChange({ ...profileData, avatar_color: color });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <PersonalInfoSection 
          profileData={profileData}
          onInputChange={handleInputChange}
        />
        
        <ContactInfoSection 
          profileData={profileData}
          onInputChange={handleInputChange}
        />
        
        <AcademicInfoSection 
          profileData={profileData}
          onInputChange={handleInputChange}
        />

        <div className="md:col-span-2">
          <AvatarColorPicker
            selectedColor={profileData.avatar_color || "from-purple-400 to-cyan-400"}
            onColorChange={handleColorChange}
            userName={profileData.name}
          />
        </div>
      </div>

      <ProfileFormActions loading={loading} />
    </form>
  );
};

export default ProfileForm;
