import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Code, Palette, Music, Heart } from "lucide-react";

export default function TrainingGroundHome() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = [
    { id: "mathematics", name: "Mathematics", icon: Brain, color: "bg-blue-500" },
    { id: "science", name: "Science", icon: BookOpen, color: "bg-green-500" },
    { id: "computer-science", name: "Computer Science", icon: Code, color: "bg-purple-500" },
    { id: "creative-arts", name: "Creative Arts", icon: Palette, color: "bg-pink-500" },
    { id: "music", name: "Music Discovery", icon: Music, color: "bg-orange-500" },
    { id: "wellness", name: "Mental Wellness", icon: Heart, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Ground</CardTitle>
            <p className="text-muted-foreground">
              Subject-focused learning in TikTok/Instagram style format
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Card 
                    key={subject.id}
                    className={`cursor-pointer transition-all hover:scale-105 border-2 ${
                      selectedSubject === subject.id ? 'border-primary' : 'border-muted'
                    }`}
                    onClick={() => setSelectedSubject(
                      selectedSubject === subject.id ? null : subject.id
                    )}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-12 h-12 rounded-full ${subject.color} flex items-center justify-center mx-auto`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      {selectedSubject === subject.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {selectedSubject && (
              <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Ready to start training in <strong>{subjects.find(s => s.id === selectedSubject)?.name}</strong>
                </p>
                <Button>
                  Begin Training Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About Training Ground</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🎯 Focused Learning</h4>
                <p className="text-muted-foreground">
                  Target specific subjects or skills with laser focus
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📱 Modern Format</h4>
                <p className="text-muted-foreground">
                  Scroll through engaging content like social media
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Quick Sessions</h4>
                <p className="text-muted-foreground">
                  Short, focused training bursts that fit your schedule
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 No Repetition</h4>
                <p className="text-muted-foreground">
                  Always fresh content adapted to your progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}