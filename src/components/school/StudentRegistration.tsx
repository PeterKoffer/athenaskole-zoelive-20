
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, User, Phone, GraduationCap, Home, CheckCircle } from "lucide-react";
import { StudentProfile, RegistrationStep } from "@/types/school";
import PersonalInfoStep from "./registration/PersonalInfoStep";
import ContactInfoStep from "./registration/ContactInfoStep";
import AcademicInfoStep from "./registration/AcademicInfoStep";
import ParentInfoStep from "./registration/ParentInfoStep";
import ConfirmationStep from "./registration/ConfirmationStep";

const StudentRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<StudentProfile>({
    personalInfo: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      nationality: "",
      idNumber: ""
    },
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      emergencyContact: "",
      emergencyPhone: ""
    },
    academicInfo: {
      grade: "",
      previousSchool: "",
      startDate: "",
      subjects: [],
      specialNeeds: "",
      notes: ""
    },
    parentInfo: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      parentAddress: "",
      relationship: ""
    }
  });

  const steps: RegistrationStep[] = [
    { id: 0, title: "Personlige Oplysninger", icon: User },
    { id: 1, title: "Kontakt Information", icon: Phone },
    { id: 2, title: "Akademiske Oplysninger", icon: GraduationCap },
    { id: 3, title: "Forældre Information", icon: Home },
    { id: 4, title: "Bekræft & Gem", icon: CheckCircle }
  ];

  const handleInputChange = (section: keyof StudentProfile, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setProfileData(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        subjects: prev.academicInfo.subjects.includes(subject)
          ? prev.academicInfo.subjects.filter(s => s !== subject)
          : [...prev.academicInfo.subjects, subject]
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Registrering data:", profileData);
    alert("Elev registrering er fuldført!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            profileData={profileData}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <ContactInfoStep
            profileData={profileData}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            profileData={profileData}
            onInputChange={handleInputChange}
            onSubjectToggle={handleSubjectToggle}
          />
        );
      case 3:
        return (
          <ParentInfoStep
            profileData={profileData}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return <ConfirmationStep profileData={profileData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Save className="w-5 h-5 mr-2" />
            Ny Elev Registrering
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-400'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold">{steps[currentStep].title}</h3>
            <p className="text-gray-400">Trin {currentStep + 1} af {steps.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-gray-300 border-gray-600 hover:bg-gray-600"
            >
              Forrige
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Næste
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Registrer Elev
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRegistration;
