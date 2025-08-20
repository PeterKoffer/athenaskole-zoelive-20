import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dailyLearningPlanService, DailyLearningPlan } from '@/services/dailyLearningPlanService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DailyLearningSessionPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<DailyLearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePlan = async () => {
      if (!user) return;
      try {
        const grade = (user.user_metadata as any)?.grade_level ?? 6;
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

  const startFirstSession = () => {
    if (plan && plan.sessions.length > 0) {
      const first = plan.sessions[0];
      navigate(`/learn/${first.subject}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-card border-border">
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
                <Button onClick={startFirstSession} className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Begin Learning Journey
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyLearningSessionPage;
