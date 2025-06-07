
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Brain, ArrowRight } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityIntroductionProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  isNelieReady: boolean;
}

const ActivityIntroduction = ({ activity, timeRemaining, onContinue, isNelieReady }: ActivityIntroductionProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTextComplete, setIsTextComplete] = useState(false);

  const sections = [
    { icon: Lightbulb, content: activity.content.hook, title: "Real-World Connection" },
    { icon: Brain, content: activity.content.realWorldExample, title: "Why This Matters" },
    { icon: ArrowRight, content: activity.content.thoughtQuestion, title: "Think About This" }
  ].filter(section => section.content);

  useEffect(() => {
    if (sections.length === 0) return;

    const sectionDuration = activity.duration / sections.length;
    const timer = setTimeout(() => {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        setIsTextComplete(false);
      } else {
        setIsTextComplete(true);
      }
    }, sectionDuration * 1000);

    return () => clearTimeout(timer);
  }, [currentSection, sections.length, activity.duration]);

  useEffect(() => {
    setCurrentSection(0);
    setIsTextComplete(false);
  }, [activity.id]);

  const currentSectionData = sections[currentSection];
  const IconComponent = currentSectionData?.icon || Lightbulb;

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <IconComponent className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">{activity.title}</h2>
        <p className="text-purple-200 mb-6">{activity.phaseDescription}</p>
        
        <div className="text-xl text-purple-100 mb-6 leading-relaxed min-h-[8rem] flex items-center justify-center">
          <div className="max-w-3xl">
            {currentSectionData && (
              <div className="animate-fade-in">
                <h3 className="text-yellow-300 font-semibold mb-3">{currentSectionData.title}</h3>
                <p className="leading-relaxed">{currentSectionData.content}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Phase Progress Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index <= currentSection ? 'bg-yellow-400' : 'bg-purple-600'
              }`}
            />
          ))}
        </div>
        
        {isNelieReady && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300">Nelie is excited to guide your learning journey...</span>
          </div>
        )}
        
        <div className="text-purple-300 mb-6">
          Phase 1 of 6 • {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
        </div>

        {(isTextComplete || currentSection === sections.length - 1) && (
          <Button
            onClick={onContinue}
            className="bg-green-600 hover:bg-green-700 text-white transition-colors font-semibold px-8 py-3 text-lg animate-fade-in"
          >
            Let's Start Learning! <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityIntroduction;
