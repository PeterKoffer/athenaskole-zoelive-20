
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar } from "lucide-react";

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

interface PersonalInfoSectionProps {
  profileData: ProfileData;
  onInputChange: (field: keyof ProfileData, value: string) => void;
}

const PersonalInfoSection = ({ profileData, onInputChange }: PersonalInfoSectionProps) => {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="name" className="text-gray-300 flex items-center">
          <User className="w-4 h-4 mr-2" />
          Full Name
        </Label>
        <Input
          id="name"
          value={profileData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Enter your name"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="birth_date" className="text-gray-300 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Birth Date
        </Label>
        <Input
          id="birth_date"
          type="date"
          value={profileData.birth_date}
          onChange={(e) => onInputChange('birth_date', e.target.value)}
          className="bg-gray-700 border-gray-600 text-white focus:border-purple-400"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;
