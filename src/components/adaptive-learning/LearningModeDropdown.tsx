
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Target, Zap, Award, Users } from 'lucide-react';

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

interface LearningModeDropdownProps {
  selectedMode: string;
  onModeChange: (mode: LearningMode) => void;
  className?: string;
}

const LearningModeDropdown = ({ selectedMode, onModeChange, className }: LearningModeDropdownProps) => {
  const learningModes: LearningMode[] = [
    {
      id: 'adaptive',
      name: 'Adaptiv Læring',
      description: 'AI tilpasser sværhedsgraden baseret på din præstation',
      icon: Brain,
      difficulty: 'Tilpasset',
      estimatedTime: '10-15 min',
      benefits: ['Personlig tilpasning', 'Optimal udfordring', 'Hurtigere fremgang']
    },
    {
      id: 'focused',
      name: 'Fokuseret Træning',
      description: 'Målrettet træning inden for specifikke færdighedsområder',
      icon: Target,
      difficulty: 'Valgfri',
      estimatedTime: '5-10 min',
      benefits: ['Målrettet læring', 'Specifikke færdigheder', 'Hurtige sessioner']
    },
    {
      id: 'challenge',
      name: 'Udfordrings Mode',
      description: 'Test dine grænser med avancerede problemer',
      icon: Zap,
      difficulty: 'Høj',
      estimatedTime: '15-20 min',
      benefits: ['Høj sværhedsgrad', 'Ekstreme udfordringer', 'Maksimal læring']
    },
    {
      id: 'mastery',
      name: 'Mestring Mode',
      description: 'Gentag og perfektioner tidligere lærte emner',
      icon: Award,
      difficulty: 'Gentagelse',
      estimatedTime: '8-12 min',
      benefits: ['Konsolidering', 'Perfektion', 'Selvtillid']
    },
    {
      id: 'group',
      name: 'Gruppe Læring',
      description: 'Læring sammen med andre elever',
      icon: Users,
      difficulty: 'Social',
      estimatedTime: '20-30 min',
      benefits: ['Samarbejde', 'Social læring', 'Teamwork']
    }
  ];

  const handleModeChange = (modeId: string) => {
    const mode = learningModes.find(m => m.id === modeId);
    if (mode) {
      onModeChange(mode);
    }
  };

  const currentMode = learningModes.find(m => m.id === selectedMode);

  return (
    <div className={className}>
      <Select value={selectedMode} onValueChange={handleModeChange}>
        <SelectTrigger className="bg-gray-800 border-gray-600 text-white min-w-[200px]">
          <SelectValue>
            <div className="flex items-center space-x-2">
              {currentMode?.icon && <currentMode.icon className="w-4 h-4" />}
              <span>{currentMode?.name || 'Vælg mode'}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-600">
          {learningModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <SelectItem 
                key={mode.id} 
                value={mode.id}
                className="text-white hover:bg-gray-700 focus:bg-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-xs text-gray-400">{mode.estimatedTime}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LearningModeDropdown;
