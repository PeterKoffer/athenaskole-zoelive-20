
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Cpu, 
  Shield, 
  Smartphone, 
  Globe,
  ArrowLeft
} from 'lucide-react';
import EnhancedLessonManager from '../components/EnhancedLessonManager';

const CSSkillAreasGrid = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skillAreas = [
    {
      id: 'programming',
      title: 'Programming Basics',
      description: 'Learn fundamental coding concepts and syntax',
      icon: Code,
      level: 'Beginner',
      color: 'from-blue-500 to-cyan-500',
      skillArea: 'programming-basics'
    },
    {
      id: 'algorithms',
      title: 'Algorithms & Logic',
      description: 'Develop problem-solving and computational thinking skills',
      icon: Cpu,
      level: 'Intermediate',
      color: 'from-purple-500 to-pink-500',
      skillArea: 'algorithms'
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Create websites and web applications',
      icon: Globe,
      level: 'Intermediate',
      color: 'from-green-500 to-teal-500',
      skillArea: 'web-development'
    },
    {
      id: 'databases',
      title: 'Data & Databases',
      description: 'Understand how to store and manage information',
      icon: Database,
      level: 'Advanced',
      color: 'from-orange-500 to-red-500',
      skillArea: 'databases'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Learn about digital safety and security',
      icon: Shield,
      level: 'Advanced',
      color: 'from-red-500 to-pink-500',
      skillArea: 'cybersecurity'
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      description: 'Build apps for smartphones and tablets',
      icon: Smartphone,
      level: 'Advanced',
      color: 'from-indigo-500 to-purple-500',
      skillArea: 'mobile-development'
    }
  ];

  const handleBackToSkills = () => {
    setSelectedSkill(null);
  };

  // Show lesson if skill is selected
  if (selectedSkill) {
    const skill = skillAreas.find(s => s.id === selectedSkill);
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToSkills}
            className="text-white hover:text-lime-400 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Skill Areas
          </Button>
        </div>
        <EnhancedLessonManager
          subject="computer-science"
          skillArea={skill?.skillArea || 'programming-basics'}
          onBackToProgram={handleBackToSkills}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Computer Science Skill Areas</h2>
        <p className="text-gray-400">
          Choose a skill area to start your computer science learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillAreas.map((skill) => {
          const IconComponent = skill.icon;
          
          return (
            <Card key={skill.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${skill.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white">{skill.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{skill.description}</p>
                
                <div className="mb-4">
                  <Badge 
                    variant="outline" 
                    className={`${
                      skill.level === 'Beginner' ? 'text-green-400 border-green-400' :
                      skill.level === 'Intermediate' ? 'text-yellow-400 border-yellow-400' :
                      'text-red-400 border-red-400'
                    }`}
                  >
                    {skill.level}
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => setSelectedSkill(skill.id)}
                  className={`w-full bg-gradient-to-r ${skill.color} hover:opacity-90 text-white`}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CSSkillAreasGrid;
