
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, BookOpen, Globe, Music, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface SubjectSelectorProps {
  onSubjectSelect?: (subject: string, skillArea: string) => void;
  selectedMode?: any;
  currentSubject?: string;
  onSubjectChange?: (subject: string) => void;
  onLanguageSelect?: () => void;
}

const SubjectSelector = ({ onSubjectSelect, selectedMode, currentSubject, onSubjectChange, onLanguageSelect }: SubjectSelectorProps) => {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      skillAreas: [
        { id: 'fractions', name: 'Fractions', description: 'Adding, subtracting, and working with fractions', route: '/learn/mathematics' },
        { id: 'arithmetic', name: 'Arithmetic', description: 'Basic math operations and number sense', route: '/learn/mathematics' },
        { id: 'geometry', name: 'Geometry', description: 'Shapes, angles, and spatial reasoning', route: '/learn/mathematics' },
        { id: 'algebra', name: 'Algebra', description: 'Variables, equations, and problem solving', route: '/learn/mathematics' }
      ]
    },
    {
      id: 'english',
      name: 'English',
      icon: BookOpen,
      skillAreas: [
        { id: 'spelling', name: 'Spelling', description: 'Word recognition and spelling patterns', route: '/learn/english' },
        { id: 'grammar', name: 'Grammar', description: 'Sentence structure and language rules', route: '/learn/english' },
        { id: 'reading', name: 'Reading', description: 'Comprehension and vocabulary building', route: '/learn/english' },
        { id: 'writing', name: 'Writing', description: 'Expression and communication skills', route: '/learn/english' }
      ]
    },
    {
      id: 'computer-science',
      name: 'Computer Science',
      icon: Code,
      skillAreas: [
        { id: 'programming', name: 'Programming', description: 'Basic coding concepts and logical thinking', route: '/learn/computer-science' },
        { id: 'algorithms', name: 'Algorithms', description: 'Problem-solving and computational thinking', route: '/learn/computer-science' },
        { id: 'ai-basics', name: 'AI Basics', description: 'Introduction to artificial intelligence concepts', route: '/learn/computer-science' },
        { id: 'data-structures', name: 'Data Structures', description: 'Organizing and managing information', route: '/learn/computer-science' }
      ]
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      skillAreas: [
        { id: 'music_theory', name: 'Music Theory', description: 'Understanding rhythm, melody, and harmony', route: '/learn/music' },
        { id: 'rhythm', name: 'Rhythm', description: 'Beat patterns and timing in music', route: '/learn/music' },
        { id: 'melody', name: 'Melody', description: 'Musical phrases and note sequences', route: '/learn/music' },
        { id: 'instruments', name: 'Instruments', description: 'Learning about different musical instruments', route: '/learn/music' }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      icon: Globe,
      skillAreas: [
        { id: 'biology', name: 'Biology', description: 'Living organisms and life processes', route: '/learn/science' },
        { id: 'chemistry', name: 'Chemistry', description: 'Matter, atoms, and chemical reactions', route: '/learn/science' },
        { id: 'physics', name: 'Physics', description: 'Energy, motion, and physical laws', route: '/learn/science' },
        { id: 'earth-science', name: 'Earth Science', description: 'Our planet and the environment', route: '/learn/science' }
      ]
    }
  ];

  const handleSubjectSelect = (subject: string, skillArea: string, route: string) => {
    console.log('🚀 Starting AI learning session:', { subject, skillArea, route });
    
    if (onSubjectSelect) {
      onSubjectSelect(subject, skillArea);
    }
    
    // Navigate to the appropriate AI learning route
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Subject</h2>
        <p className="text-gray-400">Select a subject and skill area to begin your AI learning session</p>
        {selectedMode && (
          <Badge className="mt-2 bg-purple-600 text-white">
            {selectedMode.name} Mode
          </Badge>
        )}
      </div>

      <div className="grid gap-6">
        {subjects.map((subject) => {
          const IconComponent = subject.icon;
          
          return (
            <Card key={subject.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <IconComponent className="w-6 h-6 text-lime-400" />
                  <span>{subject.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {subject.skillAreas.map((skillArea) => (
                    <Card key={skillArea.id} className="bg-gray-700 border-gray-600 hover:border-purple-400 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-white">{skillArea.name}</h3>
                          <Brain className="w-4 h-4 text-lime-400" />
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{skillArea.description}</p>
                        <Button 
                          onClick={() => handleSubjectSelect(subject.id, skillArea.id, skillArea.route)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white"
                          size="sm"
                        >
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
