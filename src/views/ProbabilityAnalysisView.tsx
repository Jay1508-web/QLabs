import React from 'react';
import { QubitState } from '../types/quantum';
import { getProbabilities, formatDiracState, stateToBloch } from '../quantum/state';
import { formatComplex, cMag, cMagSq, cPhase } from '../quantum/complex';
import { PAULI_Z_GATE, HADAMARD_GATE, applyGate } from '../quantum/gates';
import { ComplexPlanePlot } from '../components/ComplexPlanePlot';
import { ProbabilityBar } from '../components/ProbabilityBar';
import { 
  BarChart3, 
  Waves, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ArrowRight, 
  Compass,
  Zap
} from 'lucide-react';

interface ProbabilityAnalysisViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
}

export const ProbabilityAnalysisView: React.FC<ProbabilityAnalysisViewProps> = ({
  currentState,
  onUpdateState
}) => {
  const { prob0, prob1 } = getProbabilities(currentState);
  const bloch = stateToBloch(currentState);

  const magA = cMag(currentState.alpha);
  const magSqA = cMagSq(currentState.alpha);
  const phaseA = cPhase(currentState.alpha);

  const magB = cMag(currentState.beta);
  const magSqB = cMagSq(currentState.beta);
  const phaseB = cPhase(currentState.beta);

  const handleApplyZ = () => {
    onUpdateState(applyGate(PAULI_Z_GATE, currentState));
  };

  const handleApplyH = () => {
    onUpdateState(applyGate(HADAMARD_GATE, currentState));
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Quantum Probability & Amplitude Analysis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mathematical breakdown of complex probability amplitudes, normalization, and quantum interference
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Normalization: |α|² + |β|² = {(prob0 + prob1).toFixed(5)}</span>
        </div>
      </div>

      {/* Main Probability Bar */}
      <ProbabilityBar state={currentState} showDetails={true} />

      {/* Complex Plane Argand Phasor Diagram */}
      <ComplexPlanePlot state={currentState} />

      {/* Mathematical Amplitude Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alpha Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 text-sm font-mono flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              State |0⟩ Amplitude: α
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              P(0) = {(prob0 * 100).toFixed(2)}%
            </span>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Cartesian Representation:</span>
              <span className="text-white font-bold">α = {formatComplex(currentState.alpha, 4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Real Component Re(α):</span>
              <span className="text-cyan-300">{currentState.alpha.re.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Imaginary Component Im(α):</span>
              <span className="text-cyan-300">{currentState.alpha.im.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Magnitude |α|:</span>
              <span className="text-slate-200">{magA.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Probability |α|²:</span>
              <span className="text-cyan-400 font-bold">{magSqA.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Phase Angle arg(α):</span>
              <span className="text-amber-400">{((phaseA * 180) / Math.PI).toFixed(1)}°</span>
            </div>
          </div>
        </div>

        {/* Beta Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 text-sm font-mono flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400"></span>
              State |1⟩ Amplitude: β
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-500/30">
              P(1) = {(prob1 * 100).toFixed(2)}%
            </span>
          </div>

          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Cartesian Representation:</span>
              <span className="text-white font-bold">β = {formatComplex(currentState.beta, 4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Real Component Re(β):</span>
              <span className="text-purple-300">{currentState.beta.re.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Imaginary Component Im(β):</span>
              <span className="text-purple-300">{currentState.beta.im.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Magnitude |β|:</span>
              <span className="text-slate-200">{magB.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Probability |β|²:</span>
              <span className="text-purple-400 font-bold">{magSqB.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Phase Angle arg(β):</span>
              <span className="text-amber-400">{((phaseB * 180) / Math.PI).toFixed(1)}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Educational Topic: Relative Phase vs Classical Randomness */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Crucial Quantum Concept: Superposition Is Wave Interference, NOT Classical Coin Flips
          </h3>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed space-y-3 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
          <p>
            A common misconception in introductory quantum mechanics is thinking that a qubit in superposition 
            is simply "randomly switching between 0 and 1 like a flipped coin in the air". 
            <strong> This is completely incorrect.</strong>
          </p>
          <p>
            In a classical coin flip, the outcome is 50% Heads and 50% Tails, but there is no <em>relative phase</em>. 
            In a quantum qubit, the state possesses a continuous phase angle 
            <span className="font-mono text-amber-300 font-semibold"> φ = {((bloch.phi * 180) / Math.PI).toFixed(1)}°</span>.
          </p>
          <p>
            For example, compare state <span className="font-mono text-cyan-300 font-bold">|+⟩ = (|0⟩ + |1⟩)/√2</span> and 
            state <span className="font-mono text-purple-300 font-bold">|-⟩ = (|0⟩ - |1⟩)/√2</span>. 
            Both have <strong>exactly 50% probability</strong> of yielding |0⟩ and 50% of yielding |1⟩ upon direct measurement. 
            However, when you apply a second Hadamard gate:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/20 text-cyan-200">
              H|+⟩ = H( |0⟩ + |1⟩ )/√2 = |0⟩  (Constructive for |0⟩)
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/20 text-purple-200">
              H|-⟩ = H( |0⟩ - |1⟩ )/√2 = |1⟩  (Constructive for |1⟩)
            </div>
          </div>
          <p>
            This proves that the relative phase enables destructive and constructive quantum interference, 
            which is the fundamental engine behind Shor's algorithm, Grover's search, and all quantum computing speedups!
          </p>
        </div>

        {/* Interactive Phase Toggle Lab */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-slate-200 block">
              Try Phase Manipulation on Current State:
            </span>
            <span className="text-[11px] text-slate-400">
              Current relative phase φ: {((bloch.phi * 180) / Math.PI).toFixed(1)}°
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyZ}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 transition active:scale-95"
            >
              Apply Pauli-Z (Shift Phase by 180°)
            </button>
            <button
              onClick={handleApplyH}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition active:scale-95"
            >
              Apply Hadamard (Interference Test)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
