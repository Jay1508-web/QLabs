import React from 'react';
import { 
  Info, 
  Atom, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  Microchip, 
  FileCode,
  Layers,
  Award
} from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Info className="w-6 h-6 text-cyan-400" />
            <span>About QubitLab Microproject</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Academic specifications, curriculum mapping, and local setup guide
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
          <Award className="w-4 h-4" />
          <span>B.Tech VLSI Quantum Technology</span>
        </div>
      </div>

      {/* Official Project Metadata Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl flex flex-col gap-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-400 block mb-1">
            Official Microproject Declaration
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Interactive Digital Simulation of Quantum Superposition Using a Single Qubit
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 block">Project Title</span>
            <span className="text-sm font-bold text-cyan-200 block">
              Interactive Digital Simulation of Quantum Superposition Using a Single Qubit
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 block">Technology</span>
            <span className="text-sm font-bold text-purple-200 block">
              Quantum Computing Simulation (WebGL 3D, TypeScript, React)
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 block">Academic Domain</span>
            <span className="text-sm font-bold text-emerald-200 block">
              Quantum Technology / VLSI (Basic Quantum Tech - BQT)
            </span>
          </div>
        </div>
      </div>

      {/* Microproject Core Objectives & Achievements */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Microproject Core Objectives Achieved</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>1. Rigorous Complex State Representation</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Implemented mathematically rigorous complex numbers (α = a + bi, β = c + di) and verified 
              normalization condition |α|² + |β|² = 1 at all times.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>2. Interactive 3D Bloch Sphere</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Mapped 2D complex Hilbert space ℂ² to the 3D unit sphere S² with smooth slerp vector rotation, 
              phase projections, and orbit navigation using Three.js.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-purple-400 font-bold font-mono">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>3. Exact Unitary Gate Operations</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Programmed 2×2 unitary matrix multiplication for Hadamard (H), Pauli-X, Y, Z, Phase (S), T, and Euler 
              rotations with automated unitary checks (U†U = I).
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-purple-400 font-bold font-mono">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>4. Born Rule & Multi-Shot Sampling</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Implemented non-unitary wavefunction collapse for single-shot measurements and up to 5,000 independent 
              Monte Carlo shots to demonstrate the Law of Large Numbers.
            </p>
          </div>
        </div>
      </div>

      {/* Local Setup & Instructions for Running Locally */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Local Setup & Execution Guide</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Follow these quick steps to run this application on any Windows, macOS, or Linux machine for your college presentation:
        </p>

        <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 font-mono text-xs text-slate-300 space-y-4 shadow-inner">
          <div>
            <span className="text-slate-500 block mb-1"># 1. Navigate to the project directory</span>
            <div className="text-cyan-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              cd qubit-lab
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-1"># 2. Install dependencies (Node.js 18+ required)</span>
            <div className="text-cyan-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              npm install
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-1"># 3. Start local development server with hot-module reload</span>
            <div className="text-cyan-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              npm run dev
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-1"># 4. Open in browser</span>
            <div className="text-emerald-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              http://localhost:5173
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-1"># 5. Build for production deployment</span>
            <div className="text-purple-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              npm run build
            </div>
          </div>
        </div>
      </div>

      {/* Academic References */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col gap-3 text-xs text-slate-400">
        <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Key Scientific References</span>
        </span>
        <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed font-sans">
          <li>Michael A. Nielsen and Isaac L. Chuang, <em>Quantum Computation and Quantum Information</em> (Cambridge University Press).</li>
          <li>David J. Griffiths and Darrell F. Schroeter, <em>Introduction to Quantum Mechanics</em> (3rd Edition).</li>
          <li>Basic Quantum Technology (BQT) Course Modules 1 & 2 Syllabus, B.Tech VLSI Program.</li>
        </ul>
      </div>
    </div>
  );
};
