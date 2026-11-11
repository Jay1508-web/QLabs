import React, { useState } from 'react';
import { QubitState, MeasurementResult } from '../types/quantum';
import { GuidedExperiment } from '../components/GuidedExperiment';
import { 
  BookOpen, 
  Atom, 
  Binary, 
  Waves, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Microchip,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LearnQuantumViewProps {
  currentState: QubitState;
  onUpdateState: (newState: QubitState) => void;
  onMeasurementOccurred: (result: MeasurementResult) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LearnQuantumView: React.FC<LearnQuantumViewProps> = ({
  currentState,
  onUpdateState,
  onMeasurementOccurred
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'textbook' | 'walkthrough' | 'quiz'>('textbook');

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'What is the physical meaning of the normalization condition |α|² + |β|² = 1?',
      options: [
        'The qubit has a finite physical mass equal to 1 Planck mass.',
        'The total probability of measuring either |0⟩ or |1⟩ must strictly equal 100%.',
        'The qubit must be measured at exactly 1 GHz frequency.',
        'The phase angle is constrained between 0 and 1 radian.'
      ],
      correctIndex: 1,
      explanation: 'According to the Born rule, |α|² is P(0) and |β|² is P(1). Because { |0⟩, |1⟩ } form a complete orthonormal basis of the two-state system, the total measurement probability must sum to 1.'
    },
    {
      id: 2,
      question: 'When the Hadamard gate (H) is applied to state |0⟩, what state is produced?',
      options: [
        'State |1⟩ deterministically',
        'An undefined, destroyed quantum state',
        'An equal positive superposition state |+⟩ = (|0⟩ + |1⟩) / √2',
        'A classical random bit generator'
      ],
      correctIndex: 2,
      explanation: 'Hadamard maps the computational basis states into diagonal superposition states: H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2.'
    },
    {
      id: 3,
      question: 'How does the Pauli-Z gate affect the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2?',
      options: [
        'It changes the measurement probabilities to 100% |0⟩.',
        'It shifts the relative phase of |1⟩ by π, producing |-⟩ = (|0⟩ - |1⟩)/√2 while leaving computational measurement probabilities unchanged (50% / 50%).',
        'It collapses the state irreversibly into state |1⟩.',
        'It turns the qubit into an entangled Bell pair.'
      ],
      correctIndex: 1,
      explanation: 'Pauli-Z maps |0⟩ → |0⟩ and |1⟩ → -|1⟩. On |+⟩, it yields |-⟩. Because |1/√2|² = |-1/√2|² = 0.5, direct measurement in the Z basis still gives 50%/50%, but the relative phase changes.'
    },
    {
      id: 4,
      question: 'What happens to a qubit in superposition when it undergoes a measurement in the computational basis?',
      options: [
        'It remains in superposition while outputting a copy of itself.',
        'It produces a continuous real number between 0.0 and 1.0.',
        'Its wavefunction collapses instantaneously into an eigenstate (|0⟩ or |1⟩), destroying the superposition.',
        'It reflects backwards in time.'
      ],
      correctIndex: 2,
      explanation: 'In the Copenhagen interpretation, measurement is a non-unitary projection operator. The wavefunction collapses into a definite eigenstate with probability given by the Born rule.'
    },
    {
      id: 5,
      question: 'Why are quantum gates represented by unitary matrices (U†U = I)?',
      options: [
        'To ensure that total probability is conserved and operations are reversible in closed quantum systems.',
        'Because non-unitary matrices cannot be written in Python or C++.',
        'To force qubits to operate only at room temperature.',
        'To prevent measurement from ever occurring.'
      ],
      correctIndex: 0,
      explanation: 'Unitary matrices preserve the inner product and norm of state vectors, guaranteeing that |α|² + |β|² = 1 is strictly conserved under time evolution.'
    }
  ];

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Understand Quantum Superposition</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Core theoretical foundations for first-year B.Tech VLSI Quantum Technology students
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('textbook')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'textbook'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Core Textbook
          </button>
          <button
            onClick={() => setActiveSubTab('walkthrough')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'walkthrough'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Walkthrough
          </button>
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'quiz'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Knowledge Check Quiz
          </button>
        </div>
      </div>

      {/* View 1: Guided Experiment Walkthrough */}
      {activeSubTab === 'walkthrough' && (
        <GuidedExperiment
          currentState={currentState}
          onUpdateState={onUpdateState}
          onMeasurementOccurred={onMeasurementOccurred}
        />
      )}

      {/* View 2: Interactive Quiz */}
      {activeSubTab === 'quiz' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Quantum Superposition Concept Evaluation</span>
              </h3>
              <p className="text-xs text-slate-400">
                5 Multiple-Choice Questions mapped to university quantum technology syllabi
              </p>
            </div>

            {showResults && (
              <div className="px-4 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                Score: {calculateScore()} / {quizQuestions.length} ({((calculateScore() / quizQuestions.length) * 100).toFixed(0)}%)
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700';

                      if (showResults) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-950/60 text-rose-300 border-rose-500/60';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl text-xs text-left border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setShowResults(false);
                setSelectedAnswers({});
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 transition"
            >
              Reset Quiz
            </button>

            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
            >
              Submit & Check Answers
            </button>
          </div>
        </div>
      )}

      {/* View 3: Comprehensive Textbook Modules */}
      {activeSubTab === 'textbook' && (
        <div className="flex flex-col gap-6">
          {/* Module 1: Classical Bit vs Qubit */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Binary className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">
                1. What is a Qubit? (Classical Bit vs Quantum Bit)
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              In conventional microelectronics and VLSI systems, a classical bit is implemented using 
              voltage levels across CMOS transistors (e.g., 0V represents logical <strong>0</strong>, 
              and +1.2V represents logical <strong>1</strong>). A classical bit can only ever exist in one 
              of these two discrete mutually exclusive states at any given moment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-mono font-bold text-slate-400 block mb-1">
                  Classical Bit
                </span>
                <p className="text-xs text-slate-300">
                  State Space: Discrete set {'{ 0, 1 }'}. No superposition, no interference, no phase. 
                  Readout is deterministic and non-destructive.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-cyan-500/30">
                <span className="text-xs uppercase font-mono font-bold text-cyan-300 block mb-1">
                  Quantum Qubit
                </span>
                <p className="text-xs text-slate-300">
                  State Space: Continuous two-dimensional complex Hilbert space ℂ². Represented by state 
                  vector |ψ⟩ = α|0⟩ + β|1⟩ on the surface of the Bloch sphere.
                </p>
              </div>
            </div>
          </div>

          {/* Module 2: The Principle of Superposition */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Waves className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">
                2. What is Quantum Superposition?
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              According to the first postulate of quantum mechanics, if a quantum system can exist in state 
              |0⟩ and in state |1⟩, it can also exist in any arbitrary linear combination:
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-500/30 text-center font-mono text-cyan-300 text-lg font-bold my-1">
              |ψ⟩ = α|0⟩ + β|1⟩, &emsp; with α, β ∈ ℂ
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Superposition is a fundamental property of wave mechanics. Just as acoustic waves or electromagnetic 
              waves in optical waveguides can superpose to form constructive and destructive interference patterns, 
              quantum probability waves superpose coherently. This allows quantum algorithms to evaluate functions on 
              multiple inputs simultaneously.
            </p>
          </div>

          {/* Module 3: Complex Probability Amplitudes & Normalization */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                3. What are Probability Amplitudes? (The Normalization Condition)
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The coefficients <span className="font-mono text-cyan-300 font-bold">α</span> and{' '}
              <span className="font-mono text-purple-300 font-bold">β</span> are not classical probabilities; 
              they are <strong>complex probability amplitudes</strong>. A complex number has both a magnitude 
              and a phase:
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center font-mono text-slate-200 text-sm my-1">
              α = a + bi = |α| e^(i θ_α), &emsp; β = c + di = |β| e^(i θ_β)
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Because the qubit must be found in either state |0⟩ or |1⟩ upon measurement, the sum of probabilities 
              must strictly equal 1. This gives the fundamental <strong>Normalization Identity</strong>:
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 text-center font-mono text-emerald-300 text-base font-bold my-1">
              |α|² + |β|² = 1 &emsp; (a² + b² + c² + d² = 1)
            </div>
          </div>

          {/* Module 4: The Born Rule & Measurement Collapse */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Atom className="w-6 h-6 text-rose-400" />
              <h3 className="text-lg font-bold text-white">
                4. What Happens During Quantum Measurement? (The Born Rule)
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formulated by Max Born in 1926, the <strong>Born Rule</strong> establishes the bridge between 
              the mathematical quantum state and physical laboratory measurements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-center text-sm my-1">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-cyan-500/30 text-cyan-300 font-bold">
                Probability of Outcome 0: P(0) = |α|²
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-purple-500/30 text-purple-300 font-bold">
                Probability of Outcome 1: P(1) = |β|²
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Wavefunction Collapse:</strong> Measurement is fundamentally non-unitary. When the measurement 
              apparatus registers outcome |0⟩, the qubit state instantly collapses to |0⟩. All superposition information 
              and relative phase are irreversibly erased.
            </p>
          </div>

          {/* Module 5: Quantum Gates */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                5. What are Quantum Gates?
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Quantum gates are physical operations that rotate the state vector on the Bloch sphere without collapsing it. 
              Mathematically, they are represented by 2×2 unitary matrices satisfying U†U = I.
            </p>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div>• <strong>Hadamard (H):</strong> H|0⟩ = (|0⟩ + |1⟩)/√2. Converts basis states into equal superpositions.</div>
              <div>• <strong>Pauli-X:</strong> X|0⟩ = |1⟩, X|1⟩ = |0⟩. The quantum NOT gate.</div>
              <div>• <strong>Pauli-Z:</strong> Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Inverts the relative phase by π.</div>
              <div>• <strong>Identity (I):</strong> I|ψ⟩ = |ψ⟩. Leaves the state invariant.</div>
            </div>
          </div>

          {/* Module 6: VLSI and Physical Hardware Realization */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Microchip className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">
                6. VLSI Realization: How Are Qubits Physically Built on Silicon?
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              In modern semiconductor VLSI technology, physical qubits are fabricated using cleanroom lithography:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 font-mono block">Silicon Spin Qubits</span>
                <p className="text-slate-300">
                  Fabricated in standard silicon CMOS foundries using gate-defined quantum dots. 
                  Individual electron spins represent |0⟩ (spin up) and |1⟩ (spin down).
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-purple-400 font-mono block">Superconducting Transmons</span>
                <p className="text-slate-300">
                  Aluminum or niobium thin films with Josephson tunnel junctions (non-linear inductors) 
                  forming macroscopic artificial atoms controlled by microwave pulses at 15 mK.
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="font-bold text-amber-400 font-mono block">Photonic Integrated Circuits</span>
                <p className="text-slate-300">
                  Silicon nitride (SiN) or lithium niobate on insulator (LNOI) waveguides encoding 
                  qubits in the polarization or path of single photons.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
