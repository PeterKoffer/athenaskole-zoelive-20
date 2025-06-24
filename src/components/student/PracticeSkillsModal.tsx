
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, BookOpen, Globe, Music, Code, Brain, Languages, ScrollText, Map, HeartPulse, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PracticeSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PracticeSkillsModal = ({ isOpen, onClose }: PracticeSkillsModalProps) => {
  const navigate = useNavigate();

  const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: Calculator, route: '/learn/mathematics', color: 'text-green-400' },
    { id: 'english', name: 'English', icon: BookOpen, route: '/learn/english', color: 'text-orange-400' },
    { id: 'science', name: 'Science', icon: Globe, route: '/learn/science', color: 'text-blue-400' },
    { id: 'computer-science', name: 'Computer Science', icon: Code, route: '/learn/computer-science', color: 'text-purple-400' },
    { id: 'music', name: 'Music', icon: Music, route: '/learn/music', color: 'text-pink-400' },
    { id: 'mental-wellness', name: 'Mental Wellness', icon: Brain, route: '/learn/mental-wellness', color: 'text-cyan-400' },
    { id: 'language-lab', name: 'Language Lab', icon: Languages, route: '/learn/language-lab', color: 'text-yellow-400' },
    { id: 'world-history', name: 'World History & Religions', icon: ScrollText, route: '/learn/world-history-religions', color: 'text-amber-400' },
    { id: 'geography', name: 'Global Geography', icon: Map, route: '/learn/global-geography', color: 'text-emerald-400' },
    { id: 'body-lab', name: 'BodyLab: Healthy Living', icon: HeartPulse, route: '/learn/body-lab', color: 'text-red-400' },
    { id: 'life-essentials', name: 'Life Essentials', icon: ClipboardCheck, route: '/learn/life-essentials', color: 'text-indigo-400' }
  ];

  const handleSubjectSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl text-center mb-4">
            Choose Your Practice Subject
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card 
                key={subject.id} 
                className="bg-gray-700 border-gray-600 hover:border-purple-400 transition-all cursor-pointer hover:scale-105"
                onClick={() => handleSubjectSelect(subject.route)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center space-x-2 text-white text-sm">
                    <IconComponent className={`w-6 h-6 ${subject.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <h3 className="text-white text-center font-semibold text-sm">{subject.name}</h3>
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white text-xs"
                    size="sm"
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeSkillsModal;
