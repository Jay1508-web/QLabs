# QubitLab – Interactive Quantum Superposition Simulator

**Project Title:** Interactive Digital Simulation of Quantum Superposition Using a Single Qubit  
**Academic Domain:** Quantum Technology / VLSI Microproject  
**Course Context:** Basic Quantum Technology (BQT - Modules 1 & 2)  
**Technology Stack:** React 19, TypeScript, Three.js (WebGL 3D), Tailwind CSS v4, Lucide Icons, Canvas Confetti, Vite  

---

## 🌌 1. Project Overview & Objectives

**QubitLab** is an educational quantum simulator designed for first-year B.Tech students in VLSI Quantum Technology. It visually and mathematically demonstrates the core principles of quantum mechanics on a single qubit:

1. **State Vector Representation:** How a quantum state is represented as a linear combination of basis vectors $|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$ in a 2D complex Hilbert space $\mathbb{C}^2$.
2. **Geometric Visualization:** How the complex projective Hilbert space $\mathbb{C}P^1$ maps onto the 3D unit sphere $S^2$ (**The Bloch Sphere**).
3. **Unitary Transformations:** How quantum logic gates act as norm-preserving $2 \times 2$ unitary operators ($U^\dagger U = I$).
4. **Quantum Measurement:** How the Born rule determines probabilistic outcomes $P(0) = |\alpha|^2$ and $P(1) = |\beta|^2$, triggering non-unitary **wavefunction collapse**.
5. **Statistical Verification:** How repeated independent shots converge to theoretical probabilities in accordance with the Law of Large Numbers.

---

## ⚡ 2. Key Features

### A. 3D WebGL Bloch Sphere
- Built with **Three.js** and **OrbitControls**.
- Fully interactive: drag to rotate, scroll to zoom, preset camera perspectives (+Z North Pole, +X Front, +Y Side).
- Real-time animated state vector arrow with smooth slerp interpolation upon gate application.
- Poles and equator marked with glowing labels: $|0\rangle$, $|1\rangle$, $|+\rangle$, $|-\rangle$, $|+i\rangle$, $|-i\rangle$.
- Dotted projection guides indicating polar angle $\theta$ and azimuthal relative phase $\phi$.

### B. Unitary Quantum Gate Laboratory
- **Hadamard Gate ($H$):** Creates equal superposition from basis states:
  $$H = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}, \quad H|0\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}} = |+\rangle$$
- **Pauli-X Gate ($X$):** Quantum bit-flip ($X|0\rangle = |1\rangle, X|1\rangle = |0\rangle$).
- **Pauli-Y Gate ($Y$):** Bit and phase flip ($Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}$).
- **Pauli-Z Gate ($Z$):** Phase flip ($Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$).
- **Phase Gate ($S$) & $T$ Gate:** Fractional phase rotations ($S = \sqrt{Z}$, $T = \sqrt{S}$).
- **Identity Gate ($I$):** Reversible buffer delay.
- **Continuous Euler Rotations ($R_x, R_y, R_z$):** Arbitrary angle slider inputs.
- **Circuit Pipeline & Undo:** Visual gate history trace with one-click undo and circuit reset.
- **Unitary Matrix Verifier:** Automated validation of $U^\dagger U = I$ and $\det(U)$.

### C. Quantum Measurement Lab
- Single-shot projective measurement in computational basis $\{|0\rangle, |1\rangle\}$.
- Simulation using the **Born Rule** with genuine quantum probabilities.
- Irreversible wavefunction collapse: qubit vector snaps immediately to the measured pole.
- Particle burst collapse animation and detailed physical explanations.
- "Re-prepare Pre-Measurement State" button to restore superposition after measurement.

### D. Multi-Shot Monte Carlo Engine
- Selector for **10, 100, 500, 1000, 5000 independent shots**.
- Independent measurements on freshly prepared identical copies of the state.
- Real-time animated histogram comparing measured counts vs theoretical expectations.
- Statistical metrics table:
  - Empirical frequency $\hat{P}(0), \hat{P}(1)$
  - Theoretical probability $P(0), P(1)$
  - Absolute error $|\hat{P} - P|$
  - Binomial standard error $\sigma = \sqrt{\frac{P(1-P)}{N}}$
  - Visual timeline stream of measured outcomes.

### E. Complex Probability Amplitude Analysis
- 2D **Argand Phasor Diagram** in the complex plane $\mathbb{C}$.
- Vector arrows displaying real and imaginary components of $\alpha$ and $\beta$.
- Normalization check: $|\alpha|^2 + |\beta|^2 = 1.00000$.
- In-depth demonstration showing why **quantum superposition is wave interference, not classical randomness**.

### F. Educational Hub & Knowledge Evaluation
- **6 Comprehensive Textbook Chapters:**
  1. Classical Bit vs Qubit
  2. The Principle of Superposition
  3. Probability Amplitudes & Normalization
  4. The Born Rule & Wavefunction Collapse
  5. Quantum Gates as Unitary Operators
  6. VLSI Realization (Silicon CMOS quantum dots, superconducting transmons, photonics)
- **Step-by-Step Guided Experiment:** 6-step guided walkthrough with instant explanations.
- **Interactive 5-Question Quiz:** Tests conceptual understanding with immediate grading and scientific feedback.

---

## 🚀 3. How to Run Locally

### Prerequisites
- Node.js (version 18 or newer recommended)
- Any modern web browser (Chrome, Edge, Firefox, Brave, Safari)

### Quick Start (Double Click)
On Windows, simply double-click:
```
run_qubit_lab.bat
```

### Manual Command Line
```powershell
# 1. Navigate to the project directory
cd qubit-lab

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser at http://localhost:5173
```

### Production Build
```powershell
npm run build
```
The compiled, optimized production files will be in `dist/`.

---

## 📚 4. Academic Syllabus Alignment

- **Module 1 (Postulates of Quantum Mechanics):** State vectors in 2D complex Hilbert space, Dirac notation, normalization condition, Born rule postulate.
- **Module 2 (Quantum Information & Gates):** Single-qubit operations, Hadamard gate superposition generation, Pauli spin matrices, Bloch sphere geometry, and VLSI physical qubit realizations.
