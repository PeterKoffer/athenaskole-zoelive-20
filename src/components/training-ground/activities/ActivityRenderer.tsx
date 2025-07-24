import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChefHat, Puzzle, BookOpen, Palette, Microscope, Music, Gamepad2 } from 'lucide-react';

interface TrainingGroundActivity {
  title: string;
  objective: string;
  explanation: string;
  activity: {
    type: string;
    instructions: string;
  };
  optionalExtension: string;
  studentSkillTargeted: string;
  learningStyleAdaptation: string;
}

interface ActivityRendererProps {
  activity: TrainingGroundActivity;
  onComplete?: () => void;
  onRegenerate?: () => void;
}

// Activity type to icon mapping
const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cookinggame':
    case 'cooking game':
      return <ChefHat className="w-6 h-6 text-orange-500" />;
    case 'puzzle':
    case 'puzzlesolver':
      return <Puzzle className="w-6 h-6 text-purple-500" />;
    case 'storybuilder':
    case 'story builder':
      return <BookOpen className="w-6 h-6 text-blue-500" />;
    case 'artchallenge':
    case 'art challenge':
      return <Palette className="w-6 h-6 text-pink-500" />;
    case 'scienceexperiment':
    case 'science experiment':
      return <Microscope className="w-6 h-6 text-green-500" />;
    case 'musiccomposer':
    case 'music composer':
      return <Music className="w-6 h-6 text-indigo-500" />;
    default:
      return <Gamepad2 className="w-6 h-6 text-primary" />;
  }
};

// Activity type to color mapping
const getActivityColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cookinggame':
    case 'cooking game':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'puzzle':
    case 'puzzlesolver':
      return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'storybuilder':
    case 'story builder':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'artchallenge':
    case 'art challenge':
      return 'bg-pink-50 border-pink-200 text-pink-800';
    case 'scienceexperiment':
    case 'science experiment':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'musiccomposer':
    case 'music composer':
      return 'bg-indigo-50 border-indigo-200 text-indigo-800';
    default:
      return 'bg-primary/5 border-primary/20 text-primary';
  }
};

export function ActivityRenderer({ activity, onComplete, onRegenerate }: ActivityRendererProps) {
  const activityIcon = getActivityIcon(activity.activity.type);
  const activityColor = getActivityColor(activity.activity.type);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Activity Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {activityIcon}
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-primary">
                {activity.title}
              </CardTitle>
              <p className="text-primary/70 mt-1">
                {activity.objective}
              </p>
            </div>
            <Badge className={`${activityColor} font-medium`}>
              {activity.activity.type}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Activity Content */}
      <Card className="border-2 border-dashed border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Let's Learn!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Explanation */}
          <div className="bg-background/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              What You'll Learn
            </h4>
            <p className="text-foreground leading-relaxed">
              {activity.explanation}
            </p>
          </div>

          {/* Activity Instructions */}
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
              {activityIcon}
              Your Mission
            </h4>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {activity.activity.instructions}
              </p>
            </div>
          </div>

          {/* Learning Style Adaptation */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Learning Style
            </h4>
            <p className="text-foreground text-sm">
              {activity.learningStyleAdaptation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extension Activity */}
      {activity.optionalExtension && (
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-accent-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Want More? Try This Extension!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent-foreground/80 leading-relaxed">
              {activity.optionalExtension}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button 
          onClick={onComplete}
          className="px-8 py-3 text-lg font-semibold"
        >
          I Completed This Activity! 🎉
        </Button>
        <Button 
          variant="outline"
          onClick={onRegenerate}
          className="px-6 py-3"
        >
          Try Different Activity
        </Button>
      </div>

      {/* Skill Targeted Footer */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
        <strong>Skill Focus:</strong> {activity.studentSkillTargeted}
      </div>
    </div>
  );
}