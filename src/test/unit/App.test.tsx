// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import { AuthProvider } from '@/hooks/useAuth';

describe('App Component Tests', () => {
  it('renders Index page without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Index />
        </AuthProvider>
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button', { name: /View Daily Program/i });
    expect(buttons.length).toBeGreaterThan(0);
  });
});
