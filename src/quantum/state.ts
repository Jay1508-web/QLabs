import { Complex, QubitState, BlochCoordinates } from '../types/quantum';
import { complex, cAdd, cMul, cConj, cMagSq, cMag, cPhase, formatComplex, EPSILON } from './complex';

// Canonical pure states
export const STATE_ZERO: QubitState = {
  alpha: complex(1, 0),
  beta: complex(0, 0)
};

export const STATE_ONE: QubitState = {
  alpha: complex(0, 0),
  beta: complex(1, 0)
};

export const STATE_PLUS: QubitState = {
  alpha: complex(1 / Math.SQRT2, 0),
  beta: complex(1 / Math.SQRT2, 0)
};

export const STATE_MINUS: QubitState = {
  alpha: complex(1 / Math.SQRT2, 0),
  beta: complex(-1 / Math.SQRT2, 0)
};

export const STATE_PLUS_I: QubitState = {
  alpha: complex(1 / Math.SQRT2, 0),
  beta: complex(0, 1 / Math.SQRT2)
};

export const STATE_MINUS_I: QubitState = {
  alpha: complex(1 / Math.SQRT2, 0),
  beta: complex(0, -1 / Math.SQRT2)
};

/**
 * Normalizes a quantum state such that |alpha|^2 + |beta|^2 = 1.
 */
export function normalizeState(state: QubitState): QubitState {
  const normSq = cMagSq(state.alpha) + cMagSq(state.beta);
  if (normSq < EPSILON) {
    return { ...STATE_ZERO };
  }
  const norm = Math.sqrt(normSq);
  return {
    alpha: complex(state.alpha.re / norm, state.alpha.im / norm),
    beta: complex(state.beta.re / norm, state.beta.im / norm)
  };
}

/**
 * Calculates Born rule measurement probabilities P(0) and P(1).
 */
export function getProbabilities(state: QubitState): { prob0: number; prob1: number } {
  const normState = normalizeState(state);
  const p0 = cMagSq(normState.alpha);
  const p1 = cMagSq(normState.beta);
  
  // Re-scale slightly to ensure p0 + p1 = 1.0 strictly
  const total = p0 + p1;
  if (total < EPSILON) return { prob0: 1, prob1: 0 };
  return {
    prob0: p0 / total,
    prob1: p1 / total
  };
}

/**
 * Converts a quantum state to Bloch sphere coordinates (x, y, z, theta, phi).
 * Standard convention:
 * |0> -> North pole (z = +1, theta = 0)
 * |1> -> South pole (z = -1, theta = pi)
 * |+> -> +X axis (x = +1, theta = pi/2, phi = 0)
 * |-> -> -X axis (x = -1, theta = pi/2, phi = pi)
 * |+i> -> +Y axis (y = +1, theta = pi/2, phi = pi/2)
 * |-i> -> -Y axis (y = -1, theta = pi/2, phi = 3pi/2)
 */
export function stateToBloch(state: QubitState): BlochCoordinates {
  const s = normalizeState(state);

  // alpha* * beta
  const alphaConj = cConj(s.alpha);
  const prod = cMul(alphaConj, s.beta);

  const x = 2 * prod.re;
  const y = 2 * prod.im;
  const z = cMagSq(s.alpha) - cMagSq(s.beta);

  // Clamping to avoid numerical floating precision issues with Math.acos
  const clampedZ = Math.max(-1, Math.min(1, z));
  const theta = Math.acos(clampedZ); // in [0, pi]

  let phi = Math.atan2(y, x); // in [-pi, pi]
  if (phi < 0) {
    phi += 2 * Math.PI; // normalize to [0, 2pi)
  }

  return {
    x: Math.abs(x) < EPSILON ? 0 : x,
    y: Math.abs(y) < EPSILON ? 0 : y,
    z: Math.abs(z) < EPSILON ? 0 : z,
    theta,
    phi
  };
}

/**
 * Constructs a pure quantum state from spherical angles theta and phi.
 * |psi> = cos(theta/2)|0> + e^(i*phi) * sin(theta/2)|1>
 */
export function blochToState(theta: number, phi: number): QubitState {
  const alphaRe = Math.cos(theta / 2);
  const sinHalf = Math.sin(theta / 2);
  const betaRe = sinHalf * Math.cos(phi);
  const betaIm = sinHalf * Math.sin(phi);

  return {
    alpha: complex(alphaRe, 0),
    beta: complex(betaRe, betaIm)
  };
}

/**
 * Formats state in Dirac bra-ket notation:
 * e.g. "0.707|0⟩ + 0.707|1⟩"
 */
export function formatDiracState(state: QubitState, decimals: number = 3): string {
  const s = normalizeState(state);
  const magAlpha = cMag(s.alpha);
  const magBeta = cMag(s.beta);

  if (magBeta < 1e-4) {
    return '|0⟩';
  }
  if (magAlpha < 1e-4) {
    return '|1⟩';
  }

  // Check for common analytical states
  const invSqrt2 = 1 / Math.SQRT2;
  const isPlus = Math.abs(s.alpha.re - invSqrt2) < 0.01 && Math.abs(s.beta.re - invSqrt2) < 0.01 && Math.abs(s.alpha.im) < 0.01 && Math.abs(s.beta.im) < 0.01;
  if (isPlus) return '1/√2 (|0⟩ + |1⟩) = |+⟩';

  const isMinus = Math.abs(s.alpha.re - invSqrt2) < 0.01 && Math.abs(s.beta.re + invSqrt2) < 0.01 && Math.abs(s.alpha.im) < 0.01 && Math.abs(s.beta.im) < 0.01;
  if (isMinus) return '1/√2 (|0⟩ - |1⟩) = |-⟩';

  const isPlusI = Math.abs(s.alpha.re - invSqrt2) < 0.01 && Math.abs(s.beta.im - invSqrt2) < 0.01 && Math.abs(s.beta.re) < 0.01;
  if (isPlusI) return '1/√2 (|0⟩ + i|1⟩) = |+i⟩';

  const isMinusI = Math.abs(s.alpha.re - invSqrt2) < 0.01 && Math.abs(s.beta.im + invSqrt2) < 0.01 && Math.abs(s.beta.re) < 0.01;
  if (isMinusI) return '1/√2 (|0⟩ - i|1⟩) = |-i⟩';

  const alphaStr = formatComplex(s.alpha, decimals);
  const betaStr = formatComplex(s.beta, decimals);

  const wrappedAlpha = (s.alpha.im !== 0 && s.alpha.re !== 0) ? `(${alphaStr})` : alphaStr;
  const wrappedBeta = (s.beta.im !== 0 && s.beta.re !== 0) ? `(${betaStr})` : betaStr;

  return `${wrappedAlpha}|0⟩ + ${wrappedBeta}|1⟩`;
}

/**
 * Computes the relative quantum phase difference in radians and degrees.
 */
export function getRelativePhase(state: QubitState): { radians: number; degrees: number } {
  const bloch = stateToBloch(state);
  const degrees = (bloch.phi * 180) / Math.PI;
  return {
    radians: bloch.phi,
    degrees: degrees
  };
}
