// src/pages/DailyPage.tsx - Consolidated Daily Learning Hub
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dailyLearningPlanService, DailyLearningPlan } from '@/services/dailyLearningPlanService';
import { Universe } from '@/services/UniverseGenerator';
import EnhancedLessonManager from '@/components/education/components/EnhancedLessonManager';
import { UnifiedLessonProvider } from '@/components/education/contexts/UnifiedLessonContext';
import { canonicalizeSubject } from '@/utils/subjectMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper types and functions
type Json = Record<string, unknown>;
const sanitize = (u?: string) => (u ?? "").trim().replace(/\/+$/, "");
const BASE = sanitize(import.meta.env.VITE_SUPABASE_URL as string);
const ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

async function postEdge<T>(path: string, body: Json): Promise<T> {
  const url = `${BASE}/functions/v1${path.startsWith("/") ? path : "/" + path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: ANON, Authorization: `Bearer ${ANON}` },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.text()) || res.statusText; } catch { detail = res.statusText; }
    throw new Error(`Edge ${path} ${res.status}: ${detail}`);
  }
  return (await res.json()) as T;
}

async function getCoverUrl(args: { universeId: string; gradeInt: number; title: string; width: number; height: number }): Promise<string> {
  try {
    return await postEdge<string>("/image-service/generate", args);
  } catch {
    return await postEdge<string>("/image-ensure", args);
  }
}

// Stub hooks - keep existing functionality
type UniverseLike = { id?: string; universeId?: string; title?: string; theme?: string };

function useTodaysUniverse(): UniverseLike | null {
  return { id: "universe-science", title: "Today's Science Journey", theme: "science" };
}

function useSuggestions(): UniverseLike[] {
  return [
    { id: "universe-math", title: "Math Adventures", theme: "mathematics" },
    { id: "universe-history", title: "Historical Quests", theme: "history" },
  ];
}

function useStudentGradeInt(): number {
  return (window as any).__STUDENT_GRADE_INT__ ?? 8;
}

const getId = (u?: UniverseLike | null) => (u?.id || u?.universeId || null) as string | null;

interface LocationState {
  universe?: Universe;
  lesson?: { activities?: any[] };
  gradeLevel?: number;
  activeTab?: 'program' | 'session' | 'lesson';
}

export default function DailyPage() {
  console.log("[DailyPage] mounted - consolidated daily hub");
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  // Daily Program state
  const todaysUniverse = useTodaysUniverse();
  const suggestions = useSuggestions();
  const gradeInt = useStudentGradeInt();
  const todaysId = getId(todaysUniverse) ?? "universe-fallback";
  const todaysTitle = (todaysUniverse?.title ?? "Today's Program").trim();
  
  // Learning Session state
  const [plan, setPlan] = useState<DailyLearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Cover image state
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState<string>("");
  
  // Active tab state - determine from location state or default
  const [activeTab, setActiveTab] = useState<string>(
    state?.activeTab || 
    (state?.universe ? 'lesson' : 'program')
  );

  // Generate daily learning plan
  useEffect(() => {
    const generatePlan = async () => {
      if (!user) return;
      try {
        const grade = (user.user_metadata as any)?.grade_level || 6;
        const result = await dailyLearningPlanService.generateDailyPlan(user.id, grade);
        setPlan(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate plan');
      }
    };
    if (user) {
      generatePlan();
    }
  }, [user]);

  // Generate cover image
  useEffect(() => {
    if (!todaysId || !gradeInt) return;
    setCoverLoading(true);
    setCoverError("");
    getCoverUrl({ universeId: todaysId, gradeInt, title: todaysTitle, width: 1024, height: 576 })
      .then(url => setCoverUrl(url))
      .catch(err => setCoverError(err.message))
      .finally(() => setCoverLoading(false));
  }, [todaysId, gradeInt, todaysTitle]);

  const probeBlob = useCallback(async () => {
    if (!coverUrl) return;
    try {
      const res = await fetch(coverUrl);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      window.open(objUrl);
    } catch (e) {
      console.error("Probe failed:", e);
    }
  }, [coverUrl]);

  const testBfl = useCallback(async () => {
    try {
      const data = await postEdge("/image-service/bfl-test", { prompt: "A magical forest" });
      console.log("BFL test result:", data);
    } catch (e) {
      console.error("BFL test failed:", e);
    }
  }, []);

  const startFirstSession = () => {
    if (plan && plan.sessions.length > 0) {
      const first = plan.sessions[0];
      navigate(`/learn/${first.subject}`);
    }
  };

  const startUniverseLesson = (universe: UniverseLike) => {
    navigate('/daily', { 
      state: { 
        universe, 
        gradeLevel: gradeInt,
        activeTab: 'lesson'
      } 
    });
    setActiveTab('lesson');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  // If we have a universe in state and activeTab is lesson, show lesson manager
  const universe = state?.universe;
  if (universe && activeTab === 'lesson') {
    const resolvedSubject = canonicalizeSubject(universe.theme);
    
    return (
      <UnifiedLessonProvider
        subject={resolvedSubject}
        skillArea={'general'}
        gradeLevel={state?.gradeLevel}
        allActivities={[]}
        onLessonComplete={() => {
          setActiveTab('program');
          navigate('/daily', { state: { activeTab: 'program' } });
        }}
      >
        <div className="min-h-screen bg-background">
          <div className="p-4">
            <Button
              variant="outline"
              onClick={() => {
                setActiveTab('program');
                navigate('/daily', { state: { activeTab: 'program' } });
              }}
              className="mb-4"
            >
              ← Back to Daily Hub
            </Button>
          </div>
          <EnhancedLessonManager
            subject={resolvedSubject}
            skillArea="general"
            onBackToProgram={() => {
              setActiveTab('program');
              navigate('/daily', { state: { activeTab: 'program' } });
            }}
            hideActivityCount
          />
        </div>
      </UnifiedLessonProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Daily Learning Hub</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="program">Today's Program</TabsTrigger>
            <TabsTrigger value="session">Learning Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="program" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{todaysTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coverLoading && <p>Loading cover image...</p>}
                  {coverError && <p className="text-destructive">Cover error: {coverError}</p>}
                  {coverUrl && !coverLoading && (
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={coverUrl}
                        alt="Universe Cover"
                        className="w-full max-w-md rounded-lg shadow-lg cursor-pointer"
                        onClick={probeBlob}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={() => startUniverseLesson(todaysUniverse || {})}>
                      Start Today's Learning
                    </Button>
                    <Button variant="outline" onClick={testBfl}>
                      Test Image Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Other Learning Adventures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {suggestions.map((sug, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded">
                        <span>{sug.title}</span>
                        <Button
                          size="sm"
                          onClick={() => startUniverseLesson(sug)}
                        >
                          Explore
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="session" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Learning Plan</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <p className="text-destructive">❌ {error}</p>}
                {!error && !plan && <p>Generating your plan...</p>}
                {plan && (
                  <>
                    <ul className="list-disc pl-5 space-y-1">
                      {plan.sessions.map((s, idx) => (
                        <li key={s.id} className="text-sm text-muted-foreground">
                          {idx + 1}. {s.subject} - {s.skillArea} ({s.estimatedMinutes} min)
                        </li>
                      ))}
                    </ul>
                    <Button onClick={startFirstSession} className="mt-4 w-full">
                      Begin Learning Journey
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
