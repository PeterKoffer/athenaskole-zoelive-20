import { useMemo, useState } from "react";
import { choosePackForToday } from "@/services/universe/offlineScheduler";
import { buildLessonFromPack } from "@/services/universe/aiGlue";
import { UniversePacks } from "@/content/universe.catalog";
import type { GradeBand, CanonicalSubject } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Trash2, Clock, Target, Gamepad2 } from "lucide-react";

const HKEY = (userId: string) => `nelie:universeHistory:${userId}`;

export default function UniverseQAPage() {
  const [userId] = useState("qa-user-1");
  const [schoolId] = useState("qa-school-1");
  const [classId] = useState("qa-class-1");

  const [gradeBand, setBand] = useState<GradeBand>("6-8");
  const [minutes, setMinutes] = useState<number>(150);
  const [subject, setSubject] = useState<CanonicalSubject>("Life Skills");
  const [interests, setInterests] = useState<string>("sports, cooking");
  const [last, setLast] = useState<any|null>(null);
  const [acts, setActs] = useState<any[]|null>(null);
  const [loading, setLoading] = useState(false);

  const history = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(HKEY(userId))||"[]") as Array<{packId:string, isoDate:string}>; }
    catch { return []; }
  }, [userId, last]);

  const pick = () => {
    const res = choosePackForToday({ userId, schoolId, classId, preferPrime: true, avoidRepeatsDays: 30 });
    setLast(res);
    setActs(null); // Clear previous activities
  };

  const clearHistory = () => { 
    localStorage.removeItem(HKEY(userId)); 
    setLast(null);
    setActs(null);
  };

  const build = async () => {
    if (!last?.pack) return;
    setLoading(true);
    try {
      const built = await buildLessonFromPack(last.pack, {
        gradeBand,
        subjectOfDay: subject,
        minutesTotal: minutes,
        interests: interests.split(",").map(s=>s.trim()).filter(Boolean),
        standards: [],
      });
      setActs(built);
    } catch (error) {
      console.error('Failed to build lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMinutes = acts?.reduce((sum, a) => sum + (a.minutes || 0), 0) || 0;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Universe QA Testing</h1>
        <p className="text-muted-foreground">
          Comprehensive testing interface for the universe selection and lesson building system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
          <CardDescription>Configure the parameters for universe selection and lesson building</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradeBand">Grade Band</Label>
              <Select value={gradeBand} onValueChange={(value: GradeBand) => setBand(value)}>
                <SelectTrigger id="gradeBand">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["K-2","3-5","6-8","9-10","11-12"].map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minutes">Duration (minutes)</Label>
              <Input
                id="minutes"
                type="number"
                value={minutes}
                onChange={e => setMinutes(+e.target.value)}
                min="30"
                max="480"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject of the Day</Label>
              <Select value={subject} onValueChange={(value: CanonicalSubject) => setSubject(value)}>
                <SelectTrigger id="subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Mathematics","Science","English","Social Studies","Arts","Music","PE","Technology","Computer Science","Foreign Language","Civics","Life Skills"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interests">Student Interests (CSV)</Label>
              <Input
                id="interests"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="sports, cooking, music"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Test the universe selection and lesson building process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={pick} className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Pick Today's Universe
            </Button>
            <Button variant="outline" onClick={clearHistory} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
            <Button 
              onClick={build} 
              disabled={!last?.pack || loading}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {loading ? "Building..." : "Build Lesson"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {last?.pack && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Universe Pack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{last.pack.title}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {last.pack.id} • Date: {last.date}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{last.pack.category}</Badge>
                <Badge variant="outline">{last.pack.subjectHint}</Badge>
                {last.pack.crossSubjects.map((sub: string) => (
                  <Badge key={sub} variant="outline" className="text-xs">{sub}</Badge>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {last.pack.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {acts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Built Activities
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {totalMinutes} min total
              </Badge>
            </CardTitle>
            <CardDescription>Generated lesson activities with offline fallbacks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acts.map((activity, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{activity.kind}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.minutes} min
                        </span>
                        {activity.game?.id && (
                          <span className="flex items-center gap-1">
                            <Gamepad2 className="h-3 w-3" />
                            {activity.game.id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm"><strong>Instructions:</strong> {activity.instructions}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Deliverable:</strong> {activity.deliverable}</p>
                    </div>
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {activity.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>Recent universe pack selections for this test user</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet. Pick a universe to get started.</p>
          ) : (
            <div className="space-y-2">
              {history.map(h => (
                <div key={h.isoDate} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span>{h.isoDate}</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{h.packId}</code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Universe Catalog Preview</CardTitle>
          <CardDescription>First 20 packs from the complete catalog of {UniversePacks.length} universes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {UniversePacks.slice(0, 20).map(pack => (
              <div key={pack.id} className="border rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">{pack.title}</h4>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{pack.category}</Badge>
                  <Badge variant="outline" className="text-xs">{pack.subjectHint}</Badge>
                </div>
                <code className="text-xs text-muted-foreground block">{pack.id}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}