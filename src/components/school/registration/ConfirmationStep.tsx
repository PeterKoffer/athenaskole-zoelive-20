
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentProfile } from "@/types/school";

interface ConfirmationStepProps {
  profileData: StudentProfile;
}

const ConfirmationStep = ({ profileData }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-semibold mb-4">Bekræft Registrering</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Elev Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-300">
              <strong>Navn:</strong> {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
            </p>
            <p className="text-gray-300">
              <strong>Fødselsdato:</strong> {profileData.personalInfo.birthDate}
            </p>
            <p className="text-gray-300">
              <strong>Klasse:</strong> {profileData.academicInfo.grade}
            </p>
            <p className="text-gray-300">
              <strong>Email:</strong> {profileData.contactInfo.email}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Forældre Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-300">
              <strong>Navn:</strong> {profileData.parentInfo.parentName}
            </p>
            <p className="text-gray-300">
              <strong>Relation:</strong> {profileData.parentInfo.relationship}
            </p>
            <p className="text-gray-300">
              <strong>Email:</strong> {profileData.parentInfo.parentEmail}
            </p>
            <p className="text-gray-300">
              <strong>Telefon:</strong> {profileData.parentInfo.parentPhone}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
        <p className="text-yellow-300">
          <strong>Bemærk:</strong> Når du klikker "Registrer Elev", vil alle oplysninger blive gemt, 
          og eleven vil blive tilføjet til systemet. Sørg for at alle oplysninger er korrekte.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
