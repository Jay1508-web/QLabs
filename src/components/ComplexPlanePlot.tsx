import React from 'react';
import { QubitState } from '../types/quantum';
import { cMag, cPhase, formatComplex } from '../quantum/complex';
import { Compass, Waves } from 'lucide-react';

interface ComplexPlanePlotProps {
  state: QubitState;
}

export const ComplexPlanePlot: React.FC<ComplexPlanePlotProps> = ({ state }) => {
  const alpha = state.alpha;
  const beta = state.beta;

  const magA = cMag(alpha);
  const phaseA = cPhase(alpha);
  const degA = (phaseA * 180) / Math.PI;

  const magB = cMag(beta);
  const phaseB = cPhase(beta);
  const degB = (phaseB * 180) / Math.PI;

  // SVG coordinate transformation
  // Center is (150, 150), Radius scale is 110 pixels for |z| = 1.0
  const cx = 150;
  const cy = 150;
  const scale = 110;

  const ax = cx + alpha.re * scale;
  const ay = cy - alpha.im * scale; // Inverted Y for SVG

  const bx = cx + beta.re * scale;
  const by = cy - beta.im * scale;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Complex Plane (Argand Phasor Diagram)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Amplitudes in ℂ (Real vs Imaginary)
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
        {/* SVG Phasor Display */}
        <div className="relative">
          <svg width="300" height="300" className="bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
            <defs>
              {/* Arrowhead marker for Alpha (Cyan) */}
              <marker
                id="arrow-alpha"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
              </marker>

              {/* Arrowhead marker for Beta (Purple) */}
              <marker
                id="arrow-beta"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
              </marker>
            </defs>

            {/* Grid Circles */}
            <circle cx={cx} cy={cy} r={scale} fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={cx} cy={cy} r={scale * 0.5} fill="none" stroke="#0f172a" strokeWidth="1" />

            {/* Axes */}
            {/* Real Axis (Horizontal) */}
            <line x1="20" y1={cy} x2="280" y2={cy} stroke="#334155" strokeWidth="1.5" />
            {/* Imag Axis (Vertical) */}
            <line x1={cx} y1="20" x2={cx} y2="280" stroke="#334155" strokeWidth="1.5" />

            {/* Axis Labels */}
            <text x="285" y={cy + 4} fill="#64748b" fontSize="10" fontFamily="monospace">Re</text>
            <text x={cx + 6} y="18" fill="#64748b" fontSize="10" fontFamily="monospace">+Im</text>
            <text x={cx + 6} y="292" fill="#64748b" fontSize="10" fontFamily="monospace">-Im</text>

            <text x={cx + scale - 5} y={cy + 14} fill="#475569" fontSize="9" fontFamily="monospace">+1</text>
            <text x={cx - scale - 12} y={cy + 14} fill="#475569" fontSize="9" fontFamily="monospace">-1</text>
            <text x={cx + 8} y={cy - scale + 10} fill="#475569" fontSize="9" fontFamily="monospace">+i</text>
            <text x={cx + 8} y={cy + scale - 4} fill="#475569" fontSize="9" fontFamily="monospace">-i</text>

            {/* Phasor Alpha Vector */}
            {magA > 0.02 && (
              <>
                <line
                  x1={cx}
                  y1={cy}
                  x2={ax}
                  y2={ay}
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow-alpha)"
                />
                <circle cx={ax} cy={ay} r="4" fill="#06b6d4" />
                <text
                  x={ax + (alpha.re >= 0 ? 8 : -20)}
                  y={ay + (alpha.im >= 0 ? -8 : 16)}
                  fill="#06b6d4"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  α
                </text>
              </>
            )}

            {/* Phasor Beta Vector */}
            {magB > 0.02 && (
              <>
                <line
                  x1={cx}
                  y1={cy}
                  x2={bx}
                  y2={by}
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow-beta)"
                />
                <circle cx={bx} cy={by} r="4" fill="#a855f7" />
                <text
                  x={bx + (beta.re >= 0 ? 8 : -20)}
                  y={by + (beta.im >= 0 ? -8 : 16)}
                  fill="#a855f7"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  β
                </text>
              </>
            )}

            {/* Origin */}
            <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
          </svg>
        </div>

        {/* Phasor Coordinates & Angle Metrics */}
        <div className="flex flex-col gap-3 flex-1 w-full max-w-sm">
          {/* Alpha Card */}
          <div className="bg-slate-900/60 rounded-xl p-3.5 border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-cyan-300">Vector α (|0⟩)</span>
              <span className="font-mono text-cyan-400">|α| = {magA.toFixed(3)}</span>
            </div>
            <div className="font-mono text-xs text-slate-200">
              {formatComplex(alpha, 3)}
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1">
              <span>Phase: {degA.toFixed(1)}°</span>
              <span>({phaseA.toFixed(2)} rad)</span>
            </div>
          </div>

          {/* Beta Card */}
          <div className="bg-slate-900/60 rounded-xl p-3.5 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-purple-300">Vector β (|1⟩)</span>
              <span className="font-mono text-purple-400">|β| = {magB.toFixed(3)}</span>
            </div>
            <div className="font-mono text-xs text-slate-200">
              {formatComplex(beta, 3)}
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-1">
              <span>Phase: {degB.toFixed(1)}°</span>
              <span>({phaseB.toFixed(2)} rad)</span>
            </div>
          </div>

          {/* Relative Phase Box */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                Relative Quantum Phase Δφ
              </span>
              <span className="text-xs text-slate-400">φ = arg(β) - arg(α)</span>
            </div>
            <span className="font-mono text-sm font-bold text-amber-300">
              {((degB - degA + 360) % 360).toFixed(1)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
