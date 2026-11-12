// Circuit Superposition Simulator Types

export type CircuitMode = 'source1' | 'source2' | 'both';

export interface CircuitBranchReadings {
  v1Active: boolean;
  v2Active: boolean;
  v1Voltage: number;    // Volts
  v2Voltage: number;    // Volts
  vL: number;           // Load Voltage (V)
  iL: number;           // Load Current (mA)
  i1: number;           // Branch 1 Current (mA)
  i2: number;           // Branch 2 Current (mA)
  powerL: number;       // Load Power (mW)
  mode: CircuitMode;
  modeLabel: string;
}

export interface CircuitVerificationData {
  source1: CircuitBranchReadings;
  source2: CircuitBranchReadings;
  both: CircuitBranchReadings;
  voltageSumVerified: boolean;
  currentSumVerified: boolean;
}
