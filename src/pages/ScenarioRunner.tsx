import { useParams } from "react-router-dom";
export default function ScenarioRunner() {
  const { scenarioId } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">✅ ScenarioRunner</h1>
      <p className="mt-2 text-sm opacity-80">Scenario ID: {scenarioId}</p>
    </div>
  );
}
