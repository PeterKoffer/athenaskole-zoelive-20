import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScenarioRunner() {
  const { scenarioId, adventureId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Adventure Runner</CardTitle>
            <p className="text-muted-foreground">Experience your learning adventure</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-muted rounded-md">
              <p className="text-sm"><strong>Adventure ID:</strong> {adventureId || scenarioId || "No adventure specified"}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This component runs your learning adventure experience.
                It provides an immersive educational journey through today's adventure content.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => navigate("/adventure")}>
                ← Back to Today's Adventure
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}