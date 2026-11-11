import { QubitState, MeasurementResult, ShotResult } from '../types/quantum';
import { getProbabilities, STATE_ZERO, STATE_ONE } from './state';

/**
 * Performs a single quantum projective measurement in the computational Z-basis {|0>, |1>}.
 * According to the Born rule:
 * P(0) = |alpha|^2
 * P(1) = |beta|^2
 * 
 * Wavefunction collapses instantaneously to either |0> or |1>.
 */
export function measureQubit(state: QubitState): MeasurementResult {
  const { prob0, prob1 } = getProbabilities(state);
  const randomRoll = Math.random();
  const outcome: 0 | 1 = randomRoll < prob0 ? 0 : 1;

  // State collapses to the measured eigenstate
  const postState: QubitState = outcome === 0 ? { ...STATE_ZERO } : { ...STATE_ONE };

  return {
    outcome,
    prob0,
    prob1,
    timestamp: Date.now(),
    preState: { ...state },
    postState
  };
}

/**
 * Simulates multiple independent measurements (shots) on freshly prepared copies
 * of the input quantum state.
 * 
 * In quantum mechanics, each shot represents:
 * 1. Preparing a fresh qubit in state |psi>
 * 2. Applying the measurement apparatus
 * 3. Recording the classical bit outcome (0 or 1)
 */
export function runShotsSimulation(state: QubitState, totalShots: number): ShotResult {
  const { prob0: theoreticalProb0, prob1: theoreticalProb1 } = getProbabilities(state);

  let count0 = 0;
  let count1 = 0;
  const individualOutcomes: (0 | 1)[] = [];

  // Generate independent random measurements
  for (let i = 0; i < totalShots; i++) {
    const roll = Math.random();
    const outcome: 0 | 1 = roll < theoreticalProb0 ? 0 : 1;
    if (outcome === 0) {
      count0++;
    } else {
      count1++;
    }
    // Store only up to the first 100 outcomes to keep memory compact for visual timeline
    if (i < 100) {
      individualOutcomes.push(outcome);
    }
  }

  const empiricalProb0 = count0 / totalShots;
  const empiricalProb1 = count1 / totalShots;

  const absoluteError0 = Math.abs(empiricalProb0 - theoreticalProb0);
  const absoluteError1 = Math.abs(empiricalProb1 - theoreticalProb1);

  // Standard Error for a binomial distribution: sqrt(p * (1 - p) / N)
  const standardError = Math.sqrt((theoreticalProb0 * theoreticalProb1) / totalShots);

  return {
    count0,
    count1,
    totalShots,
    empiricalProb0,
    empiricalProb1,
    theoreticalProb0,
    theoreticalProb1,
    absoluteError0,
    absoluteError1,
    standardError,
    individualOutcomes
  };
}
