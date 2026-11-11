import React from 'react';
import { QubitState } from '../types/quantum';
import { stateToBloch, blochToState, formatDiracState, getProbabilities } from '../quantum/state';
import { formatComplex, cMag, cMagSq } from '../quantum/complex';
import { Sliders, Sparkles, CheckCircle2, Info } from 'lucide-react';

interface StateMathCardProps {
  state: QubitState;
  onStateChange: (newState: QubitState) => void;
}

export const StateMathCard: React.FC<StateMathCardProps> = ({ state, onStateChange }) => {
  const bloch = stateToBloch(state);
  const { prob0, prob1 } = getProbabilities(state);

  const thetaDeg = (bloch.theta * 180) / Math.PI;
  const phiDeg = (bloch.phi * 180) / Math.PI;

  const handleThetaChange = (newDeg: number) => {
    const newRad = (newDeg * Math.PI) / 180;
    onStateChange(blochToState(newRad, bloch.phi));
  };

  const handlePhiChange = (newDeg: number) => {
    const newRad = (newDeg * Math.PI) / 180;
    onStateChange(blochToState(bloch.theta, newRad));
  };

  const magAlpha = cMag(state.alpha);
  const magBeta = cMag(state.beta);
  const normSum = prob0 + prob1;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5 border border-cyan-500/20 shadow-xl">
      {/* Title & Live State Dirac Formula */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Live Quantum State Equation
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Normalized (|α|²+|β|² = {normSum.toFixed(4)})
          </span>
        </div>

        {/* Big Dirac Formula Display */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-center font-mono text-cyan-200 text-lg md:text-xl font-bold tracking-wide shadow-inner overflow-x-auto">
          |ψ⟩ = {formatDiracState(state, 3)}
        </div>
      </div>

      {/* Probability Amplitudes Detailed Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Alpha Amplitude Box */}
        <div className="bg-slate-900/60 rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-cyan-300">Amplitude α (|0⟩ state)</span>
            <span className="font-mono text-cyan-400">P(0) = {(prob0 * 100).toFixed(1)}%</span>
          </div>
          <div className="font-mono text-sm text-slate-100 font-medium">
            α = {formatComplex(state.alpha, 3)}
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
            <span>|α| = {magAlpha.toFixed(3)}</span>
            <span>|α|² = {cMagSq(state.alpha).toFixed(3)}</span>
          </div>
        </div>

        {/* Beta Amplitude Box */}
        <div className="bg-slate-900/60 rounded-xl p-3.5 border border-purple-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-purple-300">Amplitude β (|1⟩ state)</span>
            <span className="font-mono text-purple-400">P(1) = {(prob1 * 100).toFixed(1)}%</span>
          </div>
          <div className="font-mono text-sm text-slate-100 font-medium">
            β = {formatComplex(state.beta, 3)}
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
            <span>|β| = {magBeta.toFixed(3)}</span>
            <span>|β|² = {cMagSq(state.beta).toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Bloch Coordinates Grid */}
      <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
          <span className="font-semibold text-slate-300">Bloch Vector Coordinates (S²)</span>
          <span className="text-[11px] font-mono text-slate-400">r⃗ = (x, y, z)</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] mb-0.5">X = sinθ cosφ</span>
            <span className="text-purple-300 font-semibold">{bloch.x.toFixed(3)}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] mb-0.5">Y = sinθ sinφ</span>
            <span className="text-emerald-300 font-semibold">{bloch.y.toFixed(3)}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] mb-0.5">Z = cosθ</span>
            <span className="text-cyan-300 font-semibold">{bloch.z.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Manual Angle Sliders (Theta & Phi) */}
      <div className="flex flex-col gap-3.5 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>State Angle Adjustments</span>
          </div>
          <span className="text-[11px] text-slate-400">Polar representation</span>
        </div>

        {/* Polar Angle Theta Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">θ (Polar angle, controls |0⟩ vs |1⟩ ratio):</span>
            <span className="text-cyan-400 font-semibold">{thetaDeg.toFixed(1)}° ({bloch.theta.toFixed(2)} rad)</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            step="0.5"
            value={thetaDeg}
            onChange={(e) => handleThetaChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0° (|0⟩ Pole)</span>
            <span>90° (Equator Superposition)</span>
            <span>180° (|1⟩ Pole)</span>
          </div>
        </div>

        {/* Azimuthal Phase Angle Phi Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300">φ (Azimuthal relative phase angle):</span>
            <span className="text-amber-400 font-semibold">{phiDeg.toFixed(1)}° ({bloch.phi.toFixed(2)} rad)</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={phiDeg}
            onChange={(e) => handlePhiChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0° (|+⟩ real)</span>
            <span>90° (|+i⟩ imag)</span>
            <span>180° (|-⟩ real)</span>
            <span>270° (|-i⟩ imag)</span>
            <span>360°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
