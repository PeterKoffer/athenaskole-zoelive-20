import { describe, it, expect, beforeEach } from 'vitest';
import { mockProfileService, MOCK_USER_ID } from '../MockProfileService';
// LearningAtomPerformance is no longer directly used by updateKCMastery
import { KnowledgeComponentMastery, KCMasteryUpdateData } from '@/types/learnerProfile';

const TEST_KC_ID_1 = 'g4-math-oa-A-1-kc1'; // Example KC from curriculum data
const TEST_KC_ID_2 = 'g4-math-oa-A-1-kc2'; // Another example KC

describe('MockLearnerProfileService - KC Mastery Management', () => {
  beforeEach(() => {
    mockProfileService.resetStore();
  });

  const createKCMasteryUpdateData = (
    success: boolean,
    attemptsInInteraction: number = 1,
    timeTakenMs: number = 30000,
    hintsUsed: number = 0,
    eventType: string = 'answer_submitted',
    details: any = { source: 'test' }
  ): KCMasteryUpdateData => ({
    success,
    attemptsInInteraction,
    timeTakenMs,
    hintsUsed,
    timestamp: new Date().toISOString(),
    eventType,
    details
  });

  it('should create KC mastery on first interaction', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery).toBeDefined();
    expect(kcMastery?.kcId).toBe(TEST_KC_ID_1);
    expect(kcMastery?.attempts).toBe(1); // Updated field name
    expect(kcMastery?.correctAttempts).toBe(1); // Updated field name
    expect(kcMastery?.masteryLevel).toBe(0.625); // 0.5 + (1-0.5)*0.25
  });

  it('should update mastery level correctly for a successful attempt', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    const firstMastery = kcMastery!.masteryLevel;
    expect(firstMastery).toBe(0.625);

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery!.masteryLevel).toBeGreaterThan(firstMastery);
    expect(kcMastery!.masteryLevel).toBe(0.625 + (1 - 0.625) * 0.25); // 0.71875
    expect(kcMastery!.attempts).toBe(2);
    expect(kcMastery!.correctAttempts).toBe(2);
  });

  it('should update mastery level correctly for a failed attempt', async () => {
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    const firstMastery = kcMastery!.masteryLevel;
    expect(firstMastery).toBe(0.375); // 0.5 - 0.5 * 0.25

    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery!.masteryLevel).toBeLessThan(firstMastery);
    expect(kcMastery!.masteryLevel).toBe(0.375 - 0.375 * 0.25); // 0.28125
    expect(kcMastery!.attempts).toBe(2);
    expect(kcMastery!.correctAttempts).toBe(0);
  });

  it('should accumulate interaction history', async () => {
    const dataSuccess = createKCMasteryUpdateData(true, 1, 20000, 0, 'test_event_success');
    const dataFail = createKCMasteryUpdateData(false, 1, 30000, 1, 'test_event_fail');
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, dataSuccess);
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, dataFail);

    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.history.length).toBe(2);
    expect(kcMastery?.history[0].score).toBe(1); // score 1 for success
    expect(kcMastery?.history[0].eventType).toBe('test_event_success');
    expect(kcMastery?.history[1].score).toBe(0); // score 0 for failure
    expect(kcMastery?.history[1].eventType).toBe('test_event_fail');
    // Check details if needed, e.g. hints from updateData.details
    expect((kcMastery?.history[1].details as any).hintsUsed).toBe(1);
  });

  it('should cap interaction history at 20 entries', async () => {
    for (let i = 0; i < 25; i++) {
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(i % 2 === 0, 1, (10+i)*1000, 0, `event_${i}`));
    }
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.history.length).toBe(20);
    // Last event in history should be from iteration 24 (i=24 means success, eventType 'event_24')
    expect(kcMastery?.history[19].score).toBe(1);
    expect(kcMastery?.history[19].eventType).toBe('event_24');
  });

  // currentStreak is not part of the new KnowledgeComponentMastery type in learnerProfile.ts
  // it('should update currentStreak correctly', async () => { ... });

  it('should use attemptsInInteraction for kcMastery.attempts', async () => {
    const updatePayload: KCMasteryUpdateData = {
      success: true,
      attemptsInInteraction: 3,
      timeTakenMs: 90000,
      hintsUsed: 2,
      timestamp: new Date().toISOString(),
      eventType: 'multi_attempt_interaction'
    };
    await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, updatePayload);
    const kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.attempts).toBe(3); // Should use attemptsInInteraction
    expect(kcMastery?.correctAttempts).toBe(1); // Session success counts as 1 successful attempt for KC
    expect(kcMastery?.masteryLevel).toBe(0.625);
  });

  it('should bound mastery level between 0.01 and 0.99', async () => {
    mockProfileService.resetStore(); // Ensure clean start for this specific test
    // Drive mastery down
    for(let i=0; i<20; i++) { // 20 iterations will hit the 0.01 floor
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(false));
    }
    let kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.masteryLevel).toBe(0.01);

    mockProfileService.resetStore(); // Reset for driving up
    await mockProfileService.getProfile(MOCK_USER_ID); // Re-initialize profile to get KC starting at 0.5

    // Drive mastery up
    for(let i=0; i<20; i++) { // 20 iterations will hit the 0.99 ceiling
      await mockProfileService.updateKCMastery(MOCK_USER_ID, TEST_KC_ID_1, createKCMasteryUpdateData(true));
    }
    kcMastery = await mockProfileService.getKCMastery(MOCK_USER_ID, TEST_KC_ID_1);
    expect(kcMastery?.masteryLevel).toBe(0.99);
  });
});
