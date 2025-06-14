
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Edit3, Lightbulb, Target } from 'lucide-react';
import AskNelieButtons from '../shared/AskNelieButtons';

interface EnglishWritingStrategiesProps {
  studentName: string;
  onComplete: () => void;
}

const EnglishWritingStrategies = ({ studentName, onComplete }: EnglishWritingStrategiesProps) => {
  const strategies = [
    {
      icon: Edit3,
      title: "Show Don't Tell",
      description: "Paint pictures with words instead of just stating facts",
      example: "Instead of 'Sarah was nervous' → 'Sarah's hands trembled as she twisted her hair'",
      color: "from-purple-600 to-blue-600"
    },
    {
      icon: Target,
      title: "Strong Verbs",
      description: "Choose powerful action words that bring your writing to life",
      example: "Instead of 'walked quickly' → 'sprinted', 'dashed', or 'rushed'",
      color: "from-orange-600 to-red-600"
    },
    {
      icon: Lightbulb,
      title: "Vivid Adjectives",
      description: "Use specific, colorful words to help readers see and feel",
      example: "Instead of 'big dog' → 'enormous, fluffy, golden retriever'",
      color: "from-green-600 to-teal-600"
    },
    {
      icon: BookOpen,
      title: "Sensory Details",
      description: "Include what you see, hear, smell, taste, and feel",
      example: "The warm cookies smelled like cinnamon and made my mouth water",
      color: "from-pink-600 to-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-3xl font-bold text-white mb-4">English Writing Strategies</h2>
        <p className="text-xl text-gray-300 mb-6">
          Key Strategies for {studentName}:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => {
          const IconComponent = strategy.icon;
          const strategyContent = `${strategy.title}: ${strategy.description}. ${strategy.example}`;
          
          return (
            <Card key={index} className={`bg-gradient-to-br ${strategy.color} border-none text-white`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <IconComponent className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-semibold">{strategy.title}</h3>
                  </div>
                  <AskNelieButtons 
                    content={strategyContent}
                    context="writing strategy"
                    className="flex-shrink-0"
                  />
                </div>
                
                <p className="text-white/90 mb-3 leading-relaxed">
                  {strategy.description}
                </p>
                
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm font-medium text-white/95">
                    Example: {strategy.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-400">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Lightbulb className="w-6 h-6 text-yellow-300 mr-3" />
              <h3 className="text-xl font-semibold text-white">Quick Tips for Writing Success:</h3>
            </div>
            <AskNelieButtons 
              content="Quick tips for writing success: Read your work aloud to catch mistakes. Write first, edit later. Use specific details instead of general words. Practice writing a little bit every day to improve your skills."
              context="writing tips"
            />
          </div>
          
          <ul className="text-purple-100 space-y-2 ml-6">
            <li>• Read your work aloud to catch mistakes and improve flow</li>
            <li>• Write first, edit later - don't worry about perfection in your first draft</li>
            <li>• Use specific details instead of general words</li>
            <li>• Practice writing a little bit every day to improve your skills</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
        >
          Ready to Practice These Strategies, {studentName}!
        </Button>
      </div>
    </div>
  );
};

export default EnglishWritingStrategies;
