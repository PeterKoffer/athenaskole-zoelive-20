
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentProfile } from "@/types/school";

interface ContactInfoStepProps {
  profileData: StudentProfile;
  onInputChange: (section: keyof StudentProfile, field: string, value: string) => void;
}

const ContactInfoStep = ({ profileData, onInputChange }: ContactInfoStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold mb-4">Kontakt Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-300">Email Adresse</Label>
          <Input
            type="email"
            value={profileData.contactInfo.email}
            onChange={(e) => onInputChange('contactInfo', 'email', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="elev@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Telefon Nummer</Label>
          <Input
            value={profileData.contactInfo.phone}
            onChange={(e) => onInputChange('contactInfo', 'phone', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="+45 12 34 56 78"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">Adresse *</Label>
          <Input
            value={profileData.contactInfo.address}
            onChange={(e) => onInputChange('contactInfo', 'address', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Gadenavn og husnummer"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">By *</Label>
          <Input
            value={profileData.contactInfo.city}
            onChange={(e) => onInputChange('contactInfo', 'city', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Aarhus"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Postnummer *</Label>
          <Input
            value={profileData.contactInfo.postalCode}
            onChange={(e) => onInputChange('contactInfo', 'postalCode', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="8000"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Nødkontakt Navn</Label>
          <Input
            value={profileData.contactInfo.emergencyContact}
            onChange={(e) => onInputChange('contactInfo', 'emergencyContact', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="Navn på nødkontakt"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Nødkontakt Telefon</Label>
          <Input
            value={profileData.contactInfo.emergencyPhone}
            onChange={(e) => onInputChange('contactInfo', 'emergencyPhone', e.target.value)}
            className="bg-gray-700 text-white border-gray-600"
            placeholder="+45 12 34 56 78"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
