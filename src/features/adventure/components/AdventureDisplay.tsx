import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Clock, Users, Play, Star, RotateCcw } from "lucide-react";
import type { AdventureUniverse, AdventureContent } from "@/services/adventure/service";

interface AdventureDisplayProps {
  universe: AdventureUniverse;
  content?: AdventureContent;
  isRecap: boolean;
  onStartAdventure: (universe: AdventureUniverse, isRecap: boolean) => void;
}

export default function AdventureDisplay({ universe, content, isRecap, onStartAdventure }: AdventureDisplayProps) {
  
  const handleStartAdventure = () => {
    onStartAdventure(universe, isRecap);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        {isRecap && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <RotateCcw className="w-3 h-3 mr-1" />
              Recap Adventure
            </Badge>
          </div>
        )}
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Badge variant="secondary">{universe.subject}</Badge>
                <Badge variant="outline">{universe.grade_level}</Badge>
              </div>
              <CardTitle className="text-2xl font-bold">
                {isRecap && "🔄 "}
                {universe.title}
              </CardTitle>
              <p className="text-muted-foreground max-w-2xl">
                {isRecap 
                  ? `Time to revisit and deepen your understanding of this exciting adventure! ${universe.description}`
                  : universe.description
                }
              </p>
            </div>
            {universe.image_url && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={universe.image_url} 
                  alt={universe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Adventure Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">
              {isRecap ? "Recap Session" : "Today's Adventure"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRecap 
                ? "Reinforce and expand your knowledge"
                : "Complete learning experience across all subjects"
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Learning Goals</h3>
            <p className="text-sm text-muted-foreground">
              {isRecap ? "Deepen existing knowledge" : "Curriculum-aligned objectives"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Personalized</h3>
            <p className="text-sm text-muted-foreground">
              {isRecap ? "Building on your progress" : "Adapted to your learning style"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      {content && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {isRecap ? "Recap Learning Journey" : "Today's Learning Journey"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.summary && (
              <div>
                <h4 className="font-semibold mb-2">Overview</h4>
                <p className="text-muted-foreground">
                  {isRecap && "This recap will help you consolidate your learning. "}
                  {content.summary}
                </p>
              </div>
            )}
            
            {content.objectives && content.objectives.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">
                  {isRecap ? "Reinforcement Objectives" : "Learning Objectives"}
                </h4>
                <ul className="space-y-1">
                  {content.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.activities && (
              <div>
                <h4 className="font-semibold mb-2">Activities & Experiences</h4>
                <div className="text-sm text-muted-foreground">
                  {isRecap 
                    ? "Advanced activities and challenges will be revealed to deepen your understanding"
                    : "Interactive learning activities will be revealed as you progress through your adventure"
                  }
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Universe Metadata */}
      {universe.metadata && (
        <Card>
          <CardHeader>
            <CardTitle>Adventure Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {universe.metadata.category && (
                <div>
                  <span className="font-medium">Category:</span>
                  <p className="text-muted-foreground">{universe.metadata.category}</p>
                </div>
              )}
              {universe.metadata.tags && (
                <div>
                  <span className="font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {universe.metadata.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="text-center">
        <Button 
          onClick={handleStartAdventure}
          size="lg"
          className="px-8"
          variant={isRecap ? "secondary" : "default"}
        >
          {isRecap ? (
            <>
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Recap Adventure
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Today's Adventure
            </>
          )}
        </Button>
      </div>
    </div>
  );
}