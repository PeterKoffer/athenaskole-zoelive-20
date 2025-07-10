
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import Index from '@/pages/Index';

// Mock the auth hook to provide a basic mock user
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
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

// Mock speech system to avoid initialization issues in tests
vi.mock('@/components/speech/UnifiedSpeechSystem', () => ({
  unifiedSpeech: {
    speak: vi.fn(),
    stop: vi.fn(),
    toggleEnabled: vi.fn(),
    getState: vi.fn(() => ({ isEnabled: false })),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

describe('App Component Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('renders Index page without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/']}>
            <Index />
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
    
    // Basic smoke test - the component should render without throwing
    expect(document.body).toBeDefined();
  });

  it('renders the main app structure with router', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/']}>
            <Index />
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
    
    // The app should render without throwing errors
    // This is a basic smoke test for the routing structure
    expect(document.body).toBeDefined();
  });
});
