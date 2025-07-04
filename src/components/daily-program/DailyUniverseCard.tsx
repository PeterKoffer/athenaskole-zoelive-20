
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Target, Rocket } from 'lucide-react';

interface DailyUniverseCardProps {
  onStartUniverse: () => void;
}

const DailyUniverseCard = ({ onStartUniverse }: DailyUniverseCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white border-0 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold mb-2">
          🌟 Today's Learning Universe
        </CardTitle>
        <p className="text-purple-100 text-lg">
          Embark on an integrated 2-3 hour learning adventure!
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <Rocket className="w-4 h-4 mr-2 text-yellow-300" />
            What awaits you today:
          </h3>
          <ul className="text-sm space-y-1 text-purple-100">
            <li>• Interactive storylines with embedded curriculum</li>
            <li>• Mathematics, Science, Language Arts, and more - all integrated</li>
            <li>• Immersive themes like Space Explorer or Time Detective</li>
            <li>• Real learning disguised as epic adventures</li>
          </ul>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-300" />
              <span>2-3 hours</span>
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1 text-green-300" />
              <span>All subjects</span>
            </div>
          </div>
          <Badge className="bg-yellow-500 text-yellow-900">
            New Daily Adventure
          </Badge>
        </div>

        <Button 
          onClick={onStartUniverse}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Enter Today's Universe
        </Button>

        <div className="text-center">
          <p className="text-xs text-purple-200">
            A new universe is generated every day with fresh curriculum integration
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyUniverseCard;
