// Quantum Superposition Through Electrical Circuits - Logic & Simulation

import { QubitState, MeasurementResult } from '../types/quantum';
import { STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS, getProbabilities } from '../quantum/state';
import { HADAMARD_GATE, PAULI_Z_GATE, PAULI_X_GATE, applyGate } from '../quantum/gates';
import { measureQubit } from '../quantum/measurement';
import { PulseType } from '../types/circuit';

export const HARDWARE_SPEC = {
  QUBIT_TYPE: 'Superconducting Transmon Qubit',
  TRANSITION_FREQ_GHZ: 5.0,        // f01 = 5.0 GHz
  READOUT_FREQ_GHZ: 7.2,           // fr = 7.2 GHz
  DISPERSIVE_SHIFT_MHZ: 1.8,       // chi/2pi = 1.8 MHz
  BASE_TEMPERATURE_MK: 15,         // 15 mK in Dilution Refrigerator Mixing Chamber
  ATTENUATION_DB: 60,              // Total attenuation from 300K to 15mK
  JOSEPHSON_ENERGY_EJ_GHZ: 15.5,   // Ej
  CHARGING_ENERGY_EC_MHZ: 280,     // Ec
  PULSE_DURATION_NS: 20,           // 20 ns microwave pulse
};

/**
 * Applies a microwave control pulse to the transmon qubit.
 */
export function applyMicrowaveControlPulse(
  pulse: PulseType, 
  state: QubitState
): { nextState: QubitState; description: string } {
  switch (pulse) {
    case 'hadamard': {
      const nextState = applyGate(HADAMARD_GATE, state);
      return {
        nextState,
        description: 'Microwave π/2 pulse applied at 5.0 GHz. Creates equal quantum superposition (|0⟩ + |1⟩)/√2.'
      };
    }
    case 'pauliZ': {
      const nextState = applyGate(PAULI_Z_GATE, state);
      return {
        nextState,
        description: 'Virtual-Z microwave phase pulse applied. Shifts relative phase of |1⟩ by π radians.'
      };
    }
    case 'pauliX': {
      const nextState = applyGate(PAULI_X_GATE, state);
      return {
        nextState,
        description: 'Microwave resonant π-pulse applied. Flips the computational state |0⟩ ↔ |1⟩.'
      };
    }
    default:
      return {
        nextState: { ...state },
        description: 'Qubit in idle state.'
      };
  }
}

/**
 * Performs circuit measurement via dispersive readout resonator.
 */
export function executeCircuitMeasurement(state: QubitState): MeasurementResult {
  return measureQubit(state);
}

/**
 * Step definitions for the advanced Quantum Interference sequence: H → Z → H → Measurement.
 */
export interface InterferenceStepInfo {
  step: number;
  label: string;
  gateSymbol: string;
  actionText: string;
  theoreticalState: string;
  prob0: number;
  prob1: number;
  explanation: string;
}

export const INTERFERENCE_STEPS: InterferenceStepInfo[] = [
  {
    step: 0,
    label: 'Initial State',
    gateSymbol: 'INIT',
    actionText: 'Qubit thermalized to cryogenic ground state |0⟩',
    theoreticalState: '|0⟩',
    prob0: 1.0,
    prob1: 0.0,
    explanation: 'At 15 mK, thermal energy k_B·T is much smaller than the qubit transition energy ℏω_01 (15 mK ≈ 0.3 GHz ≪ 5.0 GHz). The transmon relaxes naturally into the ground state |0⟩.'
  },
  {
    step: 1,
    label: 'First Hadamard Pulse (H)',
    gateSymbol: 'H',
    actionText: 'Apply microwave π/2 pulse (Hadamard operation)',
    theoreticalState: '(|0⟩ + |1⟩)/√2',
    prob0: 0.5,
    prob1: 0.5,
    explanation: 'The microwave pulse creates a coherent 50/50 superposition (|0⟩ + |1⟩)/√2. Measuring now would yield 0 or 1 with equal 50% probability.'
  },
  {
    step: 2,
    label: 'Pauli-Z Phase Shift (Z)',
    gateSymbol: 'Z',
    actionText: 'Apply microwave phase rotation pulse (π phase flip on |1⟩)',
    theoreticalState: '(|0⟩ - |1⟩)/√2',
    prob0: 0.5,
    prob1: 0.5,
    explanation: 'The Z operation introduces a relative phase of π between the basis states: α = 1/√2, β = -1/√2. Crucially, the measurement probabilities remain 50% / 50%, but the phase holds hidden quantum information.'
  },
  {
    step: 3,
    label: 'Second Hadamard Pulse (H)',
    gateSymbol: 'H',
    actionText: 'Apply second microwave π/2 pulse (Quantum Interference)',
    theoreticalState: '|1⟩',
    prob0: 0.0,
    prob1: 1.0,
    explanation: 'Interference occurs! The amplitude for |0⟩ destructively interferes: (1/√2)(1/√2) + (-1/√2)(1/√2) = 1/2 - 1/2 = 0. The amplitude for |1⟩ constructively interferes: (1/√2)(1/√2) - (-1/√2)(1/√2) = 1/2 + 1/2 = 1.0! The state becomes deterministically |1⟩.'
  },
  {
    step: 4,
    label: 'Dispersive Readout (Measure)',
    gateSymbol: 'M',
    actionText: 'Dispersive microwave readout tone sent through resonator',
    theoreticalState: '|1⟩ (Measured)',
    prob0: 0.0,
    prob1: 1.0,
    explanation: 'Dispersive readout detects the frequency shift of the readout resonator. Because the interference was constructive at |1⟩, the classical digital bit registers 1 with 100% certainty!'
  }
];
