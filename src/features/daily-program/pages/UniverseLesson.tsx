import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, RefreshCw } from "lucide-react";
import { contentClient } from "../../../services/contentClient";
import UniverseDisplay from "../components/UniverseDisplay";
import { useAuth } from "@/hooks/useAuth";

// Type guard to access EdgeFunctionProvider methods
const getEdgeProvider = () => {
  return contentClient as any; // We know it's EdgeFunctionProvider
};

export default function UniverseLesson() {
  const { user } = useAuth();
  const [grade, setGrade] = useState<number>(5);
  const [subject, setSubject] = useState<string>("Mathematics");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const subjects = [
    "Mathematics", "Science", "History", "Geography", 
    "Language Arts", "Computer Science", "Creative Arts", 
    "Music", "Physical Education"
  ];

  async function onGenerate() {
    setLoading(true); 
    setError(null);
    setGenerationTime(null);
    const startTime = Date.now();
    
    try {
      const sanitizedContext = {
        subject,
        grade,
        curriculum: "DK",
        ability: "average",
        learningStyle: "visual",
        interests: ["technology", "games"],
      };
      
      const result = await contentClient.generateContent(sanitizedContext);
      setData(result);
      setGenerationTime(Date.now() - startTime);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setData(null);
      setGenerationTime(Date.now() - startTime);
    } finally {
      setLoading(false);
    }
  }

  const handleStartJourney = () => {
    // TODO: Navigate to scenario runner or start the universe experience
    console.log('🚀 Starting learning journey with universe:', data);
    // navigate(`/scenario/${universeId}`, { state: { universe: data } });
  };

  const clearCache = () => {
    const provider = getEdgeProvider();
    if (provider.clearCache) {
      provider.clearCache();
      console.log('🧹 Cache cleared - next generation will be fresh');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Program — Universe Lesson</CardTitle>
                <p className="text-muted-foreground">Generate personalized learning content using our clean architecture</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCache}
                title="Clear cache to force fresh generation"
              >
                Clear Cache
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Input 
                  id="grade"
                  type="number" 
                  value={grade} 
                  onChange={(e) => setGrade(parseInt(e.target.value || "0", 10))}
                  min="1"
                  max="12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select 
                  id="subject"
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={onGenerate} 
                disabled={loading} 
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Universe Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Universe Lesson
                  </>
                )}
              </Button>
              
              {generationTime && (
                <Badge variant="outline" className="px-3 py-2">
                  <Clock className="w-3 h-3 mr-1" />
                  {generationTime}ms
                </Badge>
              )}
            </div>

            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
                <p className="text-destructive text-sm font-medium">❌ Error:</p>
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
            
            {!error && !data && !loading && (
              <div className="p-4 border border-muted rounded-md">
                <p className="text-muted-foreground text-sm">
                  Click "Generate Universe Lesson" to create personalized content
                </p>
              </div>
            )}
            
            
            {data && (
              <UniverseDisplay 
                data={data} 
                onStartJourney={handleStartJourney}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}