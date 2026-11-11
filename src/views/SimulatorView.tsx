import React from 'react';
import { QubitState, QuantumGate, MeasurementResult } from '../types/quantum';
import { 
  STATE_ZERO, 
  STATE_ONE, 
  STATE_PLUS, 
  STATE_MINUS, 
  STATE_PLUS_I, 
  STATE_MINUS_I, 
  normalizeState 
} from '../quantum/state';
import { 
  HADAMARD_GATE, 
  PAULI_X_GATE, 
  PAULI_Y_GATE, 
  PAULI_Z_GATE, 
  PHASE_S_GATE, 
  T_GATE, 
  IDENTITY_GATE, 
  applyGate 
} from '../quantum/gates';
import { measureQubit } from '../quantum/measurement';
import { complex } from '../quantum/complex';
import { BlochSphereCanvas } from '../components/BlochSphere/BlochSphereCanvas';
import { StateMathCard } from '../components/StateMathCard';
import { ProbabilityBar } from '../components/ProbabilityBar';
import { Orbit, Zap, RotateCcw, Bookmark, Sparkles, Play } from 'lucide-react';

interface SimulatorViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  onMeasurementOccurred: (result: MeasurementResult) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  currentState,
  onUpdateState,
  onMeasurementOccurred
}) => {
  const quickGates: QuantumGate[] = [
    HADAMARD_GATE,
    PAULI_X_GATE,
    PAULI_Y_GATE,
    PAULI_Z_GATE,
    PHASE_S_GATE,
    T_GATE,
    IDENTITY_GATE
  ];

  const presets = [
    { label: '|0⟩', state: STATE_ZERO, desc: 'Ground state (North pole)' },
    { label: '|1⟩', state: STATE_ONE, desc: 'Excited state (South pole)' },
    { label: '|+⟩', state: STATE_PLUS, desc: 'Hadamard positive superposition (+X)' },
    { label: '|-⟩', state: STATE_MINUS, desc: 'Hadamard negative superposition (-X)' },
    { label: '|+i⟩', state: STATE_PLUS_I, desc: 'Positive circular superposition (+Y)' },
    { label: '|-i⟩', state: STATE_MINUS_I, desc: 'Negative circular superposition (-Y)' },
    { 
      label: '|Magic⟩', 
      state: normalizeState({ alpha: complex(Math.sqrt(1/3), 0), beta: complex(Math.sqrt(2/3), 0) }),
      desc: 'Arbitrary 33% / 67% superposition' 
    }
  ];

  const handleApplyGate = (gate: QuantumGate) => {
    onUpdateState(applyGate(gate, currentState));
  };

  const handleMeasure = () => {
    const res = measureQubit(currentState);
    onUpdateState(res.postState);
    onMeasurementOccurred(res);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Orbit className="w-6 h-6 text-cyan-400" />
            <span>Interactive 3D Bloch Sphere Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize the continuous single-qubit state space on the unit sphere S² (Fubini-Study geometry)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateState({ ...STATE_ZERO })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition active:scale-95"
            title="Reset qubit to ground state |0⟩"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset |0⟩</span>
          </button>

          <button
            onClick={handleMeasure}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 shadow-md shadow-amber-500/25 active:scale-95 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Measure</span>
          </button>
        </div>
      </div>

      {/* Preset State Selection Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 pl-2 whitespace-nowrap">
          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
          <span>Presets:</span>
        </span>
        <div className="flex items-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => onUpdateState(p.state)}
              className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-slate-950/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition active:scale-95 whitespace-nowrap"
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator Grid: Left 3D Sphere, Right Math Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 3D Bloch Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-[460px] lg:min-h-[560px]">
          <div className="w-full h-full flex-1 min-h-[420px]">
            <BlochSphereCanvas state={currentState} showProjections={true} />
          </div>

          {/* Quick Gate Action Bar under sphere */}
          <div className="glass-panel rounded-2xl p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Apply Gate:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {quickGates.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleApplyGate(g)}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-400 transition active:scale-95 shadow-sm"
                  title={`${g.name}: ${g.description}`}
                >
                  {g.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical State Card & Probability Gauges */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <StateMathCard state={currentState} onStateChange={onUpdateState} />
          <ProbabilityBar state={currentState} showDetails={true} />
        </div>
      </div>
    </div>
  );
};
