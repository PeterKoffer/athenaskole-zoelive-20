// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyProgramPage from '../../pages/DailyProgramPage';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn()
    }
}));

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: { id: 'test-user' },
        loading: false,
    }),
}));

// Mock daily lesson generator to return a simple plan
vi.mock('../../services/dailyLessonGenerator', () => ({
    dailyLessonGenerator: {
        generateDailyLesson: vi.fn().mockResolvedValue([
            {
                id: 'a1',
                type: 'introduction',
                title: 'Intro',
                duration: 60,
                content: {},
                subject: 'mathematics',
                skillArea: 'general'
            }
        ])
    }
}));

describe('DailyProgramPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('allows starting a learning session', async () => {
        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        const startBtn = screen.getByRole('button', { name: /start/i });
        userEvent.click(startBtn);

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: /start learning session/i })
            ).toBeInTheDocument();
        });

        const learnBtn = screen.getByRole('button', { name: /start learning session/i });
        userEvent.click(learnBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/learn/mathematics');
    });

    it('should display the generated lesson title', async () => {
        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        const startBtn = screen.getByRole('button', { name: /start/i });
        userEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByText('Intro')).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /start learning session/i })
            ).toBeInTheDocument();
        });

        const learnBtn = screen.getByRole('button', { name: /start learning session/i });
        userEvent.click(learnBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/learn/mathematics');
    });
});
