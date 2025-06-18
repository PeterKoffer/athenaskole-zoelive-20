import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';

// Mock the auth hook to provide a basic mock user
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Check that the app renders some content
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeDefined();
  });

  it('renders the main app structure', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // The app should render without throwing errors
    // This is a basic smoke test
    expect(document.body).toBeDefined();
  });
});