import React from 'react';
import { QubitState } from '../../types/quantum';
import { PulseType } from '../../types/circuit';
import { getProbabilities, formatDiracState } from '../../quantum/state';
import { 
  Zap, 
  Cpu, 
  Activity, 
  Radio, 
  ThermometerSnowflake, 
  ArrowRight,
  Gauge,
  Sparkles,
  Binary
} from 'lucide-react';

interface CircuitSchematicProps {
  qubitState: QubitState;
  activePulse: PulseType;
  isPulseAnimating: boolean;
  isMeasuring: boolean;
  lastMeasurement: 0 | 1 | null;
  measurementCount: number;
  onApplyHadamard: () => void;
  onMeasure: () => void;
  onReset: () => void;
}

export const CircuitSchematic: React.FC<CircuitSchematicProps> = ({
  qubitState,
  activePulse,
  isPulseAnimating,
  isMeasuring,
  lastMeasurement,
  measurementCount,
  onApplyHadamard,
  onMeasure,
  onReset
}) => {
  const { prob0, prob1 } = getProbabilities(qubitState);
  const isSuperposition = Math.abs(prob0 - 0.5) < 0.05 && Math.abs(prob1 - 0.5) < 0.05;
  const isState0 = prob0 > 0.99;
  const isState1 = prob1 > 0.99;

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
      {/* Schematic Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            Physical Superconducting Electrical Control Architecture
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 flex items-center gap-2">
            <span>Microwave Control & Dispersive Readout Circuit</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              15 mK Transmon Qubit
            </span>
          </h3>
        </div>

        {/* Quick Schematic Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onApplyHadamard}
            disabled={isPulseAnimating || isMeasuring}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              isPulseAnimating && activePulse === 'hadamard'
                ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/50'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20 active:scale-95'
            } disabled:opacity-50`}
            title="Generate microwave control pulse for Hadamard gate"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Apply H Pulse</span>
          </button>

          <button
            onClick={onMeasure}
            disabled={isPulseAnimating || isMeasuring}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              isMeasuring
                ? 'bg-amber-500/30 text-amber-200 border-amber-400 ring-2 ring-amber-400/50'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20 active:scale-95'
            } disabled:opacity-50`}
            title="Fire dispersive microwave readout pulse"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Readout (Measure)</span>
          </button>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative w-full aspect-[1000/580] max-h-[580px] bg-slate-950/95 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 1000 580"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="qc-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
            </pattern>

            {/* Glowing cyan drop shadow */}
            <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing amber drop shadow */}
            <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Quantum core intense glow */}
            <filter id="glow-quantum" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients */}
            <linearGradient id="driveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id="readoutLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="cryoStageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.05)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.12)" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="580" fill="url(#qc-grid)" />

          {/* ========================================================
              CRYOGENIC TEMPERATURE ZONES & CHAMBERS
              ======================================================== */}
          {/* Room Temperature Zone (Left & Right tops: 300 K) */}
          <rect x="15" y="15" width="250" height="550" rx="14" fill="#0b1329" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          <rect x="765" y="15" width="220" height="550" rx="14" fill="#0b1329" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" />
          
          <text x="30" y="42" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            ROOM TEMPERATURE (300 K)
          </text>
          <text x="780" y="42" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            CLASSICAL INSTRUMENTATION
          </text>

          {/* Dilution Refrigerator Chamber (Center: 4K down to 15 mK) */}
          <rect x="280" y="15" width="470" height="550" rx="18" fill="url(#cryoStageGrad)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="6 3" />
          
          {/* Dilution Refrigerator Header */}
          <g transform="translate(300, 30)">
            <rect x="0" y="0" width="430" height="26" rx="6" fill="#071226" stroke="#0284c7" strokeWidth="1" />
            <text x="12" y="17" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ❄ DILUTION REFRIGERATOR CRYOSTAT (T_base = 15 mK)
            </text>
            <text x="350" y="17" fill="#0ea5e9" fontSize="10" fontFamily="monospace">
              P &lt; 10⁻⁷ mbar
            </text>
          </g>

          {/* 4 Kelvin Attenuation Stage Plate */}
          <line x1="290" y1="140" x2="740" y2="140" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <text x="300" y="132" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            STAGE 1: 4.2 K (LHe / PULSE TUBE)
          </text>

          {/* 100 mK Still Stage Plate */}
          <line x1="290" y1="230" x2="740" y2="230" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <text x="300" y="222" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            STAGE 2: 100 mK (STILL &amp; COLD PLATE)
          </text>

          {/* Mixing Chamber Stage (15 mK Base Plate) */}
          <rect x="300" y="270" width="430" height="275" rx="12" fill="#030b1e" stroke="#0ea5e9" strokeWidth="1.5" />
          <text x="315" y="292" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            STAGE 3: MIXING CHAMBER BASE (15 mK) • SUPERCONDUCTING ENVIRONMENT
          </text>

          {/* ========================================================
              COMPONENT 1: MICROWAVE CONTROL SIGNAL GENERATOR (AWG)
              ======================================================== */}
          <g transform="translate(30, 80)">
            {/* Chassis */}
            <rect x="0" y="0" width="220" height="150" rx="10" fill="#091428" stroke="#0ea5e9" strokeWidth="1.5" />
            {/* Header bar */}
            <rect x="0" y="0" width="220" height="28" rx="10" fill="#0d213f" />
            <rect x="0" y="18" width="220" height="10" fill="#0d213f" />
            <circle cx="16" cy="14" r="4" fill="#38bdf8" />
            <text x="28" y="18" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
              MICROWAVE AWG GENERATOR
            </text>

            {/* Digital Frequency Display Screen */}
            <rect x="15" y="38" width="190" height="42" rx="6" fill="#020817" stroke="#1e293b" />
            <text x="25" y="54" fill="#64748b" fontSize="9" fontFamily="monospace">
              CARRIER FREQ (f₀₁):
            </text>
            <text x="25" y="72" fill="#38bdf8" fontSize="14" fontFamily="monospace" fontWeight="bold">
              5.0000 GHz
            </text>
            <text x="145" y="70" fill="#22c55e" fontSize="10" fontFamily="monospace">
              [LOCKED]
            </text>

            {/* Waveform Preview / Modulator Indicator */}
            <g transform="translate(15, 90)">
              <rect x="0" y="0" width="190" height="48" rx="6" fill="#050e1f" stroke="#1e293b" />
              <text x="8" y="14" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                PULSE SHAPE: GAUSSIAN π/2 (H)
              </text>
              {/* Gaussian envelope wave */}
              <path
                d="M 10 34 Q 40 34 60 20 Q 95 14 130 20 Q 150 34 180 34"
                fill="none"
                stroke={isPulseAnimating ? "#38bdf8" : "#475569"}
                strokeWidth="2"
              />
              <path
                d="M 60 30 Q 75 16 95 24 Q 115 32 130 24"
                fill="none"
                stroke={isPulseAnimating ? "#a855f7" : "#334155"}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>

            {/* Output Coaxial Connector Port */}
            <rect x="205" y="70" width="18" height="20" rx="3" fill="#cbd5e1" stroke="#475569" />
            <text x="140" y="84" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              RF_OUT ➔
            </text>
          </g>

          {/* ========================================================
              COMPONENT 2: ELECTRICAL CONTROL TRANSMISSION LINE
              ======================================================== */}
          {/* Main Coaxial Transmission line from AWG to Qubit Chip */}
          <path
            d="M 245 160 L 340 160 L 340 360 L 400 360"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 245 160 L 340 160 L 340 360 L 400 360"
            fill="none"
            stroke="url(#driveLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Animated Microwave Pulse flowing along transmission line */}
          {isPulseAnimating && (
            <path
              d="M 245 160 L 340 160 L 340 360 L 400 360"
              fill="none"
              stroke="#00ffff"
              strokeWidth="5"
              strokeDasharray="16 16"
              className="animate-current-flow"
              filter="url(#glow-cyan)"
            />
          )}

          {/* Attenuator 1 at 4.2K Stage (20 dB) */}
          <g transform="translate(320, 150)">
            <rect x="0" y="-12" width="40" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="6" y="3" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">
              -20dB
            </text>
          </g>
          <text x="300" y="190" fill="#64748b" fontSize="8" fontFamily="monospace">
            4K Attenuator
          </text>

          {/* Attenuator 2 at 15mK Stage (30 dB Cold Attenuation) */}
          <g transform="translate(320, 310)">
            <rect x="0" y="-12" width="40" height="24" rx="4" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="6" y="3" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold">
              -30dB
            </text>
          </g>
          <text x="280" y="348" fill="#64748b" fontSize="8" fontFamily="monospace">
            Cold Attenuator
          </text>

          {/* Capacitive coupling to qubit pad (Cc) */}
          <g transform="translate(390, 350)">
            <line x1="5" y1="0" x2="5" y2="20" stroke="#38bdf8" strokeWidth="3" />
            <line x1="15" y1="0" x2="15" y2="20" stroke="#38bdf8" strokeWidth="3" />
            <text x="-4" y="-5" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              C_drive
            </text>
          </g>

          {/* ========================================================
              COMPONENT 3: SUPERCONDUCTING QUANTUM PROCESSOR & QUBIT
              ======================================================== */}
          {/* Chip Substrate Box (Sapphire/Silicon) */}
          <g transform="translate(420, 305)">
            {/* Silicon Chip Die with glow */}
            <rect
              x="0"
              y="0"
              width="150"
              height="180"
              rx="10"
              fill="#06122c"
              stroke={isSuperposition ? "#00f5ff" : isState1 ? "#a855f7" : "#0284c7"}
              strokeWidth={isSuperposition ? 3 : 2}
              filter={isSuperposition || isPulseAnimating ? "url(#glow-quantum)" : undefined}
            />

            {/* Chip Corner Alignment Marks */}
            <rect x="5" y="5" width="8" height="8" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <rect x="137" y="5" width="8" height="8" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <rect x="5" y="167" width="8" height="8" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <rect x="137" y="167" width="8" height="8" fill="none" stroke="#38bdf8" strokeWidth="1" />

            {/* Chip Label */}
            <text x="18" y="22" fill="#94a3b8" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              SUPERCONDUCTING CHIP
            </text>
            <text x="24" y="34" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
              TRANSMON QUBIT Q₀
            </text>

            {/* Ground Plane cutout */}
            <rect x="15" y="42" width="120" height="125" rx="6" fill="#030816" stroke="#1e293b" />

            {/* Transmon Capacitor Island 1 (Top Pad) */}
            <rect
              x="35"
              y="55"
              width="80"
              height="24"
              rx="4"
              fill={isSuperposition ? "#0ea5e9" : isState1 ? "#9333ea" : "#0369a1"}
              stroke="#e0f2fe"
              strokeWidth="1.5"
            />
            <text x="52" y="70" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
              C_shunt (+)
            </text>

            {/* Josephson Junction (JJ) Non-Linear Inductor Symbol ⨉ */}
            <g transform="translate(75, 87)">
              <line x1="0" y1="-8" x2="0" y2="0" stroke="#e0f2fe" strokeWidth="2" />
              {/* Box with cross */}
              <rect x="-8" y="0" width="16" height="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="-8" y1="0" x2="8" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="8" y1="0" x2="-8" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="0" y1="16" x2="0" y2="24" stroke="#e0f2fe" strokeWidth="2" />
              <text x="14" y="12" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                E_J (JJ)
              </text>
            </g>

            {/* Transmon Capacitor Island 2 (Bottom Pad - Grounded) */}
            <rect
              x="35"
              y="119"
              width="80"
              height="24"
              rx="4"
              fill={isSuperposition ? "#0ea5e9" : isState1 ? "#9333ea" : "#0369a1"}
              stroke="#e0f2fe"
              strokeWidth="1.5"
            />
            <text x="52" y="134" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
              C_shunt (-)
            </text>

            {/* Quantum State Aura Badge on Qubit */}
            <g transform="translate(25, 148)">
              <rect
                x="0"
                y="0"
                width="100"
                height="16"
                rx="4"
                fill={isSuperposition ? "rgba(6, 182, 212, 0.25)" : "rgba(15, 23, 42, 0.8)"}
                stroke={isSuperposition ? "#00ffff" : "#334155"}
                strokeWidth="1"
              />
              <text
                x="50"
                y="11"
                fill={isSuperposition ? "#00ffff" : "#e2e8f0"}
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {isSuperposition ? "|ψ⟩ = (|0⟩+|1⟩)/√2" : isState0 ? "STATE: |0⟩" : "STATE: |1⟩"}
              </text>
            </g>
          </g>

          {/* ========================================================
              COMPONENT 4: READOUT RESONATOR & MEASUREMENT CHAIN
              ======================================================== */}
          {/* Coupling capacitor from transmon to readout resonator */}
          <line x1="570" y1="380" x2="595" y2="380" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <text x="572" y="372" fill="#fbbf24" fontSize="8" fontFamily="monospace">
            C_readout
          </text>

          {/* Superconducting Meander Readout Resonator (CPW Cavity at 7.2 GHz) */}
          <g transform="translate(605, 330)">
            <rect x="0" y="0" width="80" height="120" rx="8" fill="#081426" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="8" y="16" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold">
              CPW RESONATOR
            </text>
            <text x="14" y="28" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace">
              f_r = 7.20 GHz
            </text>

            {/* Meander transmission line trace inside resonator */}
            <path
              d="M 15 45 L 65 45 L 65 58 L 15 58 L 15 71 L 65 71 L 65 84 L 15 84 L 15 97 L 65 97"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {isMeasuring && (
              <path
                d="M 15 45 L 65 45 L 65 58 L 15 58 L 15 71 L 65 71 L 65 84 L 15 84 L 15 97 L 65 97"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeDasharray="10 10"
                className="animate-current-flow"
                filter="url(#glow-amber)"
              />
            )}
            <text x="12" y="112" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
              Shift: ±1.8 MHz (χ)
            </text>
          </g>

          {/* Readout Output Line upward through HEMT Amplifier */}
          <path
            d="M 685 390 L 715 390 L 715 160 L 780 160"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 685 390 L 715 390 L 715 160 L 780 160"
            fill="none"
            stroke="url(#readoutLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Animated Readout Pulse flowing upward during measurement */}
          {isMeasuring && (
            <path
              d="M 685 390 L 715 390 L 715 160 L 780 160"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeDasharray="16 16"
              className="animate-current-flow"
              filter="url(#glow-amber)"
            />
          )}

          {/* Cryogenic Low-Noise HEMT Amplifier at 4K Stage */}
          <g transform="translate(695, 140)">
            {/* Triangle amplifier symbol */}
            <polygon points="0,0 35,20 0,40" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <text x="5" y="24" fill="#34d399" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              HEMT
            </text>
          </g>
          <text x="645" y="132" fill="#34d399" fontSize="8" fontFamily="monospace">
            4K Low-Noise Amp (+38dB)
          </text>

          {/* ========================================================
              COMPONENT 5: CLASSICAL OUTPUT & MEASUREMENT ELECTRONICS
              ======================================================== */}
          {/* Room Temp Demodulator & Digitizer */}
          <g transform="translate(780, 80)">
            <rect x="0" y="0" width="190" height="150" rx="10" fill="#091428" stroke="#10b981" strokeWidth="1.5" />
            <rect x="0" y="0" width="190" height="28" rx="10" fill="#06321f" />
            <rect x="0" y="18" width="190" height="10" fill="#06321f" />
            <circle cx="16" cy="14" r="4" fill="#34d399" />
            <text x="28" y="18" fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
              IQ DEMODULATOR &amp; ADC
            </text>

            {/* Demodulator internals */}
            <rect x="15" y="38" width="160" height="42" rx="6" fill="#02140c" stroke="#134e35" />
            <text x="22" y="54" fill="#6ee7b7" fontSize="8.5" fontFamily="monospace">
              PHASE DISCRIMINATOR:
            </text>
            <text x="22" y="70" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {isMeasuring ? "ANALYZING..." : lastMeasurement === 0 ? "θ ≈ 0° (|0⟩)" : lastMeasurement === 1 ? "θ ≈ 180° (|1⟩)" : "READY FOR TONE"}
            </text>

            {/* ADC Sampling rate */}
            <g transform="translate(15, 88)">
              <rect x="0" y="0" width="160" height="50" rx="6" fill="#041a10" stroke="#134e35" />
              <text x="10" y="18" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                ADC SAMPLING: 2.0 GS/s
              </text>
              <text x="10" y="34" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
                THRESHOLD LATCH: DISCRETE BIT
              </text>
            </g>
          </g>

          {/* Wire connecting Digitizer to Classical Register Display */}
          <path
            d="M 875 230 L 875 285"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {lastMeasurement !== null && (
            <path
              d="M 875 230 L 875 285"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-current-flow"
            />
          )}

          {/* CLASSICAL OUTPUT REGISTER DISPLAY */}
          <g transform="translate(780, 285)">
            <rect x="0" y="0" width="190" height="200" rx="12" fill="#040b17" stroke="#38bdf8" strokeWidth="2" />
            {/* Header */}
            <rect x="0" y="0" width="190" height="30" rx="12" fill="#081832" />
            <rect x="0" y="20" width="190" height="10" fill="#081832" />
            <text x="15" y="19" fill="#38bdf8" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
              CLASSICAL BIT REGISTER
            </text>

            {/* Large 7-segment / Digital Outcome Display */}
            <g transform="translate(30, 42)">
              <rect
                x="0"
                y="0"
                width="130"
                height="75"
                rx="8"
                fill="#01040a"
                stroke={lastMeasurement === 0 ? "#00f5ff" : lastMeasurement === 1 ? "#ec4899" : "#334155"}
                strokeWidth="2"
              />
              <text
                x="65"
                y="56"
                fill={lastMeasurement === 0 ? "#00f5ff" : lastMeasurement === 1 ? "#ec4899" : "#475569"}
                fontSize="46"
                fontFamily="monospace"
                fontWeight="900"
                textAnchor="middle"
                filter={lastMeasurement !== null ? "url(#glow-cyan)" : undefined}
              >
                {lastMeasurement !== null ? lastMeasurement : "—"}
              </text>
            </g>

            {/* Classical Bit Indicator LED status */}
            <g transform="translate(20, 130)">
              <text x="0" y="12" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                REGISTER STATUS:
              </text>
              <text
                x="0"
                y="28"
                fill={lastMeasurement !== null ? "#38bdf8" : "#64748b"}
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {lastMeasurement !== null
                  ? `COLLAPSED TO |${lastMeasurement}⟩`
                  : isSuperposition
                  ? "SUPERPOSITION (UNMEASURED)"
                  : "GROUND STATE |0⟩"}
              </text>

              <text x="0" y="46" fill="#64748b" fontSize="8" fontFamily="monospace">
                TOTAL READOUTS: {measurementCount}
              </text>
            </g>

            {/* Reset / Clear Button inside display */}
            <g transform="translate(20, 168)" className="cursor-pointer" onClick={onReset}>
              <rect x="0" y="0" width="150" height="22" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="75" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                [ ↺ RESET QUBIT TO |0⟩ ]
              </text>
            </g>
          </g>

          {/* ========================================================
              BOTTOM SCHEMATIC CAPTION / SIGNAL LEGEND
              ======================================================== */}
          <g transform="translate(30, 520)">
            <rect x="0" y="0" width="720" height="40" rx="8" fill="#081020" stroke="#1e293b" />
            <circle cx="20" cy="20" r="5" fill="#38bdf8" />
            <text x="32" y="23" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Microwave Drive Line (5 GHz)
            </text>

            <circle cx="220" cy="20" r="5" fill="#f59e0b" />
            <text x="232" y="23" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Dispersive Resonator (7.2 GHz)
            </text>

            <circle cx="430" cy="20" r="5" fill="#10b981" />
            <text x="442" y="23" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              HEMT Amplified Readout Line
            </text>

            <circle cx="620" cy="20" r="5" fill="#a855f7" />
            <text x="632" y="23" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Digital Bit Latch
            </text>
          </g>
        </svg>
      </div>

      {/* Real-time State & Probability Indicators Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Qubit Quantum State Dirac Ket */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Quantum State |ψ⟩
            </span>
            <span className="text-sm font-mono font-bold text-cyan-300">
              {formatDiracState(qubitState, 2)}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {isSuperposition ? "Superposition" : isState0 ? "Ground |0⟩" : "Excited |1⟩"}
          </span>
        </div>

        {/* Born Rule Measurement Probabilities */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-center gap-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">P(|0⟩): {(prob0 * 100).toFixed(1)}%</span>
            <span className="text-purple-400 font-bold">P(|1⟩): {(prob1 * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div style={{ width: `${prob0 * 100}%` }} className="bg-cyan-400 transition-all duration-300" />
            <div style={{ width: `${prob1 * 100}%` }} className="bg-purple-500 transition-all duration-300" />
          </div>
        </div>

        {/* Physical Hardware Telemetry */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block">Physical Hardware</span>
            <span className="text-slate-200 font-semibold">T = 15 mK • f₀₁ = 5.0 GHz</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Cryo Coherent
          </span>
        </div>
      </div>
    </div>
  );
};
