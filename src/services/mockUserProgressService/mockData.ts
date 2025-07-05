
import { UserStepProgress, ObjectiveProgressMetrics } from '@/types/curriculum';

// In-memory store for mock user progress
// Key: userId, Value: Array of UserStepProgress objects for that user
export const userProgressStore: Record<string, UserStepProgress[]> = {
  'testUser1': [
    {
      id: 'progress1_user1',
      userId: 'testUser1',
      stepId: '1',
      isCompleted: false,
      timeSpent: 1200,
      curriculumProgress: {
        'k-cc-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 60, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 60, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-cc-2': { isCompleted: false, totalAttempts: 2, successfulAttempts: 0, totalTimeSpentSeconds: 120, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 70, hintsUsed:1, success:false, firstAttemptSuccess:false, timestamp: new Date().toISOString()}},
        'dk-math-basic-arithmetic': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 2, successfulAttempts: 1, totalTimeSpentSeconds: 180, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 90, hintsUsed:0, success:true, firstAttemptSuccess:false, timestamp: new Date().toISOString()}},
      }
    },
    {
      id: 'progress2_user1',
      userId: 'testUser1',
      stepId: '2',
      isCompleted: false,
      timeSpent: 600,
      curriculumProgress: {
        '1-oa-1': { isCompleted: false, totalAttempts: 0, successfulAttempts: 0, totalTimeSpentSeconds: 0 },
      }
    }
  ],
  // testUser2 has completed step 1 fully
  'testUser2': [
     {
      id: 'progress1_user2',
      userId: 'testUser2',
      stepId: '1',
      isCompleted: true,
      completedAt: new Date().toISOString(),
      timeSpent: 3000,
      curriculumProgress: {
        'k-cc-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 50, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 50, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-cc-2': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 70, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 70, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'k-oa-1': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 80, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 80, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'dk-math-basic-arithmetic': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 90, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 90, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
        'dk-danish-reading': { isCompleted: true, completedAt: new Date().toISOString(), totalAttempts: 1, successfulAttempts: 1, totalTimeSpentSeconds: 60, lastAttemptPerformance: { attempts:1, timeTakenSeconds: 60, hintsUsed:0, success:true, firstAttemptSuccess:true, timestamp: new Date().toISOString()}},
      }
    }
  ],
  // Add rich test data for the actual test user ID from the adaptive integration test
  '62612ab6-0c5f-4713-b716-feee788c89d9': [
    {
      id: 'progress1_testuser_adaptive',
      userId: '62612ab6-0c5f-4713-b716-feee788c89d9',
      stepId: '1',
      isCompleted: false,
      timeSpent: 2400,
      curriculumProgress: {
        // k-cc-1: Completed easily on first try (should suggest medium/hard for revision)
        'k-cc-1': { 
          isCompleted: true, 
          completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          totalAttempts: 1, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 45,
          successRate: 1.0,
          avgTimeSpentSeconds: 45,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 45, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        },
        // k-cc-2: Multiple failed attempts (should suggest easy)
        'k-cc-2': { 
          isCompleted: false, 
          totalAttempts: 4, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 280,
          successRate: 0.25,
          avgTimeSpentSeconds: 70,
          lastAttemptPerformance: { 
            attempts: 2, 
            timeTakenSeconds: 85, 
            hintsUsed: 2, 
            success: false, 
            firstAttemptSuccess: false, 
            timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
          }
        },
        // k-cc-3: FIXED - Completed with moderate performance (should suggest medium)
        'k-cc-3': { 
          isCompleted: true, 
          completedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          totalAttempts: 3, 
          successfulAttempts: 2, 
          totalTimeSpentSeconds: 150,
          successRate: 0.67,
          avgTimeSpentSeconds: 50,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 55, 
            hintsUsed: 1, 
            success: true, 
            firstAttemptSuccess: false, 
            timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        },
        // dk-math-basic-arithmetic: High performance after initial struggle (should suggest medium/hard)
        'dk-math-basic-arithmetic': { 
          isCompleted: true, 
          completedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          totalAttempts: 3, 
          successfulAttempts: 2, 
          totalTimeSpentSeconds: 210,
          successRate: 0.67,
          avgTimeSpentSeconds: 70,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 60, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 172800000).toISOString()
          }
        }
      }
    },
    {
      id: 'progress2_testuser_adaptive',
      userId: '62612ab6-0c5f-4713-b716-feee788c89d9',
      stepId: '2',
      isCompleted: false,
      timeSpent: 800,
      curriculumProgress: {
        // 1-oa-1: Fresh objective with no attempts (should default to medium)
        '1-oa-1': { 
          isCompleted: false, 
          totalAttempts: 0, 
          successfulAttempts: 0, 
          totalTimeSpentSeconds: 0 
        },
        // 1-oa-2: One successful attempt (should suggest medium)
        '1-oa-2': { 
          isCompleted: false, 
          totalAttempts: 1, 
          successfulAttempts: 1, 
          totalTimeSpentSeconds: 40,
          successRate: 1.0,
          avgTimeSpentSeconds: 40,
          lastAttemptPerformance: { 
            attempts: 1, 
            timeTakenSeconds: 40, 
            hintsUsed: 0, 
            success: true, 
            firstAttemptSuccess: true, 
            timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
          }
        }
      }
    }
  ]
};
