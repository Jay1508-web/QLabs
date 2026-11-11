import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { QubitState, BlochCoordinates } from '../../types/quantum';
import { stateToBloch } from '../../quantum/state';
import { RotateCw, Eye, Sparkles, Compass } from 'lucide-react';

interface BlochSphereCanvasProps {
  state: QubitState;
  showProjections?: boolean;
  autoRotateDefault?: boolean;
}

export const BlochSphereCanvas: React.FC<BlochSphereCanvasProps> = ({
  state,
  showProjections = true,
  autoRotateDefault = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
  const [projectionsVisible, setProjectionsVisible] = useState(showProjections);

  // References for animating state vector
  const currentVectorRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.0, 0)); // Starts at |0> (up)
  const targetVectorRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.0, 0));
  const arrowGroupRef = useRef<THREE.Group | null>(null);
  const projectionGroupRef = useRef<THREE.Group | null>(null);
  const tipGlowRef = useRef<THREE.Mesh | null>(null);

  // Convert quantum bloch (xq, yq, zq) to three.js (x3, y3, z3):
  // Three.js Y is Up -> corresponds to Quantum Z (+Z is |0>, -Z is |1>)
  // Three.js X is Right -> corresponds to Quantum X (+X is |+>, -X is |->)
  // Three.js Z is Front -> corresponds to Quantum -Y (to maintain right-handed system)
  const blochToThree = (coords: BlochCoordinates, radius: number = 2.0): THREE.Vector3 => {
    const x3 = coords.x * radius;
    const y3 = coords.z * radius; // Quantum Z is vertical Up
    const z3 = -coords.y * radius; // Quantum Y maps to -Z in three.js
    return new THREE.Vector3(x3, y3, z3);
  };

  // Update target whenever state changes
  useEffect(() => {
    const coords = stateToBloch(state);
    targetVectorRef.current = blochToThree(coords, 2.0);
  }, [state]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.5, 2.8, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controlsRef.current = controls;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f5ff, 2.0, 15);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.0, 15);
    purpleLight.position.set(-4, -5, -4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1.5, 12);
    blueLight.position.set(0, 0, 5);
    scene.add(blueLight);

    // --- Bloch Sphere Geometry ---
    const SPHERE_RADIUS = 2.0;

    // 1. Semi-transparent glass sphere
    const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 48, 48);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a192f,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.2,
      depthWrite: false
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // 2. Holographic wireframe mesh
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireframeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
    scene.add(wireframeMesh);

    // 3. Equatorial Ring (XY Plane, where Z=0 -> Three.js Y=0)
    const equatorRadius = SPHERE_RADIUS;
    const equatorCurve = new THREE.EllipseCurve(0, 0, equatorRadius, equatorRadius, 0, 2 * Math.PI, false, 0);
    const equatorPoints = equatorCurve.getPoints(120);
    const equatorGeo = new THREE.BufferGeometry().setFromPoints(
      equatorPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
    );
    const equatorMat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.65,
      linewidth: 2
    });
    const equatorLine = new THREE.Line(equatorGeo, equatorMat);
    scene.add(equatorLine);

    // 4. Prime Meridian (XZ Plane -> Three.js XY Plane)
    const primeMeridianGeo = new THREE.BufferGeometry().setFromPoints(
      equatorPoints.map(p => new THREE.Vector3(p.x, p.y, 0))
    );
    const meridianMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.35
    });
    const primeMeridian = new THREE.Line(primeMeridianGeo, meridianMat);
    scene.add(primeMeridian);

    // 5. YZ Meridian (Three.js YZ Plane)
    const yzMeridianGeo = new THREE.BufferGeometry().setFromPoints(
      equatorPoints.map(p => new THREE.Vector3(0, p.y, p.x))
    );
    const yzMeridian = new THREE.Line(yzMeridianGeo, meridianMat);
    scene.add(yzMeridian);

    // --- Coordinate Axes Lines ---
    const AXIS_LEN = 2.45;

    // Helper to make dashed axis lines
    const makeAxisLine = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineDashedMaterial({
        color,
        dashSize: 0.1,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.7
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      return line;
    };

    // Z axis (Three.js Y: vertical Up/Down)
    scene.add(makeAxisLine(new THREE.Vector3(0, -AXIS_LEN, 0), new THREE.Vector3(0, AXIS_LEN, 0), 0x38bdf8));

    // X axis (Three.js X: Left/Right)
    scene.add(makeAxisLine(new THREE.Vector3(-AXIS_LEN, 0, 0), new THREE.Vector3(AXIS_LEN, 0, 0), 0xa855f7));

    // Y axis (Three.js Z: Front/Back)
    scene.add(makeAxisLine(new THREE.Vector3(0, 0, -AXIS_LEN), new THREE.Vector3(0, 0, AXIS_LEN), 0x22c55e));

    // --- Canvas Text Labels for State Poles ---
    const makeTextSprite = (text: string, bgColor: string, textColor: string = '#ffffff') => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Rounded background box
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(16, 16, 224, 96, 24);
      ctx.fill();

      // Border glow
      ctx.lineWidth = 4;
      ctx.strokeStyle = textColor;
      ctx.stroke();

      // Text
      ctx.font = 'bold 44px Fira Code, monospace';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.75, 0.38, 1);
      return sprite;
    };

    // Top: |0> (Three.js Y = +AXIS_LEN)
    const label0 = makeTextSprite('|0⟩', 'rgba(6, 182, 212, 0.85)', '#ffffff');
    label0.position.set(0, AXIS_LEN + 0.25, 0);
    scene.add(label0);

    // Bottom: |1> (Three.js Y = -AXIS_LEN)
    const label1 = makeTextSprite('|1⟩', 'rgba(168, 85, 247, 0.85)', '#ffffff');
    label1.position.set(0, -AXIS_LEN - 0.25, 0);
    scene.add(label1);

    // +X: |+> (Three.js X = +AXIS_LEN)
    const labelPlus = makeTextSprite('|+⟩', 'rgba(14, 165, 233, 0.8)', '#ffffff');
    labelPlus.position.set(AXIS_LEN + 0.25, 0, 0);
    scene.add(labelPlus);

    // -X: |-> (Three.js X = -AXIS_LEN)
    const labelMinus = makeTextSprite('|-⟩', 'rgba(14, 165, 233, 0.8)', '#ffffff');
    labelMinus.position.set(-AXIS_LEN - 0.25, 0, 0);
    scene.add(labelMinus);

    // +Y: |+i> (Three.js Z = -AXIS_LEN)
    const labelPlusI = makeTextSprite('|+i⟩', 'rgba(34, 197, 94, 0.8)', '#ffffff');
    labelPlusI.position.set(0, 0, -AXIS_LEN - 0.25);
    scene.add(labelPlusI);

    // -Y: |-i> (Three.js Z = +AXIS_LEN)
    const labelMinusI = makeTextSprite('|-i⟩', 'rgba(34, 197, 94, 0.8)', '#ffffff');
    labelMinusI.position.set(0, 0, AXIS_LEN + 0.25);
    scene.add(labelMinusI);

    // --- Origin Glow Marker ---
    const originGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const originMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const originMesh = new THREE.Mesh(originGeo, originMat);
    scene.add(originMesh);

    // --- State Vector Arrow Group ---
    const arrowGroup = new THREE.Group();
    scene.add(arrowGroup);
    arrowGroupRef.current = arrowGroup;

    // Arrow Shaft (Cylinder)
    const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 16);
    shaftGeo.translate(0, 0.5, 0); // Origin at base
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    arrowGroup.add(shaftMesh);

    // Arrow Head (Cone)
    const headGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
    headGeo.translate(0, 0.175, 0);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f5ff,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    arrowGroup.add(headMesh);

    // Tip Halo / Glow sphere on sphere surface
    const tipGlowGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const tipGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.8
    });
    const tipGlow = new THREE.Mesh(tipGlowGeo, tipGlowMat);
    scene.add(tipGlow);
    tipGlowRef.current = tipGlow;

    // --- Projection Lines Group ---
    const projectionGroup = new THREE.Group();
    scene.add(projectionGroup);
    projectionGroupRef.current = projectionGroup;

    // Projection line 1: from vector tip down to equator plane (Z=0)
    const projLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const projLineMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.08,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.8
    });
    const projLine = new THREE.Line(projLineGeo, projLineMat);
    projectionGroup.add(projLine);

    // Projection line 2: from origin to equatorial footprint (showing phase phi)
    const phaseLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const phaseLineMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6
    });
    const phaseLine = new THREE.Line(phaseLineGeo, phaseLineMat);
    projectionGroup.add(phaseLine);

    // Footprint dot on equator
    const footprintGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const footprintMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const footprintMesh = new THREE.Mesh(footprintGeo, footprintMat);
    projectionGroup.add(footprintMesh);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smoothly interpolate current vector towards target vector
      const current = currentVectorRef.current;
      const target = targetVectorRef.current;
      current.lerp(target, 0.12);

      // Re-normalize to exact sphere radius
      if (current.length() > 0.01) {
        current.normalize().multiplyScalar(SPHERE_RADIUS);
      }

      // Update Arrow orientation and length
      const dir = current.clone().normalize();
      const arrowLength = current.length();
      const headLength = 0.35;
      const shaftLength = Math.max(0.01, arrowLength - headLength);

      shaftMesh.scale.set(1, shaftLength, 1);
      headMesh.position.set(0, shaftLength, 0);

      // Orient arrow group towards direction
      const defaultDir = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(defaultDir, dir);
      arrowGroup.setRotationFromQuaternion(quat);

      // Position tip glow
      tipGlow.position.copy(current);
      const tipPulse = 1.0 + 0.25 * Math.sin(elapsed * 6);
      tipGlow.scale.set(tipPulse, tipPulse, tipPulse);

      // Update projections
      // Equator plane is Three.js Y = 0
      const footprint = new THREE.Vector3(current.x, 0, current.z);

      const pPositions = projLine.geometry.attributes.position as THREE.BufferAttribute;
      pPositions.setXYZ(0, current.x, current.y, current.z);
      pPositions.setXYZ(1, footprint.x, footprint.y, footprint.z);
      pPositions.needsUpdate = true;
      projLine.computeLineDistances();

      const phPositions = phaseLine.geometry.attributes.position as THREE.BufferAttribute;
      phPositions.setXYZ(0, 0, 0, 0);
      phPositions.setXYZ(1, footprint.x, footprint.y, footprint.z);
      phPositions.needsUpdate = true;

      footprintMesh.position.copy(footprint);

      // Update Controls
      controls.update();

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync autoRotate state with controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Sync projections visibility
  useEffect(() => {
    if (projectionGroupRef.current) {
      projectionGroupRef.current.visible = projectionsVisible;
    }
  }, [projectionsVisible]);

  // Camera preset handlers
  const setCameraView = (type: 'default' | 'top' | 'front' | 'side') => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.reset();
    switch (type) {
      case 'default':
        camera.position.set(3.5, 2.8, 4.2);
        break;
      case 'top': // Look straight down at North pole |0>
        camera.position.set(0, 5.5, 0.01);
        break;
      case 'front': // Look at +X (|+>)
        camera.position.set(5.5, 0, 0);
        break;
      case 'side': // Look at +Y (|+i>)
        camera.position.set(0, 0, -5.5);
        break;
    }
    camera.lookAt(0, 0, 0);
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-2xl overflow-hidden glass-panel flex flex-col">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none" />

      {/* Floating HUD Controls */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-1.5 sm:gap-2 pointer-events-auto">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
            autoRotate
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
          title="Toggle Auto Rotation"
        >
          <RotateCw className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden xs:inline">Auto-Rotate</span>
          <span className="xs:hidden">Rotate</span>
        </button>

        <button
          onClick={() => setProjectionsVisible(!projectionsVisible)}
          className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
            projectionsVisible
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
          title="Toggle Phase & Polar Projections"
        >
          <Compass className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span>Projections</span>
        </button>
      </div>

      {/* Camera Orientation Presets */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 flex gap-0.5 sm:gap-1 bg-slate-900/85 p-0.5 sm:p-1 rounded-xl border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => setCameraView('default')}
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
          title="Perspective View"
        >
          3D
        </button>
        <button
          onClick={() => setCameraView('top')}
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
          title="Top View (Z-Axis / Computational Basis)"
        >
          +Z
        </button>
        <button
          onClick={() => setCameraView('front')}
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
          title="Front View (X-Axis / Diagonal Basis)"
        >
          +X
        </button>
        <button
          onClick={() => setCameraView('side')}
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
          title="Side View (Y-Axis / Circular Basis)"
        >
          +Y
        </button>
      </div>

      {/* Sphere Legend Overlay */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-10 flex items-center justify-between pointer-events-none text-[10px] sm:text-[11px] text-slate-400 bg-slate-950/75 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
            State Vector
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-cyan-400 inline-block"></span>
            Equator (Superposition)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-amber-400 inline-block"></span>
            Phase Projection (φ)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-500">
          <Eye className="w-3 h-3" />
          <span>Drag to orbit, scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};
