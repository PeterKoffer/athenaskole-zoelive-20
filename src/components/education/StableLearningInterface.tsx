
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Microscope, Globe, Palette, Music, Brain } from 'lucide-react';
import AdaptiveEducationSession from './AdaptiveEducationSession';

interface Subject {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  skillAreas: string[];
}

const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: <Calculator className="w-8 h-8" />,
    color: 'from-blue-600 to-purple-600',
    skillAreas: ['arithmetic', 'algebra', 'geometry', 'statistics']
  },
  {
    id: 'science',
    name: 'Science',
    icon: <Microscope className="w-8 h-8" />,
    color: 'from-green-600 to-teal-600',
    skillAreas: ['biology', 'chemistry', 'physics', 'earth-science']
  },
  {
    id: 'english',
    name: 'English',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-red-600 to-pink-600',
    skillAreas: ['reading', 'writing', 'grammar', 'vocabulary']
  },
  {
    id: 'social-studies',
    name: 'Social Studies',
    icon: <Globe className="w-8 h-8" />,
    color: 'from-orange-600 to-yellow-600',
    skillAreas: ['history', 'geography', 'civics', 'economics']
  },
  {
    id: 'arts',
    name: 'Arts',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-purple-600 to-pink-600',
    skillAreas: ['drawing', 'painting', 'design', 'creativity']
  },
  {
    id: 'music',
    name: 'Music',
    icon: <Music className="w-8 h-8" />,
    color: 'from-indigo-600 to-blue-600',
    skillAreas: ['rhythm', 'melody', 'harmony', 'composition']
  }
];

interface StableLearningInterfaceProps {
  onBack?: () => void;
}

const StableLearningInterface: React.FC<StableLearningInterfaceProps> = ({ onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSkillArea, setSelectedSkillArea] = useState<string>('');
  const [showAdaptiveSession, setShowAdaptiveSession] = useState(false);
  const [studentName] = useState(() => {
    return localStorage.getItem('studentName') || 'Student';
  });

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedSkillArea('');
    setShowAdaptiveSession(false);
  };

  const handleSkillAreaSelect = (skillArea: string) => {
    setSelectedSkillArea(skillArea);
  };

  const handleStartAdaptiveSession = () => {
    if (selectedSubject && selectedSkillArea) {
      setShowAdaptiveSession(true);
    }
  };

  const handleSessionComplete = () => {
    setShowAdaptiveSession(false);
    setSelectedSubject(null);
    setSelectedSkillArea('');
  };

  const handleBackToSubjects = () => {
    setShowAdaptiveSession(false);
    setSelectedSubject(null);
    setSelectedSkillArea('');
  };

  // Show adaptive learning session
  if (showAdaptiveSession && selectedSubject && selectedSkillArea) {
    return (
      <AdaptiveEducationSession
        subject={selectedSubject.id}
        skillArea={selectedSkillArea}
        studentName={studentName}
        onComplete={handleSessionComplete}
        onBack={handleBackToSubjects}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-purple-300 mr-4" />
            <h1 className="text-4xl font-bold text-white">AI-Powered Adaptive Learning</h1>
          </div>
          <p className="text-xl text-gray-200 mb-2">Welcome, {studentName}!</p>
          <p className="text-lg text-purple-300">Personalized education that adapts to your abilities</p>
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="mt-4 text-white hover:bg-white/10"
            >
              ← Back to Home
            </Button>
          )}
        </div>

        {!selectedSubject ? (
          // Subject Selection
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="bg-black/50 border-gray-600 hover:border-gray-400 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
                onClick={() => handleSubjectSelect(subject)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${subject.color} mb-4`}>
                    {subject.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{subject.name}</h3>
                  <p className="text-gray-300 mb-3">AI-generated content tailored to you</p>
                  <div className="text-sm text-purple-300">
                    <Brain className="w-4 h-4 inline mr-1" />
                    Adaptive Learning
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Skill Area Selection
          <div className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setSelectedSubject(null)}
                variant="ghost"
                className="text-white hover:bg-white/10 mb-4"
              >
                ← Back to Subjects
              </Button>
              <h2 className="text-3xl font-bold text-white mb-2">Choose a {selectedSubject.name} Topic</h2>
              <p className="text-gray-200 mb-4">Our AI will adapt the difficulty to challenge you appropriately</p>
              <div className="flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5 mr-2" />
                <span>Personalized difficulty adjustment • Real-time performance tracking</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {selectedSubject.skillAreas.map((skillArea) => (
                <Card
                  key={skillArea}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedSkillArea === skillArea
                      ? 'bg-blue-600/50 border-blue-400 shadow-lg'
                      : 'bg-black/50 border-gray-600 hover:border-gray-400'
                  }`}
                  onClick={() => handleSkillAreaSelect(skillArea)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-white capitalize mb-2">
                      {skillArea.replace('-', ' ')}
                    </h3>
                    <div className="text-sm text-gray-300 flex items-center justify-center">
                      <Brain className="w-4 h-4 mr-1" />
                      AI-Generated Questions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSkillArea && (
              <div className="text-center mt-8">
                <div className="bg-black/30 rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Adaptive Learning Features</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• AI generates unique questions for your level</li>
                    <li>• Difficulty adjusts based on your performance</li>
                    <li>• Personalized explanations and feedback</li>
                    <li>• Progress tracking and learning analytics</li>
                  </ul>
                </div>
                <Button
                  onClick={handleStartAdaptiveSession}
                  className={`bg-gradient-to-r ${selectedSubject.color} text-white px-8 py-4 text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg`}
                >
                  <Brain className="w-6 h-6 mr-2" />
                  Start Adaptive Learning Session
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StableLearningInterface;
