import React, { useState } from 'react';
import { QubitState, MeasurementResult, ShotResult } from '../types/quantum';
import { formatDiracState, getProbabilities, STATE_ZERO, STATE_PLUS } from '../quantum/state';
import { measureQubit } from '../quantum/measurement';
import { HADAMARD_GATE, applyGate } from '../quantum/gates';
import { ShotHistogram } from '../components/ShotHistogram';
import confetti from 'canvas-confetti';
import { 
  Gauge, 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Binary, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Atom,
  HelpCircle
} from 'lucide-react';

interface MeasurementLabViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  lastMeasurement: MeasurementResult | null;
  onMeasurementOccurred: (result: MeasurementResult) => void;
}

export const MeasurementLabView: React.FC<MeasurementLabViewProps> = ({
  currentState,
  onUpdateState,
  lastMeasurement,
  onMeasurementOccurred
}) => {
  const [savedPreState, setSavedPreState] = useState<QubitState | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const { prob0, prob1 } = getProbabilities(currentState);

  const handlePerformMeasure = () => {
    setIsMeasuring(true);
    // Save current pre-measurement state if not already collapsed
    if (!savedPreState) {
      setSavedPreState({ ...currentState });
    }

    // Trigger visual quantum ripple / burst effect
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f5ff', '#a855f7', '#38bdf8', '#ffffff']
    });

    setTimeout(() => {
      const res = measureQubit(currentState);
      onUpdateState(res.postState);
      onMeasurementOccurred(res);
      setIsMeasuring(false);
    }, 300);
  };

  const handleRestorePreState = () => {
    if (savedPreState) {
      onUpdateState({ ...savedPreState });
    } else {
      // Default to equal superposition |+>
      onUpdateState({ ...STATE_PLUS });
    }
  };

  const isCollapsed = (prob0 > 0.9999 || prob1 > 0.9999);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Gauge className="w-6 h-6 text-amber-400" />
            <span>Quantum Measurement Laboratory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test the Born rule, witness irreversible wavefunction collapse, and verify multi-shot statistical convergence
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          {savedPreState && isCollapsed && (
            <button
              onClick={handleRestorePreState}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 transition"
              title="Restore state prior to collapse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-prepare Pre-Measurement State</span>
            </button>
          )}

          <button
            onClick={() => onUpdateState({ ...STATE_PLUS })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition"
            title="Prepare equal superposition |+⟩ = (|0⟩ + |1⟩)/√2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Set 50/50 Superposition (|+⟩)</span>
          </button>
        </div>
      </div>

      {/* Part 1: Single-Shot Born Rule Measurement Stage */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Single-Shot Projective Measurement (Von Neumann Collapse)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {'Computational Z-Basis {|0⟩, |1⟩}'}
          </span>
        </div>

        {/* Pre-Measurement Probability Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outcome 0 Gauge */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-cyan-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 font-mono">
                Theoretical Probability P(0)
              </span>
              <span className="font-mono text-cyan-400 font-bold text-lg">
                {(prob0 * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${prob0 * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              P(0) = |α|² (Amplitude squared)
            </span>
          </div>

          {/* Outcome 1 Gauge */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-purple-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 font-mono">
                Theoretical Probability P(1)
              </span>
              <span className="font-mono text-purple-400 font-bold text-lg">
                {(prob1 * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${prob1 * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              P(1) = |β|² (Amplitude squared)
            </span>
          </div>
        </div>

        {/* Center Prominent Measure Button & Result Display */}
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          <button
            onClick={handlePerformMeasure}
            disabled={isMeasuring}
            className="group relative px-10 py-5 rounded-2xl text-base font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:via-rose-400 hover:to-purple-500 text-slate-950 shadow-2xl shadow-rose-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 fill-current ${isMeasuring ? 'animate-bounce' : ''}`} />
              <span>{isMeasuring ? 'Collapsing Wavefunction...' : 'Execute Measurement'}</span>
            </div>
          </button>

          {/* Post-Measurement Result Banner */}
          {lastMeasurement && (
            <div className="w-full max-w-lg animate-fade-in">
              <div className={`rounded-2xl p-5 border text-center flex flex-col items-center gap-3 shadow-xl ${
                lastMeasurement.outcome === 0
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                  : 'bg-purple-950/40 border-purple-500/50 text-purple-200'
              }`}>
                <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-300">
                  Definite Measured Result:
                </span>

                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-mono text-4xl font-black border-2 shadow-2xl ${
                  lastMeasurement.outcome === 0
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/50'
                    : 'bg-purple-600 text-white border-purple-400 shadow-purple-500/50'
                }`}>
                  |{lastMeasurement.outcome}⟩
                </div>

                <div className="text-xs text-slate-300 max-w-sm leading-relaxed">
                  The quantum superposition has collapsed into eigenstate{' '}
                  <span className="font-mono font-bold text-white">|{lastMeasurement.outcome}⟩</span>. 
                  All quantum phase coherence is lost. Further measurements will yield{' '}
                  <span className="font-mono font-bold text-white">|{lastMeasurement.outcome}⟩</span> with 100% certainty.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Short Educational Note */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">The Born Rule Postulate:</strong> In quantum mechanics, 
            measurement is non-unitary and irreversible. When an observable M = Σ m |m⟩⟨m| is measured on state 
            |ψ⟩ = α|0⟩ + β|1⟩, the probability of obtaining outcome m is given by P(m) = |⟨m|ψ⟩|². 
            The system then instantaneously projects into state |m⟩.
          </p>
        </div>
      </div>

      {/* Part 2: Multiple Measurements (Shots Simulator Engine) */}
      <div>
        <ShotHistogram state={currentState} />
      </div>
    </div>
  );
};
