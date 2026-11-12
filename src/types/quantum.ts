// Quantum Computing Types and Interfaces

export interface Complex {
  re: number;
  im: number;
}

export interface QubitState {
  alpha: Complex; // Amplitude for |0>
  beta: Complex;  // Amplitude for |1>
}

export interface BlochCoordinates {
  x: number;     // <X> = 2 * Re(alpha^* * beta)
  y: number;     // <Y> = 2 * Im(alpha^* * beta)
  z: number;     // <Z> = |alpha|^2 - |beta|^2
  theta: number; // Polar angle in radians [0, pi]
  phi: number;   // Azimuthal angle in radians [0, 2*pi)
}

export interface QuantumGate {
  id: string;
  name: string;
  symbol: string;
  description: string;
  matrix: [[Complex, Complex], [Complex, Complex]];
  actionDescription: string;
  category: 'superposition' | 'pauli' | 'phase' | 'rotation' | 'identity';
}

export interface MeasurementResult {
  outcome: 0 | 1;
  prob0: number;
  prob1: number;
  timestamp: number;
  preState: QubitState;
  postState: QubitState;
}

export interface ShotResult {
  count0: number;
  count1: number;
  totalShots: number;
  empiricalProb0: number;
  empiricalProb1: number;
  theoreticalProb0: number;
  theoreticalProb1: number;
  absoluteError0: number;
  absoluteError1: number;
  standardError: number;
  individualOutcomes?: (0 | 1)[];
}

export type ActiveTab = 
  | 'dashboard'
  | 'simulator'
  | 'circuit'
  | 'gates'
  | 'measurement'
  | 'probability'
  | 'learn'
  | 'about';
