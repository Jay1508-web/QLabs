import React, { useState } from 'react';
import { CircuitMode } from '../types/circuit';
import { getCircuitReadingsForMode, getSuperpositionVerification } from '../circuit/superposition';
import { CircuitSchematic } from '../components/Circuit/CircuitSchematic';
import { 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  Activity, 
  HelpCircle, 
  BookOpen, 
  Calculator,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface CircuitSimulatorViewProps {
  onBackToHome: () => void;
}

export const CircuitSimulatorView: React.FC<CircuitSimulatorViewProps> = ({ onBackToHome }) => {
  const [selectedMode, setSelectedMode] = useState<CircuitMode>('both');
  const [v1State, setV1State] = useState<boolean>(true);
  const [v2State, setV2State] = useState<boolean>(true);

  // When user clicks the top mode buttons (A, B, or C)
  const handleSelectMode = (mode: CircuitMode) => {
    setSelectedMode(mode);
    if (mode === 'source1') {
      setV1State(true);
      setV2State(false);
    } else if (mode === 'source2') {
      setV1State(false);
      setV2State(true);
    } else {
      setV1State(true);
      setV2State(true);
    }
  };

  // When user manually toggles switches on the schematic directly
  const handleToggleV1 = () => {
    const nextV1 = !v1State;
    setV1State(nextV1);
    updateModeFromToggles(nextV1, v2State);
  };

  const handleToggleV2 = () => {
    const nextV2 = !v2State;
    setV2State(nextV2);
    updateModeFromToggles(v1State, nextV2);
  };

  const updateModeFromToggles = (v1: boolean, v2: boolean) => {
    if (v1 && !v2) setSelectedMode('source1');
    else if (!v1 && v2) setSelectedMode('source2');
    else if (v1 && v2) setSelectedMode('both');
  };

  const currentReadings = getCircuitReadingsForMode(
    v1State && !v2State ? 'source1' : !v1State && v2State ? 'source2' : 'both'
  );

  const verification = getSuperpositionVerification();

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
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Superposition Theorem Mode
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Interactive Circuit Superposition Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify the Superposition Theorem in linear DC networks: Response = Sum of individual source responses
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Theorem Verified: VL = 4V + 1V = 5V</span>
        </div>
      </div>

      {/* Mode Selection Tabs (Section 3: Three Simulation Modes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Mode A Button */}
        <button
          onClick={() => handleSelectMode('source1')}
          className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-2 ${
            selectedMode === 'source1' && v1State && !v2State
              ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-cyan-300">
              MODE A: First Source
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${selectedMode === 'source1' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Source 1 Active (10V)</h4>
            <p className="text-xs text-slate-400 mt-0.5">Source 2 is short-circuited (0V)</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Load Output:</span>
            <span className="text-cyan-300 font-bold">VL = 4V, IL = 4mA</span>
          </div>
        </button>

        {/* Mode B Button */}
        <button
          onClick={() => handleSelectMode('source2')}
          className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-2 ${
            selectedMode === 'source2' && !v1State && v2State
              ? 'bg-purple-500/15 border-purple-400/60 shadow-lg shadow-purple-500/10'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-purple-300">
              MODE B: Second Source
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${selectedMode === 'source2' ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Source 2 Active (5V)</h4>
            <p className="text-xs text-slate-400 mt-0.5">Source 1 is short-circuited (0V)</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Load Output:</span>
            <span className="text-purple-300 font-bold">VL = 1V, IL = 1mA</span>
          </div>
        </button>

        {/* Mode C Button */}
        <button
          onClick={() => handleSelectMode('both')}
          className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-2 ${
            selectedMode === 'both' && v1State && v2State
              ? 'bg-amber-500/15 border-amber-400/60 shadow-lg shadow-amber-500/10'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-300">
              MODE C: Both Sources
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${selectedMode === 'both' ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Both Sources Active</h4>
            <p className="text-xs text-slate-400 mt-0.5">Combined superposition response</p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Load Output:</span>
            <span className="text-amber-400 font-bold">VL = 5V, IL = 5mA</span>
          </div>
        </button>
      </div>

      {/* Main Interactive Circuit Schematic */}
      <CircuitSchematic
        readings={currentReadings}
        onToggleV1={handleToggleV1}
        onToggleV2={handleToggleV2}
      />

      {/* Section 4: Results & Verification Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Superposition Theorem Verification & Results Panel
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mathematical Identity Satisfied
          </span>
        </div>

        {/* Big Mathematical Verification Banner */}
        <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 text-center flex flex-col md:flex-row items-center justify-around gap-6 shadow-inner">
          {/* Voltage Sum */}
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold block">
              Load Voltage Superposition Verification:
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
              VL = V1 + V2 = 4V + 1V = 5V
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              (Theoretical: 5.000 V | Measured: {verification.both.vL.toFixed(3)} V)
            </span>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-800" />

          {/* Current Sum */}
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono text-slate-400 font-semibold block">
              Load Current Superposition Verification:
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
              IL = I1 + I2 = 4mA + 1mA = 5mA
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              (Theoretical: 5.000 mA | Measured: {verification.both.iL.toFixed(3)} mA)
            </span>
          </div>
        </div>

        {/* Detailed Comparative Table */}
        <div className="overflow-x-auto bg-slate-950/60 rounded-2xl border border-slate-800">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                <th className="p-3">Operating Condition</th>
                <th className="p-3">Source 1 (V1)</th>
                <th className="p-3">Source 2 (V2)</th>
                <th className="p-3">Branch 1 (I1)</th>
                <th className="p-3">Branch 2 (I2)</th>
                <th className="p-3 text-amber-300">Load Voltage (VL)</th>
                <th className="p-3 text-amber-300">Load Current (IL)</th>
                <th className="p-3">Load Power</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className={selectedMode === 'source1' ? 'bg-cyan-950/30 font-bold' : ''}>
                <td className="p-3 text-cyan-300">Mode A: Source 1 Alone</td>
                <td className="p-3 text-slate-200">10.0 V (Active)</td>
                <td className="p-3 text-emerald-400">0.0 V (Shorted)</td>
                <td className="p-3 text-slate-300">+6.0 mA</td>
                <td className="p-3 text-slate-300">-2.0 mA</td>
                <td className="p-3 text-cyan-300 font-bold">4.0 V</td>
                <td className="p-3 text-cyan-300 font-bold">4.0 mA</td>
                <td className="p-3 text-slate-400">16.0 mW</td>
              </tr>
              <tr className={selectedMode === 'source2' ? 'bg-purple-950/30 font-bold' : ''}>
                <td className="p-3 text-purple-300">Mode B: Source 2 Alone</td>
                <td className="p-3 text-emerald-400">0.0 V (Shorted)</td>
                <td className="p-3 text-slate-200">5.0 V (Active)</td>
                <td className="p-3 text-slate-300">-1.0 mA</td>
                <td className="p-3 text-slate-300">+2.0 mA</td>
                <td className="p-3 text-purple-300 font-bold">1.0 V</td>
                <td className="p-3 text-purple-300 font-bold">1.0 mA</td>
                <td className="p-3 text-slate-400">1.0 mW</td>
              </tr>
              <tr className="bg-amber-950/20 font-bold">
                <td className="p-3 text-amber-300">Algebraic Sum (A + B)</td>
                <td className="p-3 text-slate-400">—</td>
                <td className="p-3 text-slate-400">—</td>
                <td className="p-3 text-slate-300">5.0 mA</td>
                <td className="p-3 text-slate-300">0.0 mA</td>
                <td className="p-3 text-amber-300 font-black">4.0V + 1.0V = 5.0 V</td>
                <td className="p-3 text-amber-300 font-black">4.0mA + 1.0mA = 5.0 mA</td>
                <td className="p-3 text-slate-400">— (Non-linear)</td>
              </tr>
              <tr className={selectedMode === 'both' ? 'bg-amber-950/40 font-bold' : ''}>
                <td className="p-3 text-amber-400">Mode C: Both Active (Simulated)</td>
                <td className="p-3 text-cyan-300">10.0 V (Active)</td>
                <td className="p-3 text-purple-300">5.0 V (Active)</td>
                <td className="p-3 text-slate-200">+5.0 mA</td>
                <td className="p-3 text-slate-200">0.0 mA</td>
                <td className="p-3 text-amber-400 font-black">5.0 V</td>
                <td className="p-3 text-amber-400 font-black">5.0 mA</td>
                <td className="p-3 text-slate-300">25.0 mW</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step-by-Step Mathematical Derivations */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Step-by-Step Mathematical Proof (Nodal Analysis at Node L)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed text-slate-300">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
              <span className="text-cyan-300 font-bold block">1. First Source Only (V1 = 10V, V2 = 0V):</span>
              <p>R2 (2kΩ) and RL (1kΩ) are in parallel: R_eq = (1k × 2k)/(1k + 2k) = 666.67 Ω.</p>
              <p>Voltage divider with R1 (1kΩ):</p>
              <p className="text-cyan-400 font-bold">V_L1 = 10V × [666.67 / (1000 + 666.67)] = 4.00 V</p>
              <p className="text-cyan-400 font-bold">I_L1 = 4.00V / 1000Ω = 4.00 mA</p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1.5">
              <span className="text-purple-300 font-bold block">2. Second Source Only (V1 = 0V, V2 = 5V):</span>
              <p>R1 (1kΩ) and RL (1kΩ) are in parallel: R_eq = (1k × 1k)/(1k + 1k) = 500 Ω.</p>
              <p>Voltage divider with R2 (2kΩ):</p>
              <p className="text-purple-400 font-bold">V_L2 = 5V × [500 / (2000 + 500)] = 1.00 V</p>
              <p className="text-purple-400 font-bold">I_L2 = 1.00V / 1000Ω = 1.00 mA</p>
            </div>
          </div>

          {/* Superposition Theorem Axiom Note */}
          <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/20 text-xs text-slate-300 leading-relaxed font-sans flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Superposition Theorem Principle:</strong> In any linear bilateral DC electrical network containing multiple independent sources, 
              the total voltage or current across any component equals the algebraic sum of the individual voltages or currents produced by each independent source acting alone, 
              with all other voltage sources replaced by their internal impedances (short circuits for ideal sources).
              <div className="mt-1 text-slate-400">
                <em>Note on Power:</em> Superposition applies to voltage and current (linear quantities), but not directly to power (P = I²R is non-linear: 16 mW + 1 mW = 17 mW ≠ 25 mW).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
