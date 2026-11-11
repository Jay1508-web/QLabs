import React, { useState } from 'react';
import { QubitState, ShotResult } from '../types/quantum';
import { runShotsSimulation } from '../quantum/measurement';
import { Play, RotateCcw, BarChart2, Activity, Percent, Sigma } from 'lucide-react';

interface ShotHistogramProps {
  state: QubitState;
  onShotCompleted?: (result: ShotResult) => void;
}

export const ShotHistogram: React.FC<ShotHistogramProps> = ({ state, onShotCompleted }) => {
  const [shotCount, setShotCount] = useState<number>(1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ShotResult | null>(null);

  const shotOptions = [10, 100, 500, 1000, 5000];

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Smooth micro-delay to give realistic visual feedback of quantum sampling
    setTimeout(() => {
      const res = runShotsSimulation(state, shotCount);
      setResult(res);
      setIsRunning(false);
      if (onShotCompleted) {
        onShotCompleted(res);
      }
    }, 250);
  };

  const maxCount = result ? Math.max(result.count0, result.count1, 1) : 1;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Multiple Measurements Engine (Shots Simulator)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Repeated independent measurements on freshly prepared copies of the current state |ψ⟩
          </p>
        </div>

        {/* Shot Count Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Shots:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {shotOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setShotCount(opt)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  shotCount === opt
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Sampling...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Main Histogram Visualization */}
      {result ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Outcome |0> Bar Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold text-sm">Outcome |0⟩</span>
                <span className="text-slate-300 font-bold">{result.count0} counts ({ (result.empiricalProb0 * 100).toFixed(1) }%)</span>
              </div>

              {/* Vertical / Horizontal Bar Graphic */}
              <div className="h-28 bg-slate-950/80 rounded-xl p-3 border border-cyan-500/20 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-lg transition-all duration-500 shadow-md shadow-cyan-500/20 relative"
                  style={{ height: `${(result.count0 / maxCount) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-cyan-300">
                    {result.count0}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Theoretical: {(result.theoreticalProb0 * 100).toFixed(1)}%</span>
                <span className={result.absoluteError0 < 0.03 ? 'text-emerald-400' : 'text-amber-400'}>
                  Error: {(result.absoluteError0 * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Outcome |1> Bar Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-bold text-sm">Outcome |1⟩</span>
                <span className="text-slate-300 font-bold">{result.count1} counts ({ (result.empiricalProb1 * 100).toFixed(1) }%)</span>
              </div>

              <div className="h-28 bg-slate-950/80 rounded-xl p-3 border border-purple-500/20 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all duration-500 shadow-md shadow-purple-500/20 relative"
                  style={{ height: `${(result.count1 / maxCount) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-purple-300">
                    {result.count1}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Theoretical: {(result.theoreticalProb1 * 100).toFixed(1)}%</span>
                <span className={result.absoluteError1 < 0.03 ? 'text-emerald-400' : 'text-amber-400'}>
                  Error: {(result.absoluteError1 * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Statistical Analysis Table */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 overflow-x-auto">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
              <Sigma className="w-3.5 h-3.5 text-cyan-400" />
              Statistical Verification & Law of Large Numbers
            </h4>
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">State</th>
                  <th className="pb-2">Counts</th>
                  <th className="pb-2">Empirical (f)</th>
                  <th className="pb-2">Theoretical (P)</th>
                  <th className="pb-2">Absolute Dev. |f - P|</th>
                  <th className="pb-2">Binomial SE (σ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr>
                  <td className="py-2 text-cyan-300 font-bold">|0⟩</td>
                  <td className="py-2 text-slate-100">{result.count0}</td>
                  <td className="py-2 text-cyan-400">{(result.empiricalProb0).toFixed(4)}</td>
                  <td className="py-2 text-slate-300">{(result.theoreticalProb0).toFixed(4)}</td>
                  <td className="py-2 text-slate-300">{(result.absoluteError0).toFixed(4)}</td>
                  <td className="py-2 text-slate-400">±{(result.standardError).toFixed(4)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-purple-300 font-bold">|1⟩</td>
                  <td className="py-2 text-slate-100">{result.count1}</td>
                  <td className="py-2 text-purple-400">{(result.empiricalProb1).toFixed(4)}</td>
                  <td className="py-2 text-slate-300">{(result.theoreticalProb1).toFixed(4)}</td>
                  <td className="py-2 text-slate-300">{(result.absoluteError1).toFixed(4)}</td>
                  <td className="py-2 text-slate-400">±{(result.standardError).toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Individual Samples Bead Stream (Visual representation of first 50 shots) */}
          {result.individualOutcomes && result.individualOutcomes.length > 0 && (
            <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">
                Sample Sequence (First {result.individualOutcomes.length} independent shots):
              </span>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {result.individualOutcomes.map((bit, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                      bit === 0
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-500 flex flex-col items-center gap-2">
          <BarChart2 className="w-8 h-8 text-slate-600 animate-pulse" />
          <p className="text-xs">Click "Run Simulation" to execute {shotCount} quantum shots on state |ψ⟩</p>
        </div>
      )}
    </div>
  );
};
