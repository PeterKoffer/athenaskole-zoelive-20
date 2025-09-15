import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DailyProgramPage from "./pages/DailyProgramPage";
import ScenarioRunner from "./pages/ScenarioRunner";
import EducationalSimulatorRedirect from "./pages/EducationalSimulatorRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/daily-program" replace />} />
        <Route path="/daily-program" element={<DailyProgramPage />} />
        <Route path="/scenario/:scenarioId" element={<ScenarioRunner />} />
        <Route
          path="/educational-simulator"
          element={<EducationalSimulatorRedirect />}
        />
        <Route path="*" element={<Navigate to="/daily-program" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
