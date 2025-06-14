
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, School, MapPin } from "lucide-react";
import AvatarColorPicker from "./AvatarColorPicker";

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
        <div className="space-y-3">
          <Label htmlFor="name" className="text-gray-300 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Full Name
          </Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-300 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
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
            onChange={(e) => handleInputChange('birth_date', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white focus:border-purple-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="grade" className="text-gray-300">Grade</Label>
          <Input
            id="grade"
            value={profileData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
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
            onChange={(e) => handleInputChange('school', e.target.value)}
            placeholder="Your school name"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="address" className="text-gray-300 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Address
          </Label>
          <Input
            id="address"
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Your address"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>

        <div className="md:col-span-2">
          <AvatarColorPicker
            selectedColor={profileData.avatar_color || "from-purple-400 to-cyan-400"}
            onColorChange={handleColorChange}
            userName={profileData.name}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
