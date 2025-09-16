import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScenarioRunner() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Runner</CardTitle>
            <p className="text-muted-foreground">Execute specific learning scenarios</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-muted rounded-md">
              <p className="text-sm"><strong>Scenario ID:</strong> {scenarioId || "No scenario specified"}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This component will run specific learning scenarios based on the provided ID.
                It uses the same provider-agnostic LLM layer as UniverseLesson.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => navigate("/daily-program")}>
                ← Back to Universe Lesson
              </Button>
              <Button variant="outline" onClick={() => navigate("/daily")}>
                Go to Daily Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}