import React, { useState } from 'react';
import { ActiveTab, QubitState, MeasurementResult } from './types/quantum';
import { STATE_ZERO } from './quantum/state';
import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { SimulatorView } from './views/SimulatorView';
import { GatesView } from './views/GatesView';
import { MeasurementLabView } from './views/MeasurementLabView';
import { ProbabilityAnalysisView } from './views/ProbabilityAnalysisView';
import { LearnQuantumView } from './views/LearnQuantumView';
import { AboutProjectView } from './views/AboutProjectView';
import { Atom } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentState, setCurrentState] = useState<QubitState>({ ...STATE_ZERO });
  const [gateHistory, setGateHistory] = useState<string[]>([]);
  const [stateStack, setStateStack] = useState<QubitState[]>([{ ...STATE_ZERO }]);
  const [lastMeasurement, setLastMeasurement] = useState<MeasurementResult | null>(null);

  // State update wrapper that preserves undo history
  const handleUpdateState = (newState: QubitState) => {
    setStateStack(prev => [...prev, { ...currentState }]);
    setCurrentState(newState);
  };

  const handleAddToHistory = (gateSymbol: string) => {
    setGateHistory(prev => [...prev, gateSymbol]);
  };

  const handleUndoGate = () => {
    if (stateStack.length > 1) {
      const newStack = [...stateStack];
      const prevState = newStack.pop()!;
      setStateStack(newStack);
      setCurrentState(prevState);
      setGateHistory(prev => prev.slice(0, -1));
    }
  };

  const handleResetState = () => {
    setCurrentState({ ...STATE_ZERO });
    setGateHistory([]);
    setStateStack([{ ...STATE_ZERO }]);
    setLastMeasurement(null);
  };

  const handleMeasurementOccurred = (result: MeasurementResult) => {
    setLastMeasurement(result);
  };

  return (
    <div className="min-h-screen quantum-grid-bg text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentState={currentState}
        onResetState={handleResetState}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentState={currentState}
            onUpdateState={handleUpdateState}
            onNavigate={setActiveTab}
            onMeasurementOccurred={handleMeasurementOccurred}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            currentState={currentState}
            onUpdateState={handleUpdateState}
            onMeasurementOccurred={handleMeasurementOccurred}
          />
        )}

        {activeTab === 'gates' && (
          <GatesView
            currentState={currentState}
            onUpdateState={handleUpdateState}
            gateHistory={gateHistory}
            onAddToHistory={handleAddToHistory}
            onUndoGate={handleUndoGate}
            onResetCircuit={handleResetState}
          />
        )}

        {activeTab === 'measurement' && (
          <MeasurementLabView
            currentState={currentState}
            onUpdateState={handleUpdateState}
            lastMeasurement={lastMeasurement}
            onMeasurementOccurred={handleMeasurementOccurred}
          />
        )}

        {activeTab === 'probability' && (
          <ProbabilityAnalysisView
            currentState={currentState}
            onUpdateState={handleUpdateState}
          />
        )}

        {activeTab === 'learn' && (
          <LearnQuantumView
            currentState={currentState}
            onUpdateState={handleUpdateState}
            onMeasurementOccurred={handleMeasurementOccurred}
          />
        )}

        {activeTab === 'about' && (
          <AboutProjectView />
        )}
      </main>

      {/* Futuristic Scientific Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">
              QubitLab – Interactive Quantum Superposition Simulator
            </span>
          </div>

          <div className="font-mono text-center sm:text-right text-[11px] text-slate-500">
            First-Year B.Tech VLSI Quantum Technology Microproject • Basic Quantum Tech (BQT)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
