import React from 'react';
import { QubitState } from '../types/quantum';
import { getProbabilities } from '../quantum/state';
import { BarChart3, Binary, Scale } from 'lucide-react';

interface ProbabilityBarProps {
  state: QubitState;
  showDetails?: boolean;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ state, showDetails = true }) => {
  const { prob0, prob1 } = getProbabilities(state);
  const p0Percent = prob0 * 100;
  const p1Percent = prob1 * 100;

  const isEqualSuperposition = Math.abs(p0Percent - 50) < 0.2;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Computational Basis Probability Distribution
          </h3>
        </div>
        {isEqualSuperposition && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30 animate-pulse">
            <Scale className="w-3 h-3" />
            Equal Superposition (50% / 50%)
          </span>
        )}
      </div>

      {/* Main Combined Probability Bar with Glow */}
      <div className="space-y-2">
        <div className="h-6 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800/80 p-0.5 shadow-inner">
          {/* Outcome |0> Bar */}
          <div
            style={{ width: `${p0Percent}%` }}
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-l-lg transition-all duration-300 relative group"
          >
            {p0Percent > 12 && (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-slate-950">
                {p0Percent.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Outcome |1> Bar */}
          <div
            style={{ width: `${p1Percent}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-r-lg transition-all duration-300 relative group"
          >
            {p1Percent > 12 && (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-white">
                {p1Percent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Legend / Amplitudes */}
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
            <span className="font-semibold text-cyan-300">|0⟩ Ground State:</span>
            <span className="text-slate-100 font-bold">{p0Percent.toFixed(1)}%</span>
            <span className="text-slate-400 text-[11px]">(|α|² = {prob0.toFixed(3)})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">(|β|² = {prob1.toFixed(3)})</span>
            <span className="text-slate-100 font-bold">{p1Percent.toFixed(1)}%</span>
            <span className="font-semibold text-purple-300">:Excited State |1⟩</span>
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></div>
          </div>
        </div>
      </div>

      {/* Two Comparative Meter Cards */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* |0> Outcome Meter */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-cyan-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-300 font-bold text-base flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-cyan-400" />
                Outcome |0⟩
              </span>
              <span className="font-mono font-bold text-cyan-300 text-lg">
                {p0Percent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${p0Percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Born rule: P(0) = |α|²</span>
              <span>Fraction: {prob0.toFixed(4)}</span>
            </div>
          </div>

          {/* |1> Outcome Meter */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-purple-500/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-300 font-bold text-base flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-purple-400" />
                Outcome |1⟩
              </span>
              <span className="font-mono font-bold text-purple-300 text-lg">
                {p1Percent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${p1Percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Born rule: P(1) = |β|²</span>
              <span>Fraction: {prob1.toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
