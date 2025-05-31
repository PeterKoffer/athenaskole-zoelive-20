
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RELATIONSHIP_OPTIONS } from "@/constants/school";
import { StudentProfile } from "@/types/school";

interface ParentInfoStepProps {
  profileData: StudentProfile;
  onInputChange: (section: keyof StudentProfile, field: string, value: string) => void;
}

const ParentInfoStep = ({ profileData, onInputChange }: ParentInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold mb-4">Forældre Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Forældre/Værge Navn *</Label>
          <Input
            value={profileData.parentInfo.parentName}
            onChange={(e) => onInputChange('parentInfo', 'parentName', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Fuldt navn"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Relation *</Label>
          <Select 
            value={profileData.parentInfo.relationship} 
            onValueChange={(value) => onInputChange('parentInfo', 'relationship', value)}
          >
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Vælg relation" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Email *</Label>
          <Input
            type="email"
            value={profileData.parentInfo.parentEmail}
            onChange={(e) => onInputChange('parentInfo', 'parentEmail', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="forældre@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Telefon *</Label>
          <Input
            value={profileData.parentInfo.parentPhone}
            onChange={(e) => onInputChange('parentInfo', 'parentPhone', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="+45 12 34 56 78"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Adresse</Label>
          <Input
            value={profileData.parentInfo.parentAddress}
            onChange={(e) => onInputChange('parentInfo', 'parentAddress', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Hvis anderledes end elevens adresse"
          />
        </div>
      </div>
    </div>
  );
};

export default ParentInfoStep;
