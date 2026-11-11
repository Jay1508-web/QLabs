import React, { useState } from 'react';
import { QubitState, QuantumGate } from '../types/quantum';
import { 
  STANDARD_GATES, 
  HADAMARD_GATE, 
  PAULI_X_GATE, 
  PAULI_Y_GATE, 
  PAULI_Z_GATE, 
  PHASE_S_GATE, 
  T_GATE, 
  IDENTITY_GATE, 
  createRxGate, 
  createRyGate, 
  createRzGate, 
  applyGate, 
  isUnitary, 
  matrixDeterminant 
} from '../quantum/gates';
import { STATE_ZERO, formatDiracState } from '../quantum/state';
import { formatComplex } from '../quantum/complex';
import { GateButton } from '../components/GateButton';
import { Cpu, RotateCcw, Undo2, CheckCircle2, Sliders, History, Sparkles } from 'lucide-react';

interface GatesViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  gateHistory: string[];
  onAddToHistory: (gateSymbol: string) => void;
  onUndoGate: () => void;
  onResetCircuit: () => void;
}

export const GatesView: React.FC<GatesViewProps> = ({
  currentState,
  onUpdateState,
  gateHistory,
  onAddToHistory,
  onUndoGate,
  onResetCircuit
}) => {
  const [selectedGate, setSelectedGate] = useState<QuantumGate>(HADAMARD_GATE);

  // Rotation sliders
  const [rxAngle, setRxAngle] = useState<number>(90);
  const [ryAngle, setRyAngle] = useState<number>(90);
  const [rzAngle, setRzAngle] = useState<number>(90);

  const handleApplyGate = (gate: QuantumGate) => {
    setSelectedGate(gate);
    const nextState = applyGate(gate, currentState);
    onUpdateState(nextState);
    onAddToHistory(gate.symbol);
  };

  const handleApplyCustomRotation = (axis: 'X' | 'Y' | 'Z') => {
    let gate: QuantumGate;
    if (axis === 'X') {
      gate = createRxGate((rxAngle * Math.PI) / 180);
    } else if (axis === 'Y') {
      gate = createRyGate((ryAngle * Math.PI) / 180);
    } else {
      gate = createRzGate((rzAngle * Math.PI) / 180);
    }
    handleApplyGate(gate);
  };

  const unitaryValid = isUnitary(selectedGate.matrix);
  const det = matrixDeterminant(selectedGate.matrix);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            <span>Unitary Quantum Gate Laboratory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-qubit quantum operations, 2x2 complex unitary matrices, and state vector transformations
          </p>
        </div>

        {/* Circuit Timeline Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUndoGate}
            disabled={gateHistory.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:pointer-events-none border border-slate-700 transition"
            title="Undo last applied gate"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Gate</span>
          </button>

          <button
            onClick={onResetCircuit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition"
            title="Reset to ground state |0⟩ and clear circuit history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Circuit</span>
          </button>
        </div>
      </div>

      {/* Quantum Circuit Pipeline Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3 overflow-x-auto shadow-lg">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 pl-2 whitespace-nowrap">
          <History className="w-4 h-4 text-cyan-400" />
          <span>Circuit Pipeline:</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Ground state wire */}
          <div className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
            |0⟩
          </div>

          {gateHistory.length > 0 ? (
            gateHistory.map((sym, idx) => (
              <React.Fragment key={idx}>
                <div className="w-4 h-0.5 bg-slate-700"></div>
                <div className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-slate-900 text-purple-300 border border-purple-500/40 shadow-sm whitespace-nowrap">
                  [{sym}]
                </div>
              </React.Fragment>
            ))
          ) : (
            <>
              <div className="w-6 h-0.5 bg-slate-800"></div>
              <span className="text-xs text-slate-500 italic font-mono whitespace-nowrap">
                (No gates applied yet - Click any gate below)
              </span>
            </>
          )}

          <div className="w-6 h-0.5 bg-slate-700"></div>
          {/* Output State */}
          <div className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-slate-950 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            |ψ⟩ = {formatDiracState(currentState, 2)}
          </div>
        </div>
      </div>

      {/* Gate Matrix Detail Inspector */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-stretch gap-6">
        {/* Matrix Visualization */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold flex items-center justify-center text-sm">
                {selectedGate.symbol}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedGate.name}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedGate.actionDescription}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Unitary (U†U = I)
            </span>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center gap-2 font-mono">
            <span className="text-xs text-slate-400">Unitary Operator Matrix U</span>
            <div className="flex items-center gap-3 text-sm text-cyan-200">
              <span className="text-3xl text-slate-600 font-light">⎡</span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center font-bold">
                <span className="p-1">{formatComplex(selectedGate.matrix[0][0], 3)}</span>
                <span className="p-1">{formatComplex(selectedGate.matrix[0][1], 3)}</span>
                <span className="p-1">{formatComplex(selectedGate.matrix[1][0], 3)}</span>
                <span className="p-1">{formatComplex(selectedGate.matrix[1][1], 3)}</span>
              </div>
              <span className="text-3xl text-slate-600 font-light">⎦</span>
            </div>
          </div>
        </div>

        {/* Mathematical Transformation & Properties */}
        <div className="flex-1 bg-slate-900/60 rounded-xl p-5 border border-slate-800 flex flex-col justify-between gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
              Matrix Mathematical Mechanics
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {selectedGate.description}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-400">Determinant det(U):</span>
              <span className="text-cyan-300 font-bold">{formatComplex(det, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Unitary Check:</span>
              <span className="text-emerald-400 font-bold">{unitaryValid ? 'Passed (Orthogonal)' : 'Failed'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hermitian (U† = U):</span>
              <span className="text-slate-200 font-bold">
                {selectedGate.id === 'H' || selectedGate.id === 'X' || selectedGate.id === 'Y' || selectedGate.id === 'Z' ? 'Yes (Self-inverse)' : 'No'}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleApplyGate(selectedGate)}
            className="w-full py-2.5 rounded-xl font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 active:scale-95 transition"
          >
            Apply {selectedGate.name} to |ψ⟩
          </button>
        </div>
      </div>

      {/* Standard Gates Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Core Standard Quantum Gate Library</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STANDARD_GATES.map((gate) => (
            <GateButton
              key={gate.id}
              gate={gate}
              onApply={handleApplyGate}
            />
          ))}
        </div>
      </div>

      {/* Arbitrary Single-Qubit Rotations (Rx, Ry, Rz) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">
            Continuous Rotation Operators Rx(θ), Ry(θ), Rz(λ)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Any arbitrary single-qubit unitary gate can be decomposed into Euler rotations U = e^(iα) Rz(β) Ry(γ) Rz(δ).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rx Slider */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-bold text-cyan-300">Rx(θ) Rotation</span>
                <span className="text-slate-300">{rxAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rxAngle}
                onChange={(e) => setRxAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
            <button
              onClick={() => handleApplyCustomRotation('X')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
            >
              Apply Rx({rxAngle}°)
            </button>
          </div>

          {/* Ry Slider */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-bold text-purple-300">Ry(θ) Rotation</span>
                <span className="text-slate-300">{ryAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={ryAngle}
                onChange={(e) => setRyAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
            <button
              onClick={() => handleApplyCustomRotation('Y')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white transition"
            >
              Apply Ry({ryAngle}°)
            </button>
          </div>

          {/* Rz Slider */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="font-bold text-amber-300">Rz(λ) Phase Shift</span>
                <span className="text-slate-300">{rzAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rzAngle}
                onChange={(e) => setRzAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
            <button
              onClick={() => handleApplyCustomRotation('Z')}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition"
            >
              Apply Rz({rzAngle}°)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
