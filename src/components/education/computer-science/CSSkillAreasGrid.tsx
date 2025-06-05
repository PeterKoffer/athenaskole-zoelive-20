
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Cpu, Shield, Globe, Database, Brain, Zap, Binary } from 'lucide-react';
import EnhancedLessonManager from '../components/EnhancedLessonManager';

const skillAreas = [
  {
    id: 'programming-basics',
    title: 'Programming Basics',
    description: 'Learn fundamental coding concepts through interactive challenges',
    icon: Code,
    games: ['Robot Programming Challenge', 'Web Design Studio'],
    gameCount: 2,
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'algorithms-logic',
    title: 'Algorithms & Logic',
    description: 'Master problem-solving with algorithmic thinking',
    icon: Cpu,
    games: ['Algorithm Puzzle Palace', 'Logic Gate Laboratory'],
    gameCount: 2,
    badgeColor: 'bg-green-500'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Protect digital systems and learn online safety',
    icon: Shield,
    games: ['Cybersecurity Defender'],
    gameCount: 1,
    badgeColor: 'bg-red-500'
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Create websites and learn design principles',
    icon: Globe,
    games: ['Web Design Studio'],
    gameCount: 1,
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'digital-systems',
    title: 'Digital Systems',
    description: 'Understand how computers work at the hardware level',
    icon: Zap,
    games: ['Logic Gate Laboratory', 'Binary Adventure Quest'],
    gameCount: 2,
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Organize and manage information efficiently',
    icon: Database,
    games: ['Data Structure Builder'],
    gameCount: 1,
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    description: 'Explore artificial intelligence and pattern recognition',
    icon: Brain,
    games: ['AI Pattern Detective'],
    gameCount: 1,
    badgeColor: 'bg-pink-500'
  },
  {
    id: 'binary-number-systems',
    title: 'Binary & Number Systems',
    description: 'Understand how computers represent and process data',
    icon: Binary,
    games: ['Binary Adventure Quest'],
    gameCount: 1,
    badgeColor: 'bg-orange-500'
  }
];

const CSSkillAreasGrid = () => {
  const [selectedSkillArea, setSelectedSkillArea] = useState<string | null>(null);

  const handleExploreArea = (skillAreaId: string) => {
    console.log('🎯 Starting lesson for skill area:', skillAreaId);
    setSelectedSkillArea(skillAreaId);
  };

  const handleBackToGrid = () => {
    setSelectedSkillArea(null);
  };

  const handleLessonComplete = () => {
    console.log('🎉 Lesson completed!');
    setSelectedSkillArea(null);
  };

  // If a skill area is selected, show the lesson
  if (selectedSkillArea) {
    return (
      <EnhancedLessonManager
        subject="computer-science"
        skillArea={selectedSkillArea}
        onLessonComplete={handleLessonComplete}
        onBack={handleBackToGrid}
      />
    );
  }

  // Show the skill areas grid
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">🖥️ Explore the Digital World</h3>
      <p className="text-gray-300 mb-6">
        Dive into programming, algorithms, AI, and computer science concepts through interactive games and challenges designed to build critical computational thinking skills.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skillAreas.map((area) => {
          const IconComponent = area.icon;
          
          return (
            <Card key={area.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className="w-6 h-6 text-purple-400" />
                  <Badge className={`${area.badgeColor} text-white`}>
                    {area.gameCount} game{area.gameCount !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <h4 className="text-white font-semibold mb-2">{area.title}</h4>
                <p className="text-gray-400 text-sm mb-3">{area.description}</p>
                
                <div className="space-y-2 mb-4">
                  {area.games.slice(0, 2).map((game, index) => (
                    <div key={index} className="text-xs text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                      {game}
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleExploreArea(area.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Explore Area
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
