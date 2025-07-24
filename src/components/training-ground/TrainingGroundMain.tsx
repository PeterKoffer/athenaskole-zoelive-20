// @ts-nocheck
// Training Ground component with AI integration and beautiful ActivityRenderer
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, BookOpen, Target } from 'lucide-react';
import { useTrainingGroundContent } from '@/services/useTrainingGroundContent';
import { ActivityRenderer } from './activities/ActivityRenderer';

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: '🔢' },
  { id: 'english', name: 'English', icon: '📚' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'history', name: 'History', icon: '📜' }
];

export default function TrainingGroundMain() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const { activity, loading, error, regenerate } = useTrainingGroundContent({
    subject: selectedSubject,
    enabled: !!selectedSubject
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Target className="h-8 w-8" />
              Training Ground
            </CardTitle>
            <p className="text-lg opacity-90">
              Dynamic, AI-powered learning activities tailored to your interests and style
            </p>
          </CardHeader>
        </Card>

        {/* Subject Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Choose Your Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SUBJECTS.map((subject) => (
                <Button
                  key={subject.id}
                  variant={selectedSubject === subject.id ? "default" : "outline"}
                  className="h-20 flex flex-col gap-2 text-lg"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <span className="text-2xl">{subject.icon}</span>
                  <span>{subject.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Display */}
        {selectedSubject && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="capitalize">
                {selectedSubject} Training Activity
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerate}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                New Activity
              </Button>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg">Generating your personalized activity...</span>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
                  <p className="text-destructive font-medium">
                    Oops! Something went wrong generating your activity.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  <Button variant="outline" size="sm" onClick={regenerate} className="mt-3">
                    Try Again
                  </Button>
                </div>
              )}

              {activity && !loading && (
                <ActivityRenderer 
                  activity={activity}
                  onComplete={() => {
                    console.log('🎉 Student completed activity:', activity.title);
                    // TODO: Track completion, update progress, show celebration
                  }}
                  onRegenerate={regenerate}
                />
              )}
            </CardContent>
          </Card>
        )}

        {!selectedSubject && (
          <Card className="bg-gradient-to-br from-secondary/20 to-accent/20">
            <CardContent className="pt-6 text-center py-12">
              <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Train?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Select a subject above to generate a personalized learning activity 
                that adapts to your level, interests, and learning style.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}