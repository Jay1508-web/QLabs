import React, { useState, useEffect, useCallback } from 'react';
import { QubitState, MeasurementResult } from '../types/quantum';
import { PulseType, CircuitExperimentMode } from '../types/circuit';
import { STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS, getProbabilities } from '../quantum/state';
import { HADAMARD_GATE, PAULI_Z_GATE, PAULI_X_GATE, applyGate } from '../quantum/gates';
import { measureQubit, runShotsSimulation } from '../quantum/measurement';
import { CircuitSchematic } from '../components/Circuit/CircuitSchematic';
import { INTERFERENCE_STEPS } from '../circuit/superposition';
import { 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  RotateCcw, 
  Radio, 
  Cpu, 
  Gauge, 
  Sparkles, 
  Play, 
  GitBranch 
} from 'lucide-react';

interface CircuitSimulatorViewProps {
  onBackToHome: () => void;
}

export const CircuitSimulatorView: React.FC<CircuitSimulatorViewProps> = ({ onBackToHome }) => {
  // Main view state
  const [activeMode, setActiveMode] = useState<CircuitExperimentMode>('superposition');
  
  // Single Qubit Superposition state
  const [qubitState, setQubitState] = useState<QubitState>({ ...STATE_ZERO });
  const [activePulse, setActivePulse] = useState<PulseType>('none');
  const [isPulseAnimating, setIsPulseAnimating] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [lastMeasurement, setLastMeasurement] = useState<0 | 1 | null>(null);
  const [measurementCount, setMeasurementCount] = useState<number>(0);
  const [history0, setHistory0] = useState<number>(0);
  const [history1, setHistory1] = useState<number>(0);

  // Multi-shot batch state
  const [batchResults, setBatchResults] = useState<{ total: number; c0: number; c1: number } | null>(null);

  // Quantum Interference Sequence state (H -> Z -> H -> Measure)
  const [interferenceStep, setInterferenceStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Probabilities calculation
  const { prob0, prob1 } = getProbabilities(qubitState);

  // Handle Microwave Hadamard Pulse trigger
  const handleApplyHadamard = () => {
    if (isPulseAnimating || isMeasuring) return;

    setActivePulse('hadamard');
    setIsPulseAnimating(true);

    // Animate microwave pulse traveling from generator into transmon processor
    setTimeout(() => {
      setQubitState(prevState => applyGate(HADAMARD_GATE, prevState));
      setIsPulseAnimating(false);
      setActivePulse('none');
    }, 750);
  };

  // Handle Pauli-Z microwave phase pulse
  const handleApplyZ = () => {
    if (isPulseAnimating || isMeasuring) return;

    setActivePulse('pauliZ');
    setIsPulseAnimating(true);

    setTimeout(() => {
      setQubitState(prevState => applyGate(PAULI_Z_GATE, prevState));
      setIsPulseAnimating(false);
      setActivePulse('none');
    }, 750);
  };

  // Handle Pauli-X microwave flip pulse
  const handleApplyX = () => {
    if (isPulseAnimating || isMeasuring) return;

    setActivePulse('pauliX');
    setIsPulseAnimating(true);

    setTimeout(() => {
      setQubitState(prevState => applyGate(PAULI_X_GATE, prevState));
      setIsPulseAnimating(false);
      setActivePulse('none');
    }, 750);
  };

  // Handle Dispersive Readout (Measurement)
  const handleMeasure = () => {
    if (isPulseAnimating || isMeasuring) return;

    setIsMeasuring(true);
    setActivePulse('readout');

    // Animate readout tone passing through resonator and HEMT amplifier
    setTimeout(() => {
      const result: MeasurementResult = measureQubit(qubitState);
      setLastMeasurement(result.outcome);
      setQubitState(result.postState);
      setMeasurementCount(prev => prev + 1);

      if (result.outcome === 0) {
        setHistory0(prev => prev + 1);
      } else {
        setHistory1(prev => prev + 1);
      }

      setIsMeasuring(false);
      setActivePulse('none');
    }, 800);
  };

  // Run multi-shot experiment through the circuit readout
  const handleRunBatchShots = (shots: number) => {
    const res = runShotsSimulation(qubitState, shots);
    setBatchResults({
      total: shots,
      c0: res.count0,
      c1: res.count1
    });
    setMeasurementCount(prev => prev + shots);
    setHistory0(prev => prev + res.count0);
    setHistory1(prev => prev + res.count1);
    const lastOutcome: 0 | 1 = (res.individualOutcomes && res.individualOutcomes.length > 0)
      ? res.individualOutcomes[res.individualOutcomes.length - 1]
      : (res.count0 >= res.count1 ? 0 : 1);
    setLastMeasurement(lastOutcome);
    setQubitState(lastOutcome === 0 ? { ...STATE_ZERO } : { ...STATE_ONE });
  };

  // Reset circuit to initial cryogenic ground state |0>
  const handleReset = () => {
    setQubitState({ ...STATE_ZERO });
    setLastMeasurement(null);
    setActivePulse('none');
    setIsPulseAnimating(false);
    setIsMeasuring(false);
    setInterferenceStep(0);
    setIsAutoPlaying(false);
  };

  // Clear measurement tally
  const handleClearHistory = () => {
    setHistory0(0);
    setHistory1(0);
    setMeasurementCount(0);
    setBatchResults(null);
    setLastMeasurement(null);
  };

  // Interference sequence step advancement
  const handleNextInterferenceStep = useCallback(() => {
    setInterferenceStep(prevStep => {
      if (prevStep >= 4) {
        setQubitState({ ...STATE_ZERO });
        setLastMeasurement(null);
        setActivePulse('none');
        setIsPulseAnimating(false);
        setIsMeasuring(false);
        return 0;
      }

      const nextStep = prevStep + 1;

      if (nextStep === 1) {
        // Step 1: First H pulse -> |+> = (|0> + |1>)/sqrt(2)
        setActivePulse('hadamard');
        setIsPulseAnimating(true);
        setTimeout(() => {
          setQubitState({ ...STATE_PLUS });
          setIsPulseAnimating(false);
          setActivePulse('none');
        }, 600);
      } else if (nextStep === 2) {
        // Step 2: Z pulse -> |-> = (|0> - |1>)/sqrt(2)
        setActivePulse('pauliZ');
        setIsPulseAnimating(true);
        setTimeout(() => {
          setQubitState({ ...STATE_MINUS });
          setIsPulseAnimating(false);
          setActivePulse('none');
        }, 600);
      } else if (nextStep === 3) {
        // Step 3: Second H pulse -> H|-> = |1> (Interference!)
        setActivePulse('hadamard');
        setIsPulseAnimating(true);
        setTimeout(() => {
          setQubitState({ ...STATE_ONE });
          setIsPulseAnimating(false);
          setActivePulse('none');
        }, 600);
      } else if (nextStep === 4) {
        // Step 4: Dispersive Readout -> 1 with 100% probability
        setIsMeasuring(true);
        setActivePulse('readout');
        setTimeout(() => {
          setLastMeasurement(1);
          setMeasurementCount(c => c + 1);
          setHistory1(h => h + 1);
          setIsMeasuring(false);
          setActivePulse('none');
        }, 800);
      }

      return nextStep;
    });
  }, []);

  // Automated sequence playback
  useEffect(() => {
    if (!isAutoPlaying) return;

    if (interferenceStep >= 4) {
      const stopTimer = setTimeout(() => setIsAutoPlaying(false), 0);
      return () => clearTimeout(stopTimer);
    }

    const timer = setTimeout(() => {
      handleNextInterferenceStep();
    }, 1600);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, interferenceStep, handleNextInterferenceStep]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Superconducting Circuit Simulation
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            <span>Quantum Superposition Through Electrical Circuits</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating quantum state superposition and interference through physical microwave transmission lines, 
            transmon qubits, and dispersive readout electronics.
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Physical Hardware Model: 15 mK Transmon</span>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tab 1: Single Superposition Experiment */}
        <button
          onClick={() => {
            setActiveMode('superposition');
            handleReset();
          }}
          className={`p-5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-3 ${
            activeMode === 'superposition'
              ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              EXPERIMENT 1: HADAMARD SUPERPOSITION
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${activeMode === 'superposition' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Microwave Control Pulse Superposition</h4>
            <p className="text-xs text-slate-400 mt-1">
              Start at |0⟩, send a calibrated 5.0 GHz π/2 pulse along the transmission line to create 
              (|0⟩ + |1⟩)/√2 with 50%/50% probabilities, then perform probabilistic measurement.
            </p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Target State:</span>
            <span className="text-cyan-300 font-bold">|ψ⟩ = (|0⟩ + |1⟩)/√2 (50% / 50%)</span>
          </div>
        </button>

        {/* Tab 2: Quantum Interference Experiment */}
        <button
          onClick={() => {
            setActiveMode('interference');
            handleReset();
          }}
          className={`p-5 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-3 ${
            activeMode === 'interference'
              ? 'bg-purple-500/15 border-purple-400/60 shadow-lg shadow-purple-500/10'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              EXPERIMENT 2: QUANTUM INTERFERENCE
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${activeMode === 'interference' ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Circuit Sequence: H → Z → H → Measurement</h4>
            <p className="text-xs text-slate-400 mt-1">
              Prove that quantum superposition is wave interference, not classical randomness. 
              Applying H, then phase flip Z, then H yields |1⟩ with exactly 100% probability.
            </p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Target Result:</span>
            <span className="text-purple-300 font-bold">P(|1⟩) = 100% (Constructive Interference)</span>
          </div>
        </button>
      </div>

      {/* Main Interactive Circuit Schematic */}
      <CircuitSchematic
        qubitState={qubitState}
        activePulse={activePulse}
        isPulseAnimating={isPulseAnimating}
        isMeasuring={isMeasuring}
        lastMeasurement={lastMeasurement}
        measurementCount={measurementCount}
        onApplyHadamard={handleApplyHadamard}
        onMeasure={handleMeasure}
        onReset={handleReset}
      />

      {/* Mode-Specific Interactive Control Console */}
      {activeMode === 'superposition' ? (
        /* SUPERPOSITION EXPERIMENT CONSOLE */
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Interactive Microwave Operation &amp; Measurement Console
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to |0⟩</span>
              </button>
            </div>
          </div>

          {/* Operation Trigger Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Apply Hadamard Operation */}
            <button
              onClick={handleApplyHadamard}
              disabled={isPulseAnimating || isMeasuring}
              className="p-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-left transition-all active:scale-95 disabled:opacity-50 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm group-hover:scale-110 transition-transform">
                  H
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                  5.0 GHz π/2 Pulse
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-200">
                  Apply Hadamard Pulse
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Prepares equal superposition (|0⟩ + |1⟩)/√2
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                Sets P(0) = 50%, P(1) = 50% ➔
              </span>
            </button>

            {/* 2. Measure Qubit */}
            <button
              onClick={handleMeasure}
              disabled={isPulseAnimating || isMeasuring}
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-left transition-all active:scale-95 disabled:opacity-50 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-mono font-bold text-sm group-hover:scale-110 transition-transform">
                  <Gauge className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  7.2 GHz Tone
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-200">
                  Perform Readout (MEASURE)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dispersive cavity measurement &amp; collapse
                </p>
              </div>
              <span className="text-[11px] font-mono text-amber-300 font-semibold">
                Yields Bit 0 or 1 ➔
              </span>
            </button>

            {/* 3. Apply Pauli-Z Phase Pulse */}
            <button
              onClick={handleApplyZ}
              disabled={isPulseAnimating || isMeasuring}
              className="p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-left transition-all active:scale-95 disabled:opacity-50 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-mono font-bold text-sm group-hover:scale-110 transition-transform">
                  Z
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                  Phase Flip
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-200">
                  Apply Pauli-Z Pulse
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rotates relative phase by π radians
                </p>
              </div>
              <span className="text-[11px] font-mono text-purple-300 font-semibold">
                Flips phase: + |1⟩ ↔ - |1⟩ ➔
              </span>
            </button>

            {/* 4. Apply Pauli-X Pulse */}
            <button
              onClick={handleApplyX}
              disabled={isPulseAnimating || isMeasuring}
              className="p-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/40 text-left transition-all active:scale-95 disabled:opacity-50 flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 font-mono font-bold text-sm group-hover:scale-110 transition-transform">
                  X
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                  Resonant π Pulse
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-sky-200">
                  Apply Pauli-X (NOT)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quantum bit flip: |0⟩ ↔ |1⟩
                </p>
              </div>
              <span className="text-[11px] font-mono text-sky-300 font-semibold">
                Full 180° inversion ➔
              </span>
            </button>
          </div>

          {/* Multi-Shot Verification Bench */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-mono text-cyan-400 font-bold block">
                  Dispersive Readout Statistics &amp; Born Rule Verification
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fire repeated readout pulses to verify that the superposition (|0⟩ + |1⟩)/√2 yields exactly ~50% bit 0 and ~50% bit 1.
                </p>
              </div>

              {/* Multi-shot buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunBatchShots(100)}
                  disabled={isPulseAnimating || isMeasuring}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  Run 100 Shots
                </button>
                <button
                  onClick={() => handleRunBatchShots(1000)}
                  disabled={isPulseAnimating || isMeasuring}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  Run 1,000 Shots
                </button>
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 transition"
                  title="Clear shot tallies"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Last Batch Summary pill if available */}
            {batchResults && (
              <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/20 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-slate-300">
                <span className="text-cyan-300 font-bold">Last Batch: {batchResults.total} Shots</span>
                <span className="text-cyan-400">Bit 0: {batchResults.c0} ({( (batchResults.c0 / batchResults.total) * 100 ).toFixed(1)}%)</span>
                <span className="text-purple-400">Bit 1: {batchResults.c1} ({( (batchResults.c1 / batchResults.total) * 100 ).toFixed(1)}%)</span>
              </div>
            )}

            {/* Readout statistics bar */}
            {measurementCount > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">
                    Bit 0: {history0} ({( (history0 / measurementCount) * 100 ).toFixed(1)}%)
                  </span>
                  <span className="text-slate-400">Total Measured Pulses: {measurementCount}</span>
                  <span className="text-purple-400 font-bold">
                    Bit 1: {history1} ({( (history1 / measurementCount) * 100 ).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                  <div style={{ width: `${(history0 / measurementCount) * 100}%` }} className="bg-cyan-400 transition-all duration-300" />
                  <div style={{ width: `${(history1 / measurementCount) * 100}%` }} className="bg-purple-500 transition-all duration-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* QUANTUM INTERFERENCE SEQUENCE CONSOLE */
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Circuit Sequence: H → Z → H → Dispersive Readout
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrates that quantum superposition involves probability amplitude wave interference with phase cancellation, 
                proving that measuring the final state yields 1 with 100% certainty.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(prev => !prev)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  isAutoPlaying
                    ? 'bg-purple-500 text-slate-950 border-purple-400'
                    : 'bg-purple-500/10 text-purple-300 border-purple-500/40 hover:bg-purple-500/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAutoPlaying ? "Pause Sequence" : "Auto-Run Sequence"}</span>
              </button>

              <button
                onClick={handleNextInterferenceStep}
                disabled={isAutoPlaying}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition active:scale-95 disabled:opacity-50"
              >
                <span>{interferenceStep >= 4 ? "Restart" : "Next Step ➔"}</span>
              </button>
            </div>
          </div>

          {/* Visual Step-by-Step Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {INTERFERENCE_STEPS.map((s) => {
              const isActive = interferenceStep === s.step;
              const isPast = interferenceStep > s.step;
              return (
                <div
                  key={s.step}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                    isActive
                      ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                      : isPast
                      ? 'bg-slate-950/70 border-slate-800 text-slate-400'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Step {s.step}
                    </span>
                    <span className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                      isActive ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {s.gateSymbol}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white">{s.label}</h5>
                    <p className="text-[11px] font-mono text-cyan-300 font-semibold mt-1">
                      {s.theoreticalState}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono border-t border-slate-800 pt-1.5 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">P(0):</span>
                      <span className="text-cyan-300 font-bold">{(s.prob0 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">P(1):</span>
                      <span className="text-purple-300 font-bold">{(s.prob1 * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Step Explanation & Mathematical Interference Proof */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white font-mono">
                {INTERFERENCE_STEPS[interferenceStep].label}: {INTERFERENCE_STEPS[interferenceStep].actionText}
              </h4>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {INTERFERENCE_STEPS[interferenceStep].explanation}
            </p>

            {/* Interference Amplitude Proof Banner */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-around gap-4 text-center font-mono">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                  Amplitude for |0⟩:
                </span>
                <span className="text-sm font-bold text-cyan-300">
                  {interferenceStep === 0 ? "1.0" : interferenceStep === 1 ? "1/√2 ≈ +0.707" : interferenceStep === 2 ? "1/√2 ≈ +0.707" : "1/2 - 1/2 = 0.0 (Destructive)"}
                </span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-slate-800" />

              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                  Amplitude for |1⟩:
                </span>
                <span className="text-sm font-bold text-purple-300">
                  {interferenceStep === 0 ? "0.0" : interferenceStep === 1 ? "1/√2 ≈ +0.707" : interferenceStep === 2 ? "-1/√2 ≈ -0.707" : "1/2 + 1/2 = 1.0 (Constructive)"}
                </span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-slate-800" />

              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                  Measurement Result:
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {interferenceStep === 4 ? "BIT 1 (100% PROBABILITY)" : "In Progress..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accuracy & Educational Comparison Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Physical Hardware Architecture vs. Quantum Superposition State
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          {/* Classical Hardware Card */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-sm">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>1. Classical Electrical Control Hardware</span>
            </div>
            <p className="text-slate-300">
              The microwave AWG generator, coaxial transmission lines, cryogenic attenuators, and HEMT amplifiers 
              are <strong>classical electrical and RF engineering hardware</strong> operating under classical electrodynamics 
              and Maxwell's equations.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Microwave Transmission Lines:</strong> Guide 5 GHz electromagnetic wavepackets down to 15 mK.</li>
              <li><strong>Cryogenic Attenuation (60 dB):</strong> Suppresses thermal blackbody noise photons ($k_B T \ll \hbar\omega$).</li>
              <li><strong>HEMT Amplifier:</strong> Amplifies the weak 7.2 GHz readout microwave signal by +38 dB at the 4 K stage.</li>
            </ul>
          </div>

          {/* Quantum Degree of Freedom Card */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold font-mono text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>2. The Quantum Superposition Degree of Freedom</span>
            </div>
            <p className="text-slate-300">
              <strong>Crucial Accuracy Requirement:</strong> The qubit is <em>never</em> an ordinary voltage or current on a circuit wire!
            </p>
            <p className="text-slate-300">
              Quantum superposition exists strictly within the <strong>quantized energy levels of the superconducting transmon qubit</strong>. 
              The non-linear inductance of the Josephson junction ($L_J$) creates unequally spaced energy rungs:
            </p>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-cyan-200 text-center">
              |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1
            </div>
            <p className="text-slate-400">
              The microwave pulse creates a coherent quantum superposition between the ground state ($|0\rangle$) and first excited state ($|1\rangle$). 
              Only upon dispersive readout does this superposition collapse probabilistically into classical bit 0 or bit 1.
            </p>
          </div>
        </div>

        {/* Why Classical Superposition ≠ Quantum Superposition */}
        <div className="bg-slate-950/90 p-5 rounded-2xl border border-amber-500/20 flex items-start gap-3.5 text-xs">
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-slate-300">
            <span className="font-bold text-white font-mono block">
              Fundamental Distinction: Classical Electrical Superposition vs. Quantum Superposition
            </span>
            <p>
              In classical circuit theory, the Superposition Theorem is the algebraic addition of voltages and currents in a linear resistor network:
              <span className="font-mono text-amber-300"> V_total = V_1 + V_2</span>. Classical voltages and currents are deterministic, continuous, and directly measurable at any time without disturbing the circuit.
            </p>
            <p>
              In contrast, <strong>Quantum Superposition</strong> represents a state vector in complex Hilbert space:
              <span className="font-mono text-cyan-300"> |ψ⟩ = α|0⟩ + β|1⟩</span>. Superposition allows <em>quantum interference</em> (destructive cancellation and constructive reinforcement of probability amplitudes, as proven by H → Z → H = |1⟩) and undergoes irreversible probabilistic collapse upon measurement according to Born's rule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
