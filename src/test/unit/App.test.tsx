
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
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

// Mock react-router-dom to avoid router conflicts
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  useSearchParams: () => [new URLSearchParams()],
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
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Index />
        </TooltipProvider>
      </QueryClientProvider>
    );
    
    // Basic smoke test - the component should render without throwing
    expect(container).toBeDefined();
  });

  it('renders the main app structure', () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Index />
        </TooltipProvider>
      </QueryClientProvider>
    );
    
    // Check that the mock router is rendered
    expect(getByTestId('mock-router')).toBeInTheDocument();
  });
});
