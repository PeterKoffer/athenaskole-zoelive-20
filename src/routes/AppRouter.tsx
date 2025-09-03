import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@ui/ProtectedRoute";

// Public
const Landing = lazy(() => import("@features/shell/pages/Landing"));
const Auth = lazy(() => import("@features/auth/pages/Auth"));
const NotFound = lazy(() => import("@ui/NotFound"));

// App (beskyttet)
const Dashboard = lazy(() => import("@features/dashboards/pages/Dashboard"));
const Profile = lazy(() => import("@features/auth/pages/Profile"));
const Preferences = lazy(() => import("@features/auth/pages/Preferences"));
const TodaysProgram = lazy(() => import("@features/daily-program/pages/TodaysProgram"));
const UniverseLesson = lazy(() => import("@features/daily-program/pages/UniverseLesson"));

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/auth", element: <Auth /> },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/preferences", element: <Preferences /> },
      { path: "program/today", element: <TodaysProgram /> },
      { path: "program/universe", element: <UniverseLesson /> }
    ]
  },
  { path: "*", element: <NotFound /> }
]);
