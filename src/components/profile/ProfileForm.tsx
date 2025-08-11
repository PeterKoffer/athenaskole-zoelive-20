
import { LearnerProfile } from "@/types/learnerProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProfileFormProps {
  profileData: LearnerProfile;
  loading: boolean;
  onDataChange: (data: Partial<LearnerProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({ profileData, loading, onDataChange, onSubmit }: ProfileFormProps) => {
  const handleInterestChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newInterests = [...(profileData.interests || []), e.currentTarget.value];
      onDataChange({ interests: newInterests });
      e.currentTarget.value = '';
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const newInterests = (profileData.interests || []).filter(interest => interest !== interestToRemove);
    onDataChange({ interests: newInterests });
  };

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
            <label htmlFor="gradeLevel" className="text-gray-300">Grade Level</label>
            <Input
              id="gradeLevel"
              type="number"
              value={profileData?.gradeLevel || ''}
              onChange={(e) => onDataChange({ gradeLevel: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="learningStyle" className="text-gray-300">Learning Style</label>
            <Select onValueChange={(value) => onDataChange({ learningStyle: value as any })} value={profileData.learningStyle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Learning Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditory</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="interests" className="text-gray-300">Interests</label>
            <Input
              id="interests"
              type="text"
              onKeyDown={handleInterestChange}
              placeholder="Type an interest and press Enter"
              className="bg-gray-700 text-white border-gray-600"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {(profileData.interests || []).map(interest => (
                <Badge key={interest} variant="secondary" className="flex items-center">
                  {interest}
                  <button onClick={() => removeInterest(interest)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
    </form>
  );
};

export default ProfileForm;
