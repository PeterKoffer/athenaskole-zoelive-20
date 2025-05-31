
import RegistrationProgressSteps from "./registration/RegistrationProgressSteps";
import StudentRegistrationForm from "./registration/StudentRegistrationForm";
import { useStudentRegistration } from "./hooks/useStudentRegistration";

const StudentRegistration = () => {
  const {
    currentStep,
    profileData,
    handleInputChange,
    handleSubjectToggle,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useStudentRegistration();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <RegistrationProgressSteps currentStep={currentStep} />
      <StudentRegistrationForm
        currentStep={currentStep}
        profileData={profileData}
        onInputChange={handleInputChange}
        onSubjectToggle={handleSubjectToggle}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default StudentRegistration;
