
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
      name: 'Adaptive Learning',
      description: 'AI adapts difficulty based on your performance',
      icon: Brain,
      difficulty: 'Adaptive',
      estimatedTime: '10-15 min',
      benefits: ['Personal adaptation', 'Optimal challenge', 'Faster progress']
    },
    {
      id: 'focused',
      name: 'Focused Training',
      description: 'Targeted training in specific skill areas',
      icon: Target,
      difficulty: 'Flexible',
      estimatedTime: '5-10 min',
      benefits: ['Targeted learning', 'Specific skills', 'Quick sessions']
    },
    {
      id: 'challenge',
      name: 'Challenge Mode',
      description: 'Test your limits with advanced problems',
      icon: Zap,
      difficulty: 'High',
      estimatedTime: '15-20 min',
      benefits: ['High difficulty', 'Extreme challenges', 'Maximum learning']
    },
    {
      id: 'mastery',
      name: 'Mastery Mode',
      description: 'Repeat and perfect previously learned topics',
      icon: Award,
      difficulty: 'Repetition',
      estimatedTime: '8-12 min',
      benefits: ['Consolidation', 'Perfection', 'Confidence']
    },
    {
      id: 'group',
      name: 'Group Learning',
      description: 'Learning together with other students',
      icon: Users,
      difficulty: 'Social',
      estimatedTime: '20-30 min',
      benefits: ['Collaboration', 'Social learning', 'Teamwork']
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
              <span>{currentMode?.name || 'Select mode'}</span>
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
