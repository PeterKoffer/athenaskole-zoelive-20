import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {navItems.map(({ to, page: Page }) => (
            <Route key={to} path={to} element={<Page />} />
          ))}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
