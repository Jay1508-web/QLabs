import React from 'react';
import { CircuitBranchReadings } from '../../types/circuit';
import { Zap, Power, ShieldCheck, ArrowRight, Gauge, Activity } from 'lucide-react';

interface CircuitSchematicProps {
  readings: CircuitBranchReadings;
  onToggleV1: () => void;
  onToggleV2: () => void;
}

export const CircuitSchematic: React.FC<CircuitSchematicProps> = ({
  readings,
  onToggleV1,
  onToggleV2
}) => {
  const { v1Active, v2Active, vL, iL, i1, i2, mode } = readings;

  // Current flow animation direction classes
  // i1 flows from left (140) to center (460) if positive
  const i1FlowClass = i1 > 0.05 
    ? 'animate-current-flow text-cyan-400 stroke-cyan-400' 
    : i1 < -0.05 
    ? 'animate-current-flow-reverse text-emerald-400 stroke-emerald-400' 
    : 'stroke-slate-700 opacity-20';

  // i2 flows from right (780) to center (460) if positive (i2 > 0)
  // Our path is drawn from 460 to 780, so if i2 > 0 (right to center), flow is reverse
  const i2FlowClass = i2 > 0.05
    ? 'animate-current-flow-reverse text-purple-400 stroke-purple-400'
    : i2 < -0.05
    ? 'animate-current-flow text-emerald-400 stroke-emerald-400'
    : 'stroke-slate-700 opacity-20';

  // Load current iL flows downward from Node L (100) to ground (420)
  const iLFlowClass = iL > 0.05
    ? 'animate-current-flow text-amber-400 stroke-amber-400'
    : 'stroke-slate-700 opacity-20';

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
      {/* Schematic Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Interactive DC Electrical Network Schematic
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Two-Source Bridge Circuit with Resistor Load (RL = 1kΩ)
          </h3>
        </div>

        {/* Source Switch Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleV1}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              v1Active
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Click to toggle Source 1 on/off"
          >
            <Power className="w-3.5 h-3.5" />
            <span>V1 (10V): {v1Active ? 'ACTIVE' : 'SHORTED'}</span>
          </button>

          <button
            onClick={onToggleV2}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              v2Active
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Click to toggle Source 2 on/off"
          >
            <Power className="w-3.5 h-3.5" />
            <span>V2 (5V): {v2Active ? 'ACTIVE' : 'SHORTED'}</span>
          </button>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative w-full aspect-[920/540] max-h-[520px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 920 540"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="circuit-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Glowing cyan drop shadow */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing purple drop shadow */}
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing amber drop shadow */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="920" height="540" fill="url(#circuit-grid)" />

          {/* ================= BASE WIRES (Grey Static Paths) ================= */}
          {/* Top Rail Left: 140 -> 230 -> Resistor R1 -> 330 -> 460 */}
          <line x1="140" y1="100" x2="230" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="330" y1="100" x2="460" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Top Rail Right: 460 -> 590 -> Resistor R2 -> 690 -> 780 */}
          <line x1="460" y1="100" x2="590" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="690" y1="100" x2="780" y2="100" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Left Vertical Wire: 140,100 -> 140,200 -> Source V1 -> 140,320 -> 140,420 */}
          <line x1="140" y1="100" x2="140" y2="210" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="140" y1="310" x2="140" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Right Vertical Wire: 780,100 -> 780,210 -> Source V2 -> 780,310 -> 780,420 */}
          <line x1="780" y1="100" x2="780" y2="210" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="780" y1="310" x2="780" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Center Vertical Branch: 460,100 -> 460,190 -> RL -> 460,290 -> Ammeter -> 460,420 */}
          <line x1="460" y1="100" x2="460" y2="190" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="460" y1="290" x2="460" y2="340" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <line x1="460" y1="400" x2="460" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Bottom Common Ground Bus: 140,420 -> 460,420 -> 780,420 */}
          <line x1="140" y1="420" x2="780" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Ground Symbol at 460,420 */}
          <line x1="460" y1="420" x2="460" y2="445" stroke="#64748b" strokeWidth="3" />
          <line x1="440" y1="445" x2="480" y2="445" stroke="#64748b" strokeWidth="3" />
          <line x1="448" y1="452" x2="472" y2="452" stroke="#64748b" strokeWidth="2.5" />
          <line x1="454" y1="459" x2="466" y2="459" stroke="#64748b" strokeWidth="2" />
          <text x="460" y="475" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">0V (GND)</text>

          {/* ================= DYNAMIC ANIMATED CURRENT FLOW DASHES ================= */}
          {/* Branch 1 Current Animation: from (140, 420) up to (140, 100) and over to (460, 100) */}
          <path
            d="M 140 420 L 140 100 L 460 100"
            fill="none"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className={i1FlowClass}
          />

          {/* Branch 2 Current Animation: from (460, 100) over to (780, 100) and down to (780, 420) */}
          <path
            d="M 460 100 L 780 100 L 780 420"
            fill="none"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className={i2FlowClass}
          />

          {/* Load Branch Current Animation: downward from (460, 100) to (460, 420) */}
          <path
            d="M 460 100 L 460 420"
            fill="none"
            strokeWidth="4"
            strokeDasharray="8 8"
            className={iLFlowClass}
          />

          {/* Bottom Return Path Animation */}
          {i1 > 0.05 && (
            <path
              d="M 460 420 L 140 420"
              fill="none"
              strokeWidth="3"
              strokeDasharray="8 8"
              className="animate-current-flow stroke-cyan-400"
            />
          )}
          {i2 > 0.05 && (
            <path
              d="M 460 420 L 780 420"
              fill="none"
              strokeWidth="3"
              strokeDasharray="8 8"
              className="animate-current-flow stroke-purple-400"
            />
          )}

          {/* ================= COMPONENT 1: RESISTOR R1 (1kΩ) ================= */}
          <g transform="translate(230, 85)">
            <rect x="0" y="0" width="100" height="30" rx="6" fill="#0f172a" stroke="#00f5ff" strokeWidth="2" />
            {/* Resistor color stripes */}
            <rect x="20" y="3" width="6" height="24" fill="#a855f7" />
            <rect x="40" y="3" width="6" height="24" fill="#38bdf8" />
            <rect x="60" y="3" width="6" height="24" fill="#e2e8f0" />
            <text x="50" y="20" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              R1 = 1kΩ
            </text>
          </g>
          {/* Branch 1 Current Tag */}
          <g transform="translate(240, 50)">
            <rect x="0" y="0" width="80" height="22" rx="6" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="1" />
            <text x="40" y="15" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              I1: {i1 >= 0 ? `+${i1.toFixed(1)}` : i1.toFixed(1)} mA {i1 > 0 ? '→' : i1 < 0 ? '←' : ''}
            </text>
          </g>

          {/* ================= COMPONENT 2: RESISTOR R2 (2kΩ) ================= */}
          <g transform="translate(590, 85)">
            <rect x="0" y="0" width="100" height="30" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <rect x="20" y="3" width="6" height="24" fill="#ec4899" />
            <rect x="40" y="3" width="6" height="24" fill="#a855f7" />
            <rect x="60" y="3" width="6" height="24" fill="#e2e8f0" />
            <text x="50" y="20" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              R2 = 2kΩ
            </text>
          </g>
          {/* Branch 2 Current Tag */}
          <g transform="translate(600, 50)">
            <rect x="0" y="0" width="80" height="22" rx="6" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="1" />
            <text x="40" y="15" fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              I2: {i2 >= 0 ? `+${i2.toFixed(1)}` : i2.toFixed(1)} mA {i2 > 0 ? '←' : i2 < 0 ? '→' : ''}
            </text>
          </g>

          {/* ================= COMPONENT 3: CENTRAL NODE L & LOAD RESISTOR RL (1kΩ) ================= */}
          {/* Central Junction Node L Dot */}
          <circle cx="460" cy="100" r="7" fill="#f59e0b" filter="url(#glow-amber)" />
          <text x="460" y="78" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            NODE L
          </text>

          {/* Load Resistor RL */}
          <g transform="translate(415, 190)">
            <rect x="0" y="0" width="90" height="100" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Internal zigzag graphic */}
            <path
              d="M 45 0 L 45 15 L 25 25 L 65 40 L 25 55 L 65 70 L 45 80 L 45 100"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="5" y="105" width="80" height="20" rx="4" fill="#020617" stroke="#334155" />
            <text x="45" y="119" fill="#fef08a" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              RL = 1kΩ
            </text>
          </g>

          {/* ================= AMMETER IN SERIES WITH LOAD ================= */}
          <g transform="translate(460, 370)">
            <circle cx="0" cy="0" r="22" fill="#020617" stroke="#f59e0b" strokeWidth="2" filter="url(#glow-amber)" />
            <text x="0" y="-4" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A</text>
            <text x="0" y="12" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {iL.toFixed(1)} mA
            </text>
          </g>

          {/* ================= DIGITAL VOLTMETER ACROSS LOAD ================= */}
          {/* Voltmeter Probes */}
          <path d="M 460 140 L 340 140 L 340 220" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="460" cy="140" r="4" fill="#ef4444" />
          <text x="348" y="134" fill="#ef4444" fontSize="10" fontFamily="monospace">+</text>

          <path d="M 460 320 L 340 320 L 340 280" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="460" cy="320" r="4" fill="#3b82f6" />
          <text x="348" y="332" fill="#3b82f6" fontSize="10" fontFamily="monospace">-</text>

          {/* Voltmeter Box Display */}
          <g transform="translate(290, 220)">
            <rect x="0" y="0" width="100" height="60" rx="8" fill="#020617" stroke="#ef4444" strokeWidth="2" filter="url(#glow-amber)" />
            <text x="50" y="16" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">LOAD VOLTMETER</text>
            <text x="50" y="38" fill="#f59e0b" fontSize="18" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {vL.toFixed(2)} V
            </text>
            <text x="50" y="52" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">VL = IR·RL</text>
          </g>

          {/* ================= COMPONENT 4: SOURCE 1 (V1 = 10V) ================= */}
          <g
            transform="translate(140, 260)"
            onClick={onToggleV1}
            className="cursor-pointer group"
          >
            {v1Active ? (
              <>
                {/* Active DC Battery Symbol */}
                <circle cx="0" cy="0" r="38" fill="#020617" stroke="#00f5ff" strokeWidth="3" filter="url(#glow-cyan)" />
                {/* Battery Plates */}
                <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#00f5ff" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="-10" y1="-4" x2="10" y2="-4" stroke="#00f5ff" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="-18" y1="6" x2="18" y2="6" stroke="#00f5ff" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="-10" y1="16" x2="10" y2="16" stroke="#00f5ff" strokeWidth="4.5" strokeLinecap="round" />

                <text x="24" y="-12" fill="#00f5ff" fontSize="13" fontWeight="bold">+</text>
                <text x="24" y="20" fill="#94a3b8" fontSize="13" fontWeight="bold">-</text>

                <rect x="-45" y="46" width="90" height="24" rx="6" fill="#082f49" stroke="#00f5ff" strokeWidth="1" />
                <text x="0" y="62" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  V1 = 10V DC
                </text>
              </>
            ) : (
              <>
                {/* Deactivated / Replaced with Short Circuit */}
                <rect x="-35" y="-35" width="70" height="70" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.5" />
                {/* Solid Short Circuit Wire Passing Straight Through */}
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
                <circle cx="0" cy="0" r="6" fill="#22c55e" />

                <rect x="-55" y="46" width="110" height="24" rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1" />
                <text x="0" y="62" fill="#4ade80" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SHORT CIRCUIT (0V)
                </text>
              </>
            )}
          </g>

          {/* ================= COMPONENT 5: SOURCE 2 (V2 = 5V) ================= */}
          <g
            transform="translate(780, 260)"
            onClick={onToggleV2}
            className="cursor-pointer group"
          >
            {v2Active ? (
              <>
                {/* Active DC Battery Symbol */}
                <circle cx="0" cy="0" r="38" fill="#020617" stroke="#a855f7" strokeWidth="3" filter="url(#glow-purple)" />
                {/* Battery Plates */}
                <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="-10" y1="-4" x2="10" y2="-4" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="-18" y1="6" x2="18" y2="6" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="-10" y1="16" x2="10" y2="16" stroke="#a855f7" strokeWidth="4.5" strokeLinecap="round" />

                <text x="24" y="-12" fill="#a855f7" fontSize="13" fontWeight="bold">+</text>
                <text x="24" y="20" fill="#94a3b8" fontSize="13" fontWeight="bold">-</text>

                <rect x="-45" y="46" width="90" height="24" rx="6" fill="#3b0764" stroke="#a855f7" strokeWidth="1" />
                <text x="0" y="62" fill="#d8b4fe" fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  V2 = 5V DC
                </text>
              </>
            ) : (
              <>
                {/* Deactivated / Replaced with Short Circuit */}
                <rect x="-35" y="-35" width="70" height="70" rx="12" fill="#052e16" stroke="#22c55e" strokeWidth="2.5" />
                {/* Solid Short Circuit Wire Passing Straight Through */}
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
                <circle cx="0" cy="0" r="6" fill="#22c55e" />

                <rect x="-55" y="46" width="110" height="24" rx="6" fill="#052e16" stroke="#22c55e" strokeWidth="1" />
                <text x="0" y="62" fill="#4ade80" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SHORT CIRCUIT (0V)
                </text>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Circuit Real-Time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-cyan-500/20">
          <span className="text-slate-400 block text-[10px] mb-0.5">Source 1 (V1)</span>
          <span className={`text-sm font-bold ${v1Active ? 'text-cyan-300' : 'text-emerald-400'}`}>
            {v1Active ? '10.0 V (Active)' : '0.0 V (Shorted)'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-purple-500/20">
          <span className="text-slate-400 block text-[10px] mb-0.5">Source 2 (V2)</span>
          <span className={`text-sm font-bold ${v2Active ? 'text-purple-300' : 'text-emerald-400'}`}>
            {v2Active ? '5.0 V (Active)' : '0.0 V (Shorted)'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/30">
          <span className="text-slate-400 block text-[10px] mb-0.5">Load Voltage (VL)</span>
          <span className="text-amber-400 text-sm font-bold">
            {vL.toFixed(2)} V
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/30">
          <span className="text-slate-400 block text-[10px] mb-0.5">Load Current (IL)</span>
          <span className="text-amber-400 text-sm font-bold">
            {iL.toFixed(2)} mA
          </span>
        </div>
      </div>
    </div>
  );
};
