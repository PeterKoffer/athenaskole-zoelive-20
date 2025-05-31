
import { Card, CardContent } from "@/components/ui/card";
import { StudentProfile } from "@/types/school";
import PersonalInfoStep from "./PersonalInfoStep";
import ContactInfoStep from "./ContactInfoStep";
import AcademicInfoStep from "./AcademicInfoStep";
import ParentInfoStep from "./ParentInfoStep";
import ConfirmationStep from "./ConfirmationStep";
import RegistrationNavigationButtons from "./RegistrationNavigationButtons";

interface StudentRegistrationFormProps {
  currentStep: number;
  profileData: StudentProfile;
  onInputChange: (section: keyof StudentProfile, field: string, value: string) => void;
  onSubjectToggle: (subject: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

const StudentRegistrationForm = ({
  currentStep,
  profileData,
  onInputChange,
  onSubjectToggle,
  onNext,
  onPrevious,
  onSubmit
}: StudentRegistrationFormProps) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            profileData={profileData}
            onInputChange={onInputChange}
          />
        );
      case 1:
        return (
          <ContactInfoStep
            profileData={profileData}
            onInputChange={onInputChange}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            profileData={profileData}
            onInputChange={onInputChange}
            onSubjectToggle={onSubjectToggle}
          />
        );
      case 3:
        return (
          <ParentInfoStep
            profileData={profileData}
            onInputChange={onInputChange}
          />
        );
      case 4:
        return <ConfirmationStep profileData={profileData} />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        {renderStepContent()}
        <RegistrationNavigationButtons
          currentStep={currentStep}
          totalSteps={5}
          onPrevious={onPrevious}
          onNext={onNext}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default StudentRegistrationForm;
