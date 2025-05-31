
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  User, 
  GraduationCap, 
  Home, 
  Phone, 
  Mail,
  Calendar,
  BookOpen,
  Save,
  Upload,
  CheckCircle
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationality: string;
    idNumber: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  academicInfo: {
    grade: string;
    previousSchool: string;
    startDate: string;
    subjects: string[];
    specialNeeds: string;
    notes: string;
  };
  parentInfo: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    parentAddress: string;
    relationship: string;
  };
}

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

  const steps = [
    { id: 0, title: "Personlige Oplysninger", icon: User },
    { id: 1, title: "Kontakt Information", icon: Phone },
    { id: 2, title: "Akademiske Oplysninger", icon: GraduationCap },
    { id: 3, title: "Forældre Information", icon: Home },
    { id: 4, title: "Bekræft & Gem", icon: CheckCircle }
  ];

  const availableSubjects = [
    "Matematik", "Dansk", "Engelsk", "Naturteknik", "Historie", 
    "Geografi", "Fysik", "Kemi", "Biologi", "Idræt", "Musik", "Kunst"
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
    // Here you would typically send the data to your backend
    alert("Elev registrering er fuldført!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
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
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold mb-4">Personlige Oplysninger</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Fornavn *</Label>
                  <Input
                    value={profileData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Indtast fornavn"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Efternavn *</Label>
                  <Input
                    value={profileData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Indtast efternavn"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Fødselsdato *</Label>
                  <Input
                    type="date"
                    value={profileData.personalInfo.birthDate}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Køn</Label>
                  <Select 
                    value={profileData.personalInfo.gender} 
                    onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Vælg køn" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="male">Mand</SelectItem>
                      <SelectItem value="female">Kvinde</SelectItem>
                      <SelectItem value="other">Andet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Nationalitet</Label>
                  <Input
                    value={profileData.personalInfo.nationality}
                    onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Dansk"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">CPR Nummer</Label>
                  <Input
                    value={profileData.personalInfo.idNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="DDMMYY-XXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold mb-4">Kontakt Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Email Adresse</Label>
                  <Input
                    type="email"
                    value={profileData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="elev@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Telefon Nummer</Label>
                  <Input
                    value={profileData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="+45 12 34 56 78"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Adresse *</Label>
                  <Input
                    value={profileData.contactInfo.address}
                    onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Gadenavn og husnummer"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">By *</Label>
                  <Input
                    value={profileData.contactInfo.city}
                    onChange={(e) => handleInputChange('contactInfo', 'city', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Aarhus"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Postnummer *</Label>
                  <Input
                    value={profileData.contactInfo.postalCode}
                    onChange={(e) => handleInputChange('contactInfo', 'postalCode', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="8000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Nødkontakt Navn</Label>
                  <Input
                    value={profileData.contactInfo.emergencyContact}
                    onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Navn på nødkontakt"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Nødkontakt Telefon</Label>
                  <Input
                    value={profileData.contactInfo.emergencyPhone}
                    onChange={(e) => handleInputChange('contactInfo', 'emergencyPhone', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="+45 12 34 56 78"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold mb-4">Akademiske Oplysninger</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Klasse *</Label>
                  <Select 
                    value={profileData.academicInfo.grade} 
                    onValueChange={(value) => handleInputChange('academicInfo', 'grade', value)}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Vælg klasse" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="1a">1.A</SelectItem>
                      <SelectItem value="1b">1.B</SelectItem>
                      <SelectItem value="2a">2.A</SelectItem>
                      <SelectItem value="2b">2.B</SelectItem>
                      <SelectItem value="3a">3.A</SelectItem>
                      <SelectItem value="3b">3.B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Start Dato</Label>
                  <Input
                    type="date"
                    value={profileData.academicInfo.startDate}
                    onChange={(e) => handleInputChange('academicInfo', 'startDate', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Tidligere Skole</Label>
                  <Input
                    value={profileData.academicInfo.previousSchool}
                    onChange={(e) => handleInputChange('academicInfo', 'previousSchool', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Navn på tidligere skole"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Fag (vælg alle relevante)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availableSubjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={profileData.academicInfo.subjects.includes(subject) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSubjectToggle(subject)}
                        className={`text-left justify-start ${
                          profileData.academicInfo.subjects.includes(subject)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Særlige Behov</Label>
                  <Input
                    value={profileData.academicInfo.specialNeeds}
                    onChange={(e) => handleInputChange('academicInfo', 'specialNeeds', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Beskriv eventuelle særlige behov"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-white text-xl font-semibold mb-4">Forældre Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Forældre/Værge Navn *</Label>
                  <Input
                    value={profileData.parentInfo.parentName}
                    onChange={(e) => handleInputChange('parentInfo', 'parentName', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Fuldt navn"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Relation *</Label>
                  <Select 
                    value={profileData.parentInfo.relationship} 
                    onValueChange={(value) => handleInputChange('parentInfo', 'relationship', value)}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Vælg relation" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="mother">Mor</SelectItem>
                      <SelectItem value="father">Far</SelectItem>
                      <SelectItem value="guardian">Værge</SelectItem>
                      <SelectItem value="other">Andet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    type="email"
                    value={profileData.parentInfo.parentEmail}
                    onChange={(e) => handleInputChange('parentInfo', 'parentEmail', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="forældre@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Telefon *</Label>
                  <Input
                    value={profileData.parentInfo.parentPhone}
                    onChange={(e) => handleInputChange('parentInfo', 'parentPhone', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="+45 12 34 56 78"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">Adresse</Label>
                  <Input
                    value={profileData.parentInfo.parentAddress}
                    onChange={(e) => handleInputChange('parentInfo', 'parentAddress', e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                    placeholder="Hvis anderledes end elevens adresse"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
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
          )}

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
