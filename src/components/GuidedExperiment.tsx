import React, { useState } from 'react';
import { QubitState, MeasurementResult } from '../types/quantum';
import { STATE_ZERO, getProbabilities, formatDiracState } from '../quantum/state';
import { HADAMARD_GATE, applyGate } from '../quantum/gates';
import { measureQubit } from '../quantum/measurement';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle, ArrowRight, Atom, Zap, RefreshCw } from 'lucide-react';

interface GuidedExperimentProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  onMeasurementOccurred?: (result: MeasurementResult) => void;
}

interface StepInfo {
  step: number;
  title: string;
  subtitle: string;
  mathFormula: string;
  explanation: string;
  actionText: string;
  expectedStateDescription: string;
}

export const GuidedExperiment: React.FC<GuidedExperimentProps> = ({
  currentState,
  onUpdateState,
  onMeasurementOccurred
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [lastMeasuredBit, setLastMeasuredBit] = useState<number | null>(null);

  const steps: StepInfo[] = [
    {
      step: 1,
      title: 'Initialize Qubit in Ground State |0⟩',
      subtitle: 'Starting from the lowest energy eigenstate',
      mathFormula: '|ψ⟩ = 1·|0⟩ + 0·|1⟩',
      explanation: 'In quantum computers (such as superconducting transmons or silicon quantum dots), qubits are initially cooled or optically pumped into the computational ground state |0⟩. The Bloch vector points vertically to the North Pole.',
      actionText: 'Initialize State |0⟩',
      expectedStateDescription: 'State is purely |0⟩ with P(0) = 100% and P(1) = 0%.'
    },
    {
      step: 2,
      title: 'Apply Hadamard Gate (H)',
      subtitle: 'Generating True Quantum Superposition',
      mathFormula: 'H|0⟩ = (|0⟩ + |1⟩) / √2 = |+⟩',
      explanation: 'The Hadamard transformation is a unitary matrix that rotates the state vector by 90° down onto the equator (the +X axis). It turns a definite classical bit into an equal linear combination of |0⟩ and |1⟩.',
      actionText: 'Apply Hadamard Gate (H)',
      expectedStateDescription: 'The qubit now simultaneously possesses probability amplitudes for both |0⟩ and |1⟩.'
    },
    {
      step: 3,
      title: 'Observe Quantum Superposition',
      subtitle: 'Continuous Hilbert space vs discrete classical states',
      mathFormula: 'α = 1/√2 ≈ 0.707,  β = 1/√2 ≈ 0.707',
      explanation: 'Notice that the qubit is NOT rapidly flipping between 0 and 1. It resides in a stable, coherent wave-state |+⟩ on the equator of the Bloch sphere. The quantum phase is zero, meaning constructive interference is aligned.',
      actionText: 'Verify Superposition Coordinates',
      expectedStateDescription: 'Bloch vector coordinates: r⃗ = (1.0, 0.0, 0.0), θ = 90°, φ = 0°.'
    },
    {
      step: 4,
      title: 'Examine Probability Distribution',
      subtitle: 'Born Rule: Probabilities from complex squared moduli',
      mathFormula: 'P(0) = |α|² = (1/√2)² = 0.50 (50%),   P(1) = |β|² = 0.50 (50%)',
      explanation: 'The probability of measuring either outcome is exactly 50%. Superposition provides the computational parallelism that allows quantum algorithms to process exponentially large state spaces simultaneously.',
      actionText: 'Inspect 50% / 50% Balance',
      expectedStateDescription: 'Perfect balance: P(0) = 50.0% and P(1) = 50.0%.'
    },
    {
      step: 5,
      title: 'Execute Quantum Measurement',
      subtitle: 'Wavefunction reduction and Copenhagen collapse',
      mathFormula: 'P(m) = ⟨ψ|Π_m|ψ⟩  ⟹  |ψ⟩ → |m⟩',
      explanation: 'When the quantum state interacts with a macroscopic measuring apparatus, the superposition is irreversibly destroyed. The wavefunction collapses into a single definite eigenstate—either |0⟩ or |1⟩—with 50% probability each.',
      actionText: 'Perform Measurement Now',
      expectedStateDescription: 'The state will instantly collapse to the measured outcome.'
    },
    {
      step: 6,
      title: 'Observe State Collapse & Conclusion',
      subtitle: 'Post-measurement state verification',
      mathFormula: '|ψ_collapsed⟩ = |0⟩  OR  |1⟩',
      explanation: 'Notice the Bloch vector! It has snapped completely to either the North Pole (|0⟩) or the South Pole (|1⟩). Any subsequent measurements will now produce this same outcome with 100% certainty until a new gate is applied.',
      actionText: 'Restart Guided Experiment',
      expectedStateDescription: 'The superposition phase information has been projected away.'
    }
  ];

  const currentStep = steps[currentStepIndex];
  const { prob0, prob1 } = getProbabilities(currentState);

  const handleStepAction = () => {
    switch (currentStepIndex) {
      case 0: // Step 1: Init |0>
        onUpdateState({ ...STATE_ZERO });
        setCurrentStepIndex(1);
        break;
      case 1: // Step 2: Apply H
        onUpdateState(applyGate(HADAMARD_GATE, currentState));
        setCurrentStepIndex(2);
        break;
      case 2: // Step 3: Observe
        setCurrentStepIndex(3);
        break;
      case 3: // Step 4: Examine probabilities
        setCurrentStepIndex(4);
        break;
      case 4: // Step 5: Measure
        const m = measureQubit(currentState);
        setLastMeasuredBit(m.outcome);
        onUpdateState(m.postState);
        if (onMeasurementOccurred) {
          onMeasurementOccurred(m);
        }
        setCurrentStepIndex(5);
        break;
      case 5: // Step 6: Restart
        onUpdateState({ ...STATE_ZERO });
        setLastMeasuredBit(null);
        setCurrentStepIndex(0);
        break;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Atom className="w-4 h-4" />
            Interactive Microproject Experiment Mode
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">
            Step-by-Step Superposition Walkthrough
          </h3>
        </div>

        {/* Stepper Dots / Counter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Step {currentStep.step} of {steps.length}
          </span>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStepIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'bg-cyan-400 ring-2 ring-cyan-400/40 scale-125'
                    : i < currentStepIndex
                    ? 'bg-cyan-600'
                    : 'bg-slate-800'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Step Card */}
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-cyan-500/20 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-cyan-200">
              {currentStep.title}
            </h4>
            <p className="text-xs text-slate-400">{currentStep.subtitle}</p>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold text-cyan-300">
            {currentStep.mathFormula}
          </div>
        </div>

        {/* Explanation Text */}
        <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          {currentStep.explanation}
        </div>

        {/* Current State Live Status during this step */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400">Current Qubit State: </span>
            <span className="text-cyan-300 font-bold">{formatDiracState(currentState, 2)}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-cyan-400 font-semibold">P(0) = {(prob0 * 100).toFixed(1)}%</span>
            <span className="text-purple-400 font-semibold">P(1) = {(prob1 * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Collapsed bit notification on step 5 or 6 */}
        {lastMeasuredBit !== null && (
          <div className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
            lastMeasuredBit === 0
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              : 'bg-purple-950/40 border-purple-500/40 text-purple-300'
          }`}>
            <span>Wavefunction Collapsed Result:</span>
            <span className="font-bold text-sm bg-slate-950 px-3 py-0.5 rounded-lg border border-current">
              |{lastMeasuredBit}⟩
            </span>
          </div>
        )}

        {/* Step Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => {
                onUpdateState({ ...STATE_ZERO });
                setLastMeasuredBit(null);
                setCurrentStepIndex(0);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 transition"
              title="Reset to Step 1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={handleStepAction}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition cursor-pointer"
          >
            <span>{currentStep.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
