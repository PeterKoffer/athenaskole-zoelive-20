import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ProfilePage from '@/pages/ProfilePage';
import { SupabaseProfileService } from '@/services/learnerProfile/SupabaseProfileService';
import { LearnerProfile } from '@/types/learnerProfile';
import { vi } from 'vitest';

// Mock the SupabaseProfileService
vi.mock('@/services/learnerProfile/SupabaseProfileService');

const mockProfile: LearnerProfile = {
  userId: '123',
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.png',
  avatarColor: 'from-purple-400 to-cyan-400',
  preferences: {
    preferredSubjects: ['Math', 'Science'],
  },
  learningHistory: [],
  kcMastery: {},
};

describe('ProfilePage', () => {
  beforeEach(() => {
    (SupabaseProfileService.prototype.getProfile as any).mockResolvedValue(mockProfile);
    (SupabaseProfileService.prototype.createInitialProfile as any).mockResolvedValue(mockProfile);
    (SupabaseProfileService.prototype.updateProfile as any).mockResolvedValue(undefined);
  });

  test('renders the profile page with user data', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthProvider>
    );

    // Wait for the profile to be loaded
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  test('updates the user name when the input is changed', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      expect(nameInput).toHaveValue('New Name');
    });
  });

  test('saves the updated profile when the form is submitted', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(SupabaseProfileService.prototype.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Name',
        })
      );
    });
  });
});
