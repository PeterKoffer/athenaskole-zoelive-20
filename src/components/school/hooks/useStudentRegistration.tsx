
import { useState } from "react";
import { StudentProfile } from "@/types/school";

export const useStudentRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  // Added fields for classId (top-level) and currentStepId (inside academicInfo)
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
      notes: "",
      currentStepId: "" // NEW: curriculum step
    },
    parentInfo: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      parentAddress: "",
      relationship: ""
    },
    classId: "", // NEW: class assignment (top-level)
  });

  // Handle updates for the new fields
  const handleInputChange = (section: keyof StudentProfile, field: string, value: string) => {
    if (section === "classId") {
      setProfileData(prev => ({
        ...prev,
        classId: value
      }));
    } else if (section === "academicInfo" && field === "currentStepId") {
      setProfileData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          currentStepId: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
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
    console.log("Registration data with class/step:", profileData);
    alert(`Student registration completed!
    Class: ${profileData.classId || "-"}
    Curriculum Step: ${profileData.academicInfo.currentStepId || "-"}
    `);
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
