
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin } from "lucide-react";

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

interface ContactInfoSectionProps {
  profileData: ProfileData;
  onInputChange: (field: keyof ProfileData, value: string) => void;
}

const ContactInfoSection = ({ profileData, onInputChange }: ContactInfoSectionProps) => {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="email" className="text-gray-300 flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={profileData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="your@email.com"
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
          onChange={(e) => onInputChange('address', e.target.value)}
          placeholder="Your address"
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
