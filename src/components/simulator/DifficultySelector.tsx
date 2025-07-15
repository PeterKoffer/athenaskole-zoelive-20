import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DifficultySelectorProps {
  onDifficultyChange: (difficulty: number) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onDifficultyChange }) => {
  return (
    <Select onValueChange={(value) => onDifficultyChange(parseInt(value))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Easy</SelectItem>
        <SelectItem value="2">Medium</SelectItem>
        <SelectItem value="3">Hard</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DifficultySelector;
