import { CircuitMode, CircuitBranchReadings, CircuitVerificationData } from '../types/circuit';

export const CIRCUIT_CONSTANTS = {
  V1_NOMINAL: 10,     // 10 Volts DC
  V2_NOMINAL: 5,      // 5 Volts DC
  R1: 1000,           // 1 kOhm
  R2: 2000,           // 2 kOhm
  RL: 1000            // 1 kOhm load
};

/**
 * Computes nodal voltages and branch currents for the two-source bridge network.
 * Node equation at Node L (voltage across load RL):
 * (V1 - VL)/R1 + (V2 - VL)/R2 = VL/RL
 * 
 * Multiplying by 2000 (LCM of 1000, 2000, 1000):
 * 2*(V1 - VL) + (V2 - VL) = 2*VL
 * 2*V1 - 2*VL + V2 - VL = 2*VL
 * 2*V1 + V2 = 5*VL
 * VL = (2*V1 + V2) / 5
 */
export function computeCircuitReadings(v1Active: boolean, v2Active: boolean): CircuitBranchReadings {
  const v1 = v1Active ? CIRCUIT_CONSTANTS.V1_NOMINAL : 0;
  const v2 = v2Active ? CIRCUIT_CONSTANTS.V2_NOMINAL : 0;

  // Node voltage VL
  const vL = (2 * v1 + v2) / 5;

  // Load current IL in mA (V / 1000 ohm * 1000 mA/A = V mA)
  const iL = (vL / CIRCUIT_CONSTANTS.RL) * 1000;

  // Branch 1 current in mA flowing from V1 to Node L
  const i1 = ((v1 - vL) / CIRCUIT_CONSTANTS.R1) * 1000;

  // Branch 2 current in mA flowing from V2 to Node L
  const i2 = ((v2 - vL) / CIRCUIT_CONSTANTS.R2) * 1000;

  // Load Power in mW (P = V * I)
  const powerL = vL * iL;

  let mode: CircuitMode = 'both';
  let modeLabel = 'Mode C: Both Sources Active';

  if (v1Active && !v2Active) {
    mode = 'source1';
    modeLabel = 'Mode A: First Source Active (10V)';
  } else if (!v1Active && v2Active) {
    mode = 'source2';
    modeLabel = 'Mode B: Second Source Active (5V)';
  } else if (!v1Active && !v2Active) {
    mode = 'both';
    modeLabel = 'All Sources Deactivated (0V)';
  }

  return {
    v1Active,
    v2Active,
    v1Voltage: v1,
    v2Voltage: v2,
    vL: Number(vL.toFixed(3)),
    iL: Number(iL.toFixed(3)),
    i1: Number(i1.toFixed(3)),
    i2: Number(i2.toFixed(3)),
    powerL: Number(powerL.toFixed(3)),
    mode,
    modeLabel
  };
}

export function getCircuitReadingsForMode(mode: CircuitMode): CircuitBranchReadings {
  switch (mode) {
    case 'source1':
      return computeCircuitReadings(true, false);
    case 'source2':
      return computeCircuitReadings(false, true);
    case 'both':
    default:
      return computeCircuitReadings(true, true);
  }
}

export function getSuperpositionVerification(): CircuitVerificationData {
  const s1 = computeCircuitReadings(true, false);
  const s2 = computeCircuitReadings(false, true);
  const both = computeCircuitReadings(true, true);

  const voltageSum = s1.vL + s2.vL;
  const currentSum = s1.iL + s2.iL;

  const voltageSumVerified = Math.abs(voltageSum - both.vL) < 1e-4;
  const currentSumVerified = Math.abs(currentSum - both.iL) < 1e-4;

  return {
    source1: s1,
    source2: s2,
    both,
    voltageSumVerified,
    currentSumVerified
  };
}
