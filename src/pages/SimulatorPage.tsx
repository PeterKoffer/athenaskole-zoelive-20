
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Calculator, Beaker, PenTool } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextWithSpeaker from "@/components/education/components/shared/TextWithSpeaker";

const SimulatorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSubject = searchParams.get('subject');
  const [activeSubject, setActiveSubject] = useState<string | null>(selectedSubject);

  const handleBackToUniverse = () => {
    navigate('/universe');
  };

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      description: 'Explore algebra, geometry, and problem-solving',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'science',
      name: 'Science',
      icon: Beaker,
      description: 'Discover biology, chemistry, and physics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'literature',
      name: 'Literature',
      icon: BookOpen,
      description: 'Analyze texts and develop writing skills',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const handleSubjectSelect = (subjectId: string) => {
    setActiveSubject(subjectId);
  };

  const handleStartLearning = () => {
    if (activeSubject) {
      // Navigate to the actual educational simulator with the selected subject
      navigate(`/educational-simulator?subject=${activeSubject}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToUniverse}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Daily Universe
          </Button>
          
          <TextWithSpeaker
            text="Learning Simulator. Choose a subject to begin your personalized learning journey."
            context="simulator-header"
            position="inline"
            className="text-center"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Learning Simulator</h1>
              <p className="text-xl text-gray-300">
                Choose a subject to begin your personalized learning journey
              </p>
            </div>
          </TextWithSpeaker>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const isSelected = activeSubject === subject.id;
            
            return (
              <Card 
                key={subject.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'bg-gray-700 border-blue-500 ring-2 ring-blue-500' 
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                } group`}
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <TextWithSpeaker
                    text={`${subject.name}. ${subject.description}`}
                    context={`subject-${subject.id}`}
                    position="corner"
                    showOnHover={true}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div>
                      <CardTitle className="text-white">{subject.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {subject.description}
                      </CardDescription>
                    </div>
                  </TextWithSpeaker>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {activeSubject && (
          <div className="text-center">
            <TextWithSpeaker
              text={`You've selected ${subjects.find(s => s.id === activeSubject)?.name}. Click Start Learning to begin your personalized educational experience.`}
              context="subject-selected"
              position="inline"
              className="mb-4"
            >
              <p className="text-gray-300 mb-4">
                You've selected <span className="text-blue-400 font-semibold">
                  {subjects.find(s => s.id === activeSubject)?.name}
                </span>
              </p>
            </TextWithSpeaker>
            
            <Button 
              onClick={handleStartLearning}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <PenTool className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatorPage;
