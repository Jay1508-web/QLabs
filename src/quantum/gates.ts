import { Complex, QubitState, QuantumGate } from '../types/quantum';
import { complex, cAdd, cMul, cConj, cSub, cMagSq, EPSILON } from './complex';
import { normalizeState } from './state';

export type GateMatrix = [[Complex, Complex], [Complex, Complex]];

const INV_SQRT2 = 1 / Math.SQRT2;

export const HADAMARD_GATE: QuantumGate = {
  id: 'H',
  name: 'Hadamard Gate',
  symbol: 'H',
  category: 'superposition',
  description: 'Creates equal superposition from basis states |0⟩ or |1⟩. Maps |0⟩ → ( |0⟩ + |1⟩ ) / √2 and |1⟩ → ( |0⟩ - |1⟩ ) / √2.',
  actionDescription: 'Rotates the Bloch vector by 180° around the (X + Z)/√2 axis, converting longitudinal states into equatorial superposition.',
  matrix: [
    [complex(INV_SQRT2, 0), complex(INV_SQRT2, 0)],
    [complex(INV_SQRT2, 0), complex(-INV_SQRT2, 0)]
  ]
};

export const PAULI_X_GATE: QuantumGate = {
  id: 'X',
  name: 'Pauli-X (NOT) Gate',
  symbol: 'X',
  category: 'pauli',
  description: 'Quantum bit-flip operator. Flips |0⟩ to |1⟩ and |1⟩ to |0⟩.',
  actionDescription: 'Rotates the Bloch sphere by 180° (π radians) around the X-axis.',
  matrix: [
    [complex(0, 0), complex(1, 0)],
    [complex(1, 0), complex(0, 0)]
  ]
};

export const PAULI_Y_GATE: QuantumGate = {
  id: 'Y',
  name: 'Pauli-Y Gate',
  symbol: 'Y',
  category: 'pauli',
  description: 'Bit and phase flip operator. Flips |0⟩ to i|1⟩ and |1⟩ to -i|0⟩.',
  actionDescription: 'Rotates the Bloch sphere by 180° (π radians) around the Y-axis.',
  matrix: [
    [complex(0, 0), complex(0, -1)],
    [complex(0, 1), complex(0, 0)]
  ]
};

export const PAULI_Z_GATE: QuantumGate = {
  id: 'Z',
  name: 'Pauli-Z (Phase Flip) Gate',
  symbol: 'Z',
  category: 'pauli',
  description: 'Changes the sign of the |1⟩ amplitude while leaving |0⟩ unchanged. Leaves measurement probabilities identical while altering relative phase by π.',
  actionDescription: 'Rotates the Bloch sphere by 180° (π radians) around the Z-axis.',
  matrix: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(-1, 0)]
  ]
};

export const PHASE_S_GATE: QuantumGate = {
  id: 'S',
  name: 'Phase (S) Gate',
  symbol: 'S',
  category: 'phase',
  description: 'Applies a π/2 (90°) phase shift to the |1⟩ component. S = √Z.',
  actionDescription: 'Rotates the Bloch sphere by 90° (π/2 radians) around the Z-axis.',
  matrix: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(0, 1)]
  ]
};

export const T_GATE: QuantumGate = {
  id: 'T',
  name: 'T (π/8) Gate',
  symbol: 'T',
  category: 'phase',
  description: 'Applies a π/4 (45°) phase shift to the |1⟩ component. T = √S. Crucial for fault-tolerant universal quantum computing.',
  actionDescription: 'Rotates the Bloch sphere by 45° (π/4 radians) around the Z-axis.',
  matrix: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(INV_SQRT2, INV_SQRT2)]
  ]
};

export const IDENTITY_GATE: QuantumGate = {
  id: 'I',
  name: 'Identity Gate',
  symbol: 'I',
  category: 'identity',
  description: 'Leaves the quantum state completely unchanged. Used in quantum circuits as an idle cycle or buffer delay.',
  actionDescription: 'Applies a null rotation (0 radians); state remains invariant.',
  matrix: [
    [complex(1, 0), complex(0, 0)],
    [complex(0, 0), complex(1, 0)]
  ]
};

export const STANDARD_GATES: QuantumGate[] = [
  HADAMARD_GATE,
  PAULI_X_GATE,
  PAULI_Z_GATE,
  IDENTITY_GATE,
  PAULI_Y_GATE,
  PHASE_S_GATE,
  T_GATE
];

/**
 * Creates arbitrary single-qubit rotation matrix around X-axis:
 * Rx(theta) = [[cos(theta/2), -i*sin(theta/2)], [-i*sin(theta/2), cos(theta/2)]]
 */
export function createRxGate(theta: number): QuantumGate {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  return {
    id: `Rx_${(theta * 180 / Math.PI).toFixed(0)}`,
    name: `Rx(${((theta * 180) / Math.PI).toFixed(0)}°)`,
    symbol: 'Rx',
    category: 'rotation',
    description: `Rotates the qubit state by ${((theta * 180) / Math.PI).toFixed(1)}° around the X-axis.`,
    actionDescription: `Rotation around X by ${((theta * 180) / Math.PI).toFixed(1)}°`,
    matrix: [
      [complex(c, 0), complex(0, -s)],
      [complex(0, -s), complex(c, 0)]
    ]
  };
}

/**
 * Creates arbitrary single-qubit rotation matrix around Y-axis:
 * Ry(theta) = [[cos(theta/2), -sin(theta/2)], [sin(theta/2), cos(theta/2)]]
 */
export function createRyGate(theta: number): QuantumGate {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  return {
    id: `Ry_${(theta * 180 / Math.PI).toFixed(0)}`,
    name: `Ry(${((theta * 180) / Math.PI).toFixed(0)}°)`,
    symbol: 'Ry',
    category: 'rotation',
    description: `Rotates the qubit state by ${((theta * 180) / Math.PI).toFixed(1)}° around the Y-axis.`,
    actionDescription: `Rotation around Y by ${((theta * 180) / Math.PI).toFixed(1)}°`,
    matrix: [
      [complex(c, 0), complex(-s, 0)],
      [complex(s, 0), complex(c, 0)]
    ]
  };
}

/**
 * Creates arbitrary single-qubit rotation matrix around Z-axis:
 * Rz(phi) = [[e^(-i*phi/2), 0], [0, e^(i*phi/2)]]
 */
export function createRzGate(phi: number): QuantumGate {
  const halfPhi = phi / 2;
  return {
    id: `Rz_${(phi * 180 / Math.PI).toFixed(0)}`,
    name: `Rz(${((phi * 180) / Math.PI).toFixed(0)}°)`,
    symbol: 'Rz',
    category: 'rotation',
    description: `Rotates the relative phase by ${((phi * 180) / Math.PI).toFixed(1)}° around the Z-axis.`,
    actionDescription: `Rotation around Z by ${((phi * 180) / Math.PI).toFixed(1)}°`,
    matrix: [
      [complex(Math.cos(-halfPhi), Math.sin(-halfPhi)), complex(0, 0)],
      [complex(0, 0), complex(Math.cos(halfPhi), Math.sin(halfPhi))]
    ]
  };
}

/**
 * Multiplies a 2x2 matrix by a 2D state vector: U * |psi>
 */
export function applyGate(gate: QuantumGate, state: QubitState): QubitState {
  const u = gate.matrix;
  const alpha = state.alpha;
  const beta = state.beta;

  // newAlpha = u00 * alpha + u01 * beta
  const newAlpha = cAdd(cMul(u[0][0], alpha), cMul(u[0][1], beta));

  // newBeta = u10 * alpha + u11 * beta
  const newBeta = cAdd(cMul(u[1][0], alpha), cMul(u[1][1], beta));

  return normalizeState({
    alpha: newAlpha,
    beta: newBeta
  });
}

/**
 * Verifies whether a 2x2 matrix is unitary: U^dagger * U = I.
 */
export function isUnitary(matrix: GateMatrix): boolean {
  // Conjugate transpose (adjoint) U_dag:
  const u00 = cConj(matrix[0][0]);
  const u01 = cConj(matrix[1][0]);
  const u10 = cConj(matrix[0][1]);
  const u11 = cConj(matrix[1][1]);

  // Compute product U_dag * U:
  const p00 = cAdd(cMul(u00, matrix[0][0]), cMul(u01, matrix[1][0]));
  const p01 = cAdd(cMul(u00, matrix[0][1]), cMul(u01, matrix[1][1]));
  const p10 = cAdd(cMul(u10, matrix[0][0]), cMul(u11, matrix[1][0]));
  const p11 = cAdd(cMul(u10, matrix[0][1]), cMul(u11, matrix[1][1]));

  const diff00 = Math.abs(p00.re - 1) + Math.abs(p00.im);
  const diff11 = Math.abs(p11.re - 1) + Math.abs(p11.im);
  const diff01 = Math.abs(p01.re) + Math.abs(p01.im);
  const diff10 = Math.abs(p10.re) + Math.abs(p10.im);

  return (diff00 + diff11 + diff01 + diff10) < 1e-4;
}

/**
 * Computes determinant of 2x2 matrix: det(U) = u00 * u11 - u01 * u10.
 */
export function matrixDeterminant(matrix: GateMatrix): Complex {
  const prod1 = cMul(matrix[0][0], matrix[1][1]);
  const prod2 = cMul(matrix[0][1], matrix[1][0]);
  return cSub(prod1, prod2);
}
