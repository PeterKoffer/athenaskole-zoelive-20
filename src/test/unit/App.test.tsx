import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import { AuthProvider } from '@/contexts/AuthContext';

describe('App Component Tests', () => {
  it('renders Index page without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Index />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to NELIE/i)).toBeInTheDocument();
  });
});
