
import { StudentProfile } from "@/types/studentProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormProps {
  profileData: StudentProfile;
  loading: boolean;
  onDataChange: (data: Partial<StudentProfile>) => void;
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
            <Select onValueChange={(value) => onDataChange({ learningStyle: value as any })}>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
    </form>
  );
};

export default ProfileForm;
