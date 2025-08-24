// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyProgramPage from '@/pages/DailyProgramPage';
import { BrowserRouter } from 'react-router-dom';

// Mock auth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    id: 'test-user',
    user: { id: 'test-user', user_metadata: { grade_level: 6 } },
    loading: false,
  }),
}));

// Mock cover generation so vi ikke rammer Supabase edge functions i test
vi.mock('@/services/UniverseImageGenerator', () => ({
  ensureDailyProgramCover: vi.fn().mockResolvedValue('data:image/svg+xml;base64,AAA='),
}));

// Mock lesson source manager til at levere en AI-forslag med én aktivitet
vi.mock('@/services/lessonSourceManager', () => ({
  LessonSourceManager: {
    getLessonForDate: vi.fn().mockResolvedValue({
      type: 'ai-suggestion',
      lesson: {
        title: 'Generated Lesson',
        subject: 'mathematics',
        activities: [
          {
            id: 'a1',
            type: 'introduction',
            title: 'Intro',
            duration: 60,
            content: {},
            subject: 'mathematics',
            skillArea: 'general',
          },
        ],
      },
    }),
    saveLessonToPlan: vi.fn().mockResolvedValue(true),
  },
}));

describe('DailyProgramPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('viser aktiviteter og Start Learning Session', async () => {
    render(
      <BrowserRouter>
        <DailyProgramPage />
      </BrowserRouter>
    );

    // Siden loader selv lesson via LessonSourceManager – ingen klik nødvendig
    // Find aktiviteten fra mocken
    expect(await screen.findByText('Intro')).toBeInTheDocument();

    // Knap til at starte sessionen
    const startBtn = await screen.findByRole('button', { name: /start learning session/i });
    await userEvent.click(startBtn);
    // Navigationsmocken kan evt. også asserteres, men vi nøjes med at sikre at knappen findes/kan klikkes
  });
});

