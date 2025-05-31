
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENDER_OPTIONS } from "@/constants/school";
import { StudentProfile } from "@/types/school";

interface PersonalInfoStepProps {
  profileData: StudentProfile;
  onInputChange: (section: keyof StudentProfile, field: string, value: string) => void;
}

const PersonalInfoStep = ({ profileData, onInputChange }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold mb-4">Personlige Oplysninger</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Fornavn *</Label>
          <Input
            value={profileData.personalInfo.firstName}
            onChange={(e) => onInputChange('personalInfo', 'firstName', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Indtast fornavn"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Efternavn *</Label>
          <Input
            value={profileData.personalInfo.lastName}
            onChange={(e) => onInputChange('personalInfo', 'lastName', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Indtast efternavn"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Fødselsdato *</Label>
          <Input
            type="date"
            value={profileData.personalInfo.birthDate}
            onChange={(e) => onInputChange('personalInfo', 'birthDate', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Køn</Label>
          <Select 
            value={profileData.personalInfo.gender} 
            onValueChange={(value) => onInputChange('personalInfo', 'gender', value)}
          >
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Vælg køn" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Nationalitet</Label>
          <Input
            value={profileData.personalInfo.nationality}
            onChange={(e) => onInputChange('personalInfo', 'nationality', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Dansk"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">CPR Nummer</Label>
          <Input
            value={profileData.personalInfo.idNumber}
            onChange={(e) => onInputChange('personalInfo', 'idNumber', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="DDMMYY-XXXX"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
