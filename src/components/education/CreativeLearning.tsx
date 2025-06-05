
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Palette, Brush, Scissors, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LearningHeader from './LearningHeader';
import EnhancedLessonManager from './components/EnhancedLessonManager';

const CreativeLearning = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string>('overview');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const handleModeChange = (mode: any) => {
    setSelectedMode(mode.id);
    if (mode.id === 'lesson') {
      setSelectedActivity('creative-arts');
    }
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const handleBackToOverview = () => {
    setSelectedActivity(null);
    setSelectedMode('overview');
  };

  const handleLessonComplete = () => {
    setSelectedActivity(null);
    setSelectedMode('overview');
  };

  const creativeActivities = [
    {
      id: 'drawing-basics',
      title: 'Drawing Basics',
      description: 'Learn fundamental drawing techniques and create beautiful artwork',
      icon: Brush,
      skillArea: 'drawing'
    },
    {
      id: 'color-theory',
      title: 'Color Theory',
      description: 'Explore colors, mixing, and how they work together in art',
      icon: Palette,
      skillArea: 'color-theory'
    },
    {
      id: 'craft-projects',
      title: 'Craft Projects',
      description: 'Create amazing crafts using various materials and techniques',
      icon: Scissors,
      skillArea: 'crafts'
    },
    {
      id: 'digital-art',
      title: 'Digital Art',
      description: 'Create art using digital tools and learn design principles',
      icon: Camera,
      skillArea: 'digital-art'
    }
  ];

  // Show lesson if selected
  if (selectedActivity) {
    return (
      <div className="max-w-6xl mx-auto">
        <EnhancedLessonManager
          subject="creative-arts"
          skillArea={selectedActivity}
          onLessonComplete={handleLessonComplete}
          onBack={handleBackToOverview}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <LearningHeader 
        title="Creative Arts & Design"
        backTo="/daily-program"
        backLabel="Back to Program"
        onModeChange={handleModeChange}
        currentMode={selectedMode}
      />
      
      <div className="p-6">
        {selectedMode === 'lesson' ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-900 to-purple-900 border-pink-400 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🎨 Welcome to Creative Arts Class!</h2>
              <p className="text-white font-medium">
                Welcome to our creative studio! Today we'll explore art, design, and imagination. 
                We'll create beautiful artwork, learn about colors and shapes, and express ourselves through creative projects!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-900 to-purple-900 border-pink-400 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🎨 Creative Arts & Design</h2>
              <p className="text-white font-medium">
                Express your creativity through art, design, and hands-on projects. 
                Learn about colors, shapes, and various artistic techniques!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creativeActivities.map((activity) => {
                const IconComponent = activity.icon;
                
                return (
                  <Card key={activity.id} className="bg-gray-800 border-gray-700 hover:border-pink-500 transition-all duration-300 h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center space-x-3 mb-4">
                        <IconComponent className="w-8 h-8 text-pink-400" />
                        <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                      </div>
                      
                      <p className="text-gray-300 mb-6 flex-grow">{activity.description}</p>
                      
                      <div className="mt-auto">
                        <Button 
                          onClick={() => handleActivitySelect(activity.skillArea)}
                          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                        >
                          Start Creating
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeLearning;
