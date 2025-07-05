
import { ObjectiveProgressMetrics } from '@/types/curriculum';

// Helper to initialize empty metrics for an objective
export function createInitialObjectiveMetrics(): ObjectiveProgressMetrics {
    return {
        isCompleted: false,
        totalAttempts: 0,
        successfulAttempts: 0,
        totalTimeSpentSeconds: 0,
    };
}

// Helper to update derived metrics
export function updateDerivedMetrics(metrics: ObjectiveProgressMetrics): void {
    if (metrics.totalAttempts > 0) {
        metrics.successRate = metrics.successfulAttempts / metrics.totalAttempts;
    }
    if (metrics.totalAttempts > 0) {
        metrics.avgTimeSpentSeconds = metrics.totalTimeSpentSeconds / metrics.totalAttempts;
    }
}
