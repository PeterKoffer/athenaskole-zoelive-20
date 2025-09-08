// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import DailyUniverseLessonPage from "@/features/daily-program/pages/UniverseLesson";
import ScenarioRunner from "@/features/daily-program/pages/ScenarioRunner";
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

/** Minimal app-shell så du kan placere globale overlays og providers ét sted */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Øverste “branding”/status (kan fjernes hvis du har egen navbar) */}
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <NELIE />
            <span className="text-sm opacity-70">New-core-map</span>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Global AI-tutor flyder ovenpå alle sider */}
      <RefactoredFloatingAITutor />
    </div>
  );
}

// Valgfri: simpel ErrorBoundary så en enkelt sidefejl ikke vælter hele app’en.
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
    if (this.state.erro
