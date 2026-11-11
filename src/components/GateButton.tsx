import React from 'react';
import { QuantumGate } from '../types/quantum';
import { formatComplex } from '../quantum/complex';

interface GateButtonProps {
  gate: QuantumGate;
  onApply: (gate: QuantumGate) => void;
  variant?: 'primary' | 'secondary' | 'compact';
}

export const GateButton: React.FC<GateButtonProps> = ({ gate, onApply, variant = 'primary' }) => {
  const getBadgeColor = () => {
    switch (gate.category) {
      case 'superposition':
        return 'border-cyan-500/50 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-sm shadow-cyan-500/20';
      case 'pauli':
        return 'border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 shadow-sm shadow-purple-500/20';
      case 'phase':
        return 'border-amber-500/50 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400 shadow-sm shadow-amber-500/20';
      case 'rotation':
        return 'border-emerald-500/50 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 shadow-sm shadow-emerald-500/20';
      default:
        return 'border-slate-700 text-slate-300 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-500';
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={() => onApply(gate)}
        className={`px-3 py-2 rounded-xl font-mono text-sm font-bold border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${getBadgeColor()}`}
        title={`${gate.name}: ${gate.description}`}
      >
        <span className="text-base">{gate.symbol}</span>
      </button>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between gap-3 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl font-mono font-bold text-lg flex items-center justify-center border ${getBadgeColor()}`}>
            {gate.symbol}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
              {gate.name}
            </h4>
            <span className="text-[10px] uppercase font-mono text-slate-500">
              {gate.category}
            </span>
          </div>
        </div>

        <button
          onClick={() => onApply(gate)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all active:scale-95 shadow-sm shadow-cyan-500/20"
        >
          Apply
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2">
        {gate.description}
      </p>

      {/* Matrix Display */}
      <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 font-mono text-xs text-slate-300">
        <div className="flex items-center justify-center gap-2">
          <span className="text-slate-500 text-lg">⎡</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-center">
            <span>{formatComplex(gate.matrix[0][0], 2)}</span>
            <span>{formatComplex(gate.matrix[0][1], 2)}</span>
            <span>{formatComplex(gate.matrix[1][0], 2)}</span>
            <span>{formatComplex(gate.matrix[1][1], 2)}</span>
          </div>
          <span className="text-slate-500 text-lg">⎦</span>
        </div>
      </div>
    </div>
  );
};
