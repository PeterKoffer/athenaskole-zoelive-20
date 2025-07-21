import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyProgramPage from '../../pages/DailyProgramPage';
import { BrowserRouter } from 'react-router-dom';
import { aiUniverseGenerator } from '../../services/AIUniverseGenerator';

// Mock the universe generation service
vi.mock('../../services/AIUniverseGenerator', () => ({
    aiUniverseGenerator: {
        generateUniverse: vi.fn()
    }
}));

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
        user: { uid: 'test-user' },
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

    it('should render the universe title and description', async () => {
        (aiUniverseGenerator.generateUniverse as any).mockResolvedValue(JSON.stringify({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [],
        }));

        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        const startBtn = screen.getByRole('button', { name: /start/i });
        userEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByText('Travel to China')).toBeInTheDocument();
            expect(screen.getByText('You have to travel to China to help a man in his store')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /start learning session/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /start your adventure/i })).not.toBeInTheDocument();
        });

        const learnBtn = screen.getByRole('button', { name: /start learning session/i });
        userEvent.click(learnBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/learn/mathematics');
    });

    it('should render the curriculum standards', async () => {
        (aiUniverseGenerator.generateUniverse as any).mockResolvedValue(JSON.stringify({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [
                {
                    id: '1',
                    name: 'Math Objective',
                    description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
                    subjectName: 'Math',
                    educationalLevel: 'Grade 6',
                },
            ],
        }));

        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        const startBtn = screen.getByRole('button', { name: /start/i });
        userEvent.click(startBtn);

        await waitFor(() => {
            expect(screen.getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /start learning session/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /start your adventure/i })).not.toBeInTheDocument();
        });

        const learnBtn = screen.getByRole('button', { name: /start learning session/i });
        userEvent.click(learnBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/learn/mathematics');
    });
});
