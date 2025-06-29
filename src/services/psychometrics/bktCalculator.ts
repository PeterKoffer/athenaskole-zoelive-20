// src/services/psychometrics/bktCalculator.ts

/**
 * Represents a single observation of a student's interaction with a Knowledge Component.
 * For BKT, this is typically whether the student answered correctly or not.
 */
export interface BktObservation {
  timestamp: number;
  isCorrect: boolean;
  // Optional: context like contentAtomId, interactionType, timeTakenMs could be included
  // if the BKT model is extended to use them, but standard BKT primarily uses isCorrect.
}

/**
 * Parameters for a standard BKT model for a specific Knowledge Component.
 * These are typically estimated from data for each KC.
 */
export interface BktParams {
  kcId: string;
  pLo: number; // Probability of initial knowledge (P(L0))
  pT: number;  // Probability of transitioning from unlearned to learned state (P(T) - learn rate)
  pG: number;  // Probability of guessing correctly if KC is not known (P(G) - guess rate)
  pS: number;  // Probability of slipping (making a mistake) if KC is known (P(S) - slip rate)
}

/**
 * Represents the state of knowledge for a KC according to BKT.
 */
export interface BktKnowledgeState {
  kcId: string;
  pMastery: number; // Current estimated probability of mastery P(Ln)
  lastUpdatedTimestamp: number;
}

/**
 * Updates the probability of mastery for a KC based on a new observation
 * using the standard BKT equations.
 *
 * @param priorPMastery The prior probability of the student knowing the KC (P(L_n-1)).
 * @param observation The latest interaction observation (true if correct, false if incorrect).
 * @param params The BKT parameters (pLo, pT, pG, pS) for this KC.
 * @returns The updated probability of mastery P(Ln | observation).
 */
export function updateMasteryWithBkt(
  priorPMastery: number,
  observation: BktObservation,
  params: BktParams
): number {
  let pCorrectIfKnown: number;
  let pCorrectIfNotKnown: number;

  if (observation.isCorrect) {
    // Observed correct
    pCorrectIfKnown = 1 - params.pS; // P(Correct | Known) = 1 - P(Slip)
    pCorrectIfNotKnown = params.pG;    // P(Correct | Not Known) = P(Guess)
  } else {
    // Observed incorrect
    pCorrectIfKnown = params.pS;       // P(Incorrect | Known) = P(Slip)
    pCorrectIfNotKnown = 1 - params.pG; // P(Incorrect | Not Known) = 1 - P(Guess)
  }

  // P(Ln-1 | observation) - Bayes rule for P(Known | Observation)
  const pMasteryGivenObservation =
    (pCorrectIfKnown * priorPMastery) /
    (pCorrectIfKnown * priorPMastery + pCorrectIfNotKnown * (1 - priorPMastery));

  // P(Ln) - Probability of knowing now = P(Known now | Previous was known) + P(Known now | Previous was not known)
  // P(Ln) = P(Ln-1 | obs) * (1 - P(S)) + (1 - P(Ln-1 | obs)) * P(T) -> This is not quite right.
  // Correct update: P(Ln) = P(mastery after observation) * (1) + (1 - P(mastery after observation)) * P(T)
  // This represents applying the chance to learn *after* the current observation is accounted for.
  const updatedPMastery = pMasteryGivenObservation + (1 - pMasteryGivenObservation) * params.pT;

  return updatedPMastery;
}

/**
 * Placeholder function to simulate applying BKT to a sequence of observations.
 * In a real implementation, this would iterate through history and update mastery.
 *
 * @param initialPMastery - The initial probability of mastery (can be pLo from BktParams).
 * @param observationHistory - An array of BktObservation, ordered chronologically.
 * @param params - The BktParams for the KC.
 * @returns The final estimated probability of mastery after all observations.
 */
export function calculateMasterySequence(
  initialPMastery: number,
  observationHistory: BktObservation[],
  params: BktParams
): number {
  console.log(`BKT: Calculating mastery for KC ${params.kcId} with ${observationHistory.length} observations.`);
  console.log(`BKT Params: pLo=${params.pLo}, pT=${params.pT}, pG=${params.pG}, pS=${params.pS}`);

  let currentPMastery = initialPMastery;
  for (const obs of observationHistory) {
    currentPMastery = updateMasteryWithBkt(currentPMastery, obs, params);
    console.log(`BKT: Obs (correct: ${obs.isCorrect}), pMastery updated to: ${currentPMastery.toFixed(4)}`);
  }

  console.log(`BKT: Final pMastery for KC ${params.kcId}: ${currentPMastery.toFixed(4)}`);
  return currentPMastery;
}

// Example Usage (Illustrative - not part of the service itself yet)
/*
const exampleParams: BktParams = {
  kcId: 'example_kc',
  pLo: 0.2, // Initial knowledge 20%
  pT: 0.1,  // Learn rate 10%
  pG: 0.15, // Guess rate 15%
  pS: 0.05  // Slip rate 5%
};

const exampleHistory: BktObservation[] = [
  { timestamp: Date.now() - 3000, isCorrect: true },
  { timestamp: Date.now() - 2000, isCorrect: false },
  { timestamp: Date.now() - 1000, isCorrect: true },
  { timestamp: Date.now(), isCorrect: true },
];

// To use this, one would fetch the KC's BKT params and its observation history.
// Then, potentially starting from pLo or the last saved pMastery, iterate.
// const finalMastery = calculateMasterySequence(exampleParams.pLo, exampleHistory, exampleParams);
*/

console.log('BKT Calculator module loaded. Contains placeholder BKT logic.');
