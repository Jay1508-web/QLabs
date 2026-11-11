import React from 'react';
import { ActiveTab, QubitState } from '../types/quantum';
import { formatDiracState } from '../quantum/state';
import { 
  Atom, 
  LayoutDashboard, 
  Orbit, 
  Cpu, 
  Gauge, 
  BarChart3, 
  BookOpen, 
  Info, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentState: QubitState;
  onResetState: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentState,
  onResetState
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Qubit Simulator', icon: Orbit },
    { id: 'gates', label: 'Quantum Gates', icon: Cpu },
    { id: 'measurement', label: 'Measurement Lab', icon: Gauge },
    { id: 'probability', label: 'Probability Analysis', icon: BarChart3 },
    { id: 'learn', label: 'Learn Quantum', icon: BookOpen },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/85 backdrop-blur-xl border-b border-cyan-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Project Title */}
          <div
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400 transition-all">
              <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '18s' }} />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 filter blur-sm group-hover:bg-cyan-400/20 transition"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                  QubitLab
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  B.Tech VLSI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Quantum Superposition Simulator
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & Reset Button */}
          <div className="flex items-center gap-2.5">
            {/* Quick State Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-400">State:</span>
              <span className="text-cyan-300 font-semibold max-w-[120px] truncate" title={formatDiracState(currentState, 3)}>
                {formatDiracState(currentState, 2)}
              </span>
            </div>

            {/* Reset State Button */}
            <button
              onClick={onResetState}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all active:scale-95"
              title="Reset qubit to ground state |0⟩"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset |0⟩</span>
            </button>
          </div>
        </div>

        {/* Mobile Scrolling Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
