import React from 'react';
import { ActiveTab, QubitState, MeasurementResult } from '../types/quantum';
import { formatDiracState, getProbabilities, STATE_ZERO } from '../quantum/state';
import { HADAMARD_GATE, PAULI_X_GATE, applyGate } from '../quantum/gates';
import { measureQubit } from '../quantum/measurement';
import { 
  Orbit, 
  Cpu, 
  Gauge, 
  BarChart3, 
  BookOpen, 
  Info, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  Atom,
  CheckCircle2,
  Layers,
  Microchip
} from 'lucide-react';

interface DashboardViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  onNavigate: (tab: ActiveTab) => void;
  onMeasurementOccurred: (result: MeasurementResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentState,
  onUpdateState,
  onNavigate,
  onMeasurementOccurred
}) => {
  const { prob0, prob1 } = getProbabilities(currentState);

  const handleApplyH = () => {
    onUpdateState(applyGate(HADAMARD_GATE, currentState));
  };

  const handleApplyX = () => {
    onUpdateState(applyGate(PAULI_X_GATE, currentState));
  };

  const handleQuickMeasure = () => {
    const res = measureQubit(currentState);
    onUpdateState(res.postState);
    onMeasurementOccurred(res);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 p-8 sm:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold">
              <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
              <span>B.Tech VLSI Quantum Technology • Microproject</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Interactive Digital Simulation of{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                Quantum Superposition
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore how a single qubit transitions into a coherent quantum superposition state 
              <span className="font-mono text-cyan-300 font-semibold"> |ψ⟩ = α|0⟩ + β|1⟩</span>, 
              manipulate it with unitary quantum gates on an interactive 3D Bloch sphere, 
              and experience probabilistic Born-rule measurement collapse.
            </p>

            {/* Quick Action CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('simulator')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition cursor-pointer"
              >
                <Orbit className="w-4 h-4" />
                <span>Launch 3D Bloch Simulator</span>
              </button>

              <button
                onClick={() => onNavigate('learn')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/50 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Guided Experiment Walkthrough</span>
              </button>
            </div>
          </div>

          {/* Quick-Test Interactive Card */}
          <div className="w-full lg:w-80 glass-panel rounded-2xl p-5 border border-cyan-500/30 shadow-2xl flex flex-col gap-4 bg-slate-950/80">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick-Test Cockpit
              </span>
              <button
                onClick={() => onUpdateState({ ...STATE_ZERO })}
                className="text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition"
                title="Reset state to |0⟩"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* State Formula Display */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center font-mono text-cyan-200 text-sm font-bold truncate">
              {formatDiracState(currentState, 2)}
            </div>

            {/* Probability Bars */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-cyan-400">P(0): {(prob0 * 100).toFixed(1)}%</span>
                <span className="text-purple-400">P(1): {(prob1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${prob0 * 100}%` }} className="bg-cyan-400 transition-all duration-300" />
                <div style={{ width: `${prob1 * 100}%` }} className="bg-purple-500 transition-all duration-300" />
              </div>
            </div>

            {/* Instant Trigger Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleApplyH}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 active:scale-95 transition"
              >
                Apply H (Superposition)
              </button>
              <button
                onClick={handleApplyX}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 active:scale-95 transition"
              >
                Apply X (Bit Flip)
              </button>
            </div>

            <button
              onClick={handleQuickMeasure}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Measure (Collapse Qubit)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Choose Simulation Mode Section (Feature 1) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Simulation Hub
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              Choose Simulation Mode
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Select between Quantum State Superposition in Hilbert Space and the Classical Superposition Theorem in Electrical Circuits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Option 1: Normal Simulation (Quantum Superposition) */}
          <div
            onClick={() => onNavigate('simulator')}
            className="group relative rounded-2xl p-6 bg-slate-950/70 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                  <Atom className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                  Option 1: Normal Simulation
                </span>
                <span className="text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Launch ➔
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Quantum Superposition Simulator
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Explore a single qubit in state |ψ⟩ = α|0⟩ + β|1⟩ on an interactive 3D Bloch sphere. 
                Apply unitary gates (Hadamard, Pauli-X, Y, Z), observe 50/50 probability amplitudes, 
                and simulate Copenhagen wavefunction collapse with up to 5,000 Monte Carlo shots.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  3D WebGL Bloch Sphere
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Unitary Gates (H, X, Z)
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Born Rule Measurement
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Monte Carlo Shots
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('simulator');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Orbit className="w-4 h-4" />
              <span>Open Normal Quantum Simulation</span>
            </button>
          </div>

          {/* Option 2: Circuit Simulation (Superposition Theorem) */}
          <div
            onClick={() => onNavigate('circuit')}
            className="group relative rounded-2xl p-6 bg-slate-950/70 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
                  <Zap className="w-3.5 h-3.5" />
                  Option 2: Circuit Simulation • New
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  Launch ➔
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Electrical Circuit Superposition Simulator
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Demonstrate the fundamental Superposition Theorem in a two-source linear DC network (10V & 5V) 
                across resistors (1kΩ, 2kΩ, 1kΩ load). Observe animated current flow, deactivate sources into short-circuits, 
                and verify that VL = V1 + V2 = 4V + 1V = 5V.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Dual DC Sources (10V & 5V)
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Animated Current Flow
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  Mode A, B & C Selection
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  VL = 4V + 1V = 5V Verified
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('circuit');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Open Circuit Superposition Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 3D Bloch Sphere Simulator */}
        <div
          onClick={() => onNavigate('simulator')}
          className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Orbit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              3D Bloch Sphere Simulator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive WebGL 3D representation of the single-qubit state space. Rotate the sphere, 
              view state poles |0⟩, |1⟩, |+⟩, and trace continuous trajectories.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Quantum Gates & Matrices */}
        <div
          onClick={() => onNavigate('gates')}
          className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              Unitary Quantum Gates
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Apply Hadamard (H), Pauli-X, Y, Z, Phase (S), T, and arbitrary rotation gates. 
              Verify unitary matrices (U†U = I) and state vector rotations in real time.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Open Gate Laboratory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Measurement & Shot Simulation */}
        <div
          onClick={() => onNavigate('measurement')}
          className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-4"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Measurement & Shots Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience the Copenhagen interpretation with single-shot wavefunction collapse, 
              or run up to 5,000 Monte Carlo shots to verify the Born rule and statistical convergence.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Measurement Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Microproject Academic Overview & VLSI Syllabus Mapping */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Microchip className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">
              Academic Microproject Specifications (BQT Syllabus)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Domain: VLSI Quantum Technology
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-cyan-400 font-bold font-mono block">Module 1 Alignment</span>
            <p className="text-slate-300">
              Covers state vectors in 2D complex Hilbert space, Dirac bra-ket notation, probability amplitudes, and normalization conditions.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-purple-400 font-bold font-mono block">Module 2 Alignment</span>
            <p className="text-slate-300">
              Single-qubit operations, Hadamard gate superposition generation, Pauli spin matrices, Bloch sphere polar representation.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-amber-400 font-bold font-mono block">Born Rule & Measurement</span>
            <p className="text-slate-300">
              Demonstrates projection operators, irreversible state reduction, and statistical verification via multi-shot Monte Carlo sampling.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-emerald-400 font-bold font-mono block">VLSI Physical Context</span>
            <p className="text-slate-300">
              Relates mathematical qubits to physical silicon CMOS quantum dot gates, transmon microwave resonators, and cryogenic interfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
