// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import DailyProgramPage from "@/features/daily-program/pages/DailyProgramPage";
import ScenarioRunner from "@/features/daily-program/pages/ScenarioRunner";
import EducationalSimulatorRedirect from "@/features/daily-program/pages/EducationalSimulatorRedirect";
import RefactoredFloatingAITutor from "@/components/RefactoredFloatingAITutor";
import NELIE from "@/components/NELIE";

// --- Lightweight UI bits ---
function Loader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="animate-pulse text-sm opacity-70">Loading…</div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-screen-md p-6">
      <h1 className="mb-2 text-2xl font-semibold">404 – Siden findes ikke</h1>
      <p className="opacity-80">Stien blev ikke fundet. Går til dagens program.</p>
      <Link className="text-blue-600 underline" to="/daily-program">
        Gå til Daily Program
      </Link>
    </div>
  );
}

/** Minimal app-shell */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <NELIE />
            <span className="text-sm opacity-70">New-core-map</span>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <RefactoredFloatingAITutor />
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: undefined };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-screen-md p-6">
          <h1 className="mb-2 text-2xl font-semibold">Noget gik galt</h1>
          <pre className="whitespace-pre-wrap rounded bg-red-50 p-3 text-sm text-red-700">
            {String(this.state.error.message || this.state.error)}
          </pre>
        </div>
      );
    }
      return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Shell>
            <Routes>
              {/* Start på dagens program */}
              <Route path="/" element={<Navigate to="/daily-program" replace />} />

              {/* Daily Program */}
              <Route path="/daily-program" element={<DailyProgramPage />} />

              {/* Scenario runner */}
              <Route path="/scenario/:scenarioId" element={<ScenarioRunner />} />

              {/* Bagudkompatibilitet: fang ALLE varianter af /educational-simulator */}
              <Route path="/educational-simulator" element={<EducationalSimulatorRedirect />} />
              <Route path="/educational-simulator/*" element={<EducationalSimulatorRedirect />} />

              {/* Sundhedscheck */}
              <Route
                path="/health"
                element={
                  <div className="mx-auto max-w-screen-md p-6">
                    <h1 className="mb-2 text-xl font-semibold">OK</h1>
                    <p className="opacity-70">App svarer og routes er aktive.</p>
                  </div>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Shell>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
