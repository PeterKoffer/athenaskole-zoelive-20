
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, User, Phone, GraduationCap, Home, CheckCircle } from "lucide-react";
import { RegistrationStep } from "@/types/school";

interface RegistrationProgressStepsProps {
  currentStep: number;
}

const RegistrationProgressSteps = ({ currentStep }: RegistrationProgressStepsProps) => {
  const steps: RegistrationStep[] = [
    { id: 0, title: "Personal Information", icon: User },
    { id: 1, title: "Contact Information", icon: Phone },
    { id: 2, title: "Academic Information", icon: GraduationCap },
    { id: 3, title: "Parent Information", icon: Home },
    { id: 4, title: "Confirm & Save", icon: CheckCircle }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Save className="w-5 h-5 mr-2" />
          New Student Registration
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
          <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationProgressSteps;
