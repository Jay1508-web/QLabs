// Quantum Superposition Through Electrical Circuits - Types

import { QubitState } from './quantum';

export type PulseType = 'none' | 'hadamard' | 'pauliZ' | 'pauliX' | 'readout';

export interface QuantumCircuitHardwareState {
  // Qubit state
  qubitState: QubitState;
  
  // Physical hardware telemetry
  microwaveFrequencyGhz: number;   // e.g. 5.0 GHz (qubit transition f01)
  readoutFrequencyGhz: number;     // e.g. 7.2 GHz (resonator frequency fr)
  cryoTemperatureMk: number;       // e.g. 15 mK
  drivePowerDbm: number;           // e.g. -45 dBm at chip
  
  // Active animation / pulse states
  activePulse: PulseType;
  isPulseAnimating: boolean;
  isMeasuring: boolean;
  
  // Measurement results
  lastMeasurement: 0 | 1 | null;
  measurementCount: number;
  history0: number;
  history1: number;
  
  // Interference experiment sequence
  interferenceStep: number;        // 0: Initial, 1: After H, 2: After Z, 3: After H2, 4: Measured
}

export type CircuitExperimentMode = 'superposition' | 'interference';
