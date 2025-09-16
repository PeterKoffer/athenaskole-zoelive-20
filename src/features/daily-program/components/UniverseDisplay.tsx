import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Target, Star } from "lucide-react";

interface UniverseDisplayProps {
  data: any;
  onStartJourney?: () => void;
}

export default function UniverseDisplay({ data, onStartJourney }: UniverseDisplayProps) {
  // Handle different data structures that might come from edge function
  const universe = data?.universe || data?.content || data || {};
  const title = universe.title || universe.name || "Learning Universe";
  const description = universe.description || universe.summary || "An exciting learning adventure awaits!";
  const activities = universe.activities || universe.lessons || universe.steps || [];
  const subjects = universe.subjects || universe.topics || [];
  const estimatedTime = universe.estimatedTime || universe.duration || "45 minutes";
  const difficulty = universe.difficulty || universe.level || "Grade appropriate";

  return (
    <div className="space-y-6">
      {/* Main Universe Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Target className="w-4 h-4" />
              <span>{difficulty}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4" />
              <span>Personalized</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Subjects Tags */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.slice(0, 6).map((subject: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Start Button */}
          <div className="text-center pt-2">
            <Button 
              onClick={onStartJourney}
              size="lg" 
              className="px-8 py-3 text-lg font-semibold"
            >
              <Star className="w-5 h-5 mr-2" />
              Start Learning Journey
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities Preview */}
      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {activities.slice(0, 4).map((activity: any, index: number) => {
                const activityTitle = activity.title || activity.name || `Activity ${index + 1}`;
                const activityDesc = activity.description || activity.summary || "Engaging learning activity";
                const activityTime = activity.duration || activity.estimatedTime || "10 min";
                
                return (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activityTitle}</h4>
                      <p className="text-sm text-muted-foreground">{activityDesc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activityTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {activities.length > 4 && (
                <div className="text-center py-2">
                  <Badge variant="outline">
                    +{activities.length - 4} more activities
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs p-3 rounded bg-muted overflow-auto max-h-32">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}