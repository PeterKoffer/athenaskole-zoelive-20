
import { useState } from "react";
import { StudentProfile } from "@/types/school";

export const useStudentRegistration = () => {
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Registration data:", profileData);
    alert("Student registration completed successfully!");
  };

  return {
    currentStep,
    profileData,
    handleInputChange,
    handleSubjectToggle,
    handleNext,
    handlePrevious,
    handleSubmit
  };
};
