"use client";
﻿"use client";

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Cylinder, Html, RoundedBox, Line, Trail } from '@react-three/drei';
import { ShieldCheck, BarChart3, PawPrint, TrendingUp, LucideProps } from 'lucide-react';
import { useSpring, animated, SpringValue } from '@react-spring/three';
import * as THREE from 'three';

// Viewport size hook
const useViewportSize = () => {
  const [viewport, setViewport] = useState({
    width: 1920, // Default values for SSR
    height: 1080,
    aspect: 1920 / 1080
  });
  
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const updateViewport = () => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
          aspect: window.innerWidth / window.innerHeight
        });
      };
      
      // Set initial values
      updateViewport();
      
      window.addEventListener('resize', updateViewport);
      return () => window.removeEventListener('resize', updateViewport);
    }
  }, []);
  
  return viewport;
};

// Hyperdimensional mathematics system
class HyperdimensionalCoordinate {
  coords: number[];
  magnitude: number;
  phase: number;

  constructor(coords: number[]) {
    this.coords = coords;
    this.magnitude = this.calculateMagnitude();
    this.phase = this.calculatePhase();
  }
  
  calculateMagnitude(): number {
    return Math.sqrt(this.coords.reduce((sum, coord) => sum + coord * coord, 0));
  }
  
  calculatePhase(): number {
    return this.coords.reduce((phase, coord, i) => phase + coord * Math.sin(i * 0.618), 0);
  }
  
  projectTo3D(): [number, number, number] {
    const x = this.coords[0] + this.coords[3] * 0.3 + this.coords[6] * 0.1;
    const y = this.coords[1] + this.coords[4] * 0.3 + this.coords[7] * 0.1;
    const z = this.coords[2] + this.coords[5] * 0.3 + this.coords[8] * 0.1;
    return [x, y, z];
  }
  
  distanceTo(other: HyperdimensionalCoordinate): number {
    return Math.sqrt(
      this.coords.reduce((sum, coord, i) => 
        sum + Math.pow(coord - other.coords[i], 2), 0
      )
    );
  }
}

// Neural network classes
class NeuralNode {
  id: string;
  position: [number, number, number];
  type: string;
  activation: number;
  threshold: number;
  connections: NeuralSynapse[];
  memory: Array<{
    timestamp: number;
    input: number;
    activation: number;
    context: {
      averageActivation: number;
      trend: number;
      stability: number;
    };
  }>;
  personality: {
    excitability: number;
    persistence: number;
    creativity: number;
    empathy: number;
  };
  learningHistory: any[];

  constructor(id: string, position: [number, number, number], type = 'standard') {
    this.id = id;
    this.position = position;
    this.type = type;
    this.activation = 0;
    this.threshold = 0.5 + Math.random() * 0.3;
    this.connections = [];
    this.memory = [];
    this.personality = {
      excitability: Math.random(),
      persistence: Math.random(),
      creativity: Math.random(),
      empathy: Math.random()
    };
    this.learningHistory = [];
  }
  
  activate(input: number): number {
    const personalityModifier = this.personality.excitability * 0.2;
    this.activation = 1 / (1 + Math.exp(-(input + personalityModifier - this.threshold)));
    
    this.memory.push({
      timestamp: Date.now(),
      input,
      activation: this.activation,
      context: this.getContext()
    });
    
    if (this.memory.length > 50) {
      this.memory = this.memory.slice(-50);
    }
    
    return this.activation;
  }
  
  getContext() {
    const recentActivations = this.memory.slice(-5);
    return {
      averageActivation: recentActivations.reduce((sum, m) => sum + m.activation, 0) / Math.max(recentActivations.length, 1),
      trend: recentActivations.length > 1 ? 
        recentActivations[recentActivations.length - 1].activation - recentActivations[0].activation : 0,
      stability: this.calculateStability(recentActivations)
    };
  }
  
  calculateStability(activations: typeof this.memory): number {
    if (activations.length < 2) return 1;
    const variance = activations.reduce((sum, a) => {
      const mean = activations.reduce((s, v) => s + v.activation, 0) / activations.length;
      return sum + Math.pow(a.activation - mean, 2);
    }, 0) / activations.length;
    return 1 / (1 + variance);
  }
}

class NeuralSynapse {
  fromNode: NeuralNode;
  toNode: NeuralNode;
  weight: number;
  strength: number;
  polarity: 'excitatory' | 'inhibitory';
  plasticity: number;
  history: Array<{
    timestamp: number;
    signal: number;
    fromActivation: number;
    toActivation: number;
  }>;

  constructor(fromNode: NeuralNode, toNode: NeuralNode, weight: number | null = null) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.weight = weight ?? (Math.random() - 0.5) * 2;
    this.strength = Math.abs(this.weight);
    this.polarity = this.weight > 0 ? 'excitatory' : 'inhibitory';
    this.plasticity = Math.random() * 0.5 + 0.3;
    this.history = [];
  }
  
  transmit(): number {
    const signal = this.fromNode.activation * this.weight;
    this.history.push({
      timestamp: Date.now(),
      signal,
      fromActivation: this.fromNode.activation,
      toActivation: this.toNode.activation
    });
    
    if (this.fromNode.activation > 0.7 && this.toNode.activation > 0.7) {
      this.weight += this.plasticity * 0.01;
    }
    
    return signal;
  }
}

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position3D: [number, number, number];
  color: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
}

interface PortalState {
  activePortal: string | null;
  expansionProgress: number;
  isTransitioning: boolean;
}

interface ViewportState {
  isEngulfed: boolean;
  engulfmentProgress: number;
  targetApp: string | null;
}

interface AppTransitionState {
  isTransitioning: boolean;
  currentApp: string | null;
  transitionProgress: number;
}

interface ServiceObjectProps {
  service: Service;
  isActive: boolean;
  onClick: () => void;
  portalState: PortalState;
  consciousness: PortalConsciousnessData | undefined;
}

interface Consequence {
  id: number;
  position: [number, number, number];
  birthTime: number;
  type: string; 
}

interface AppContentProps {
  visible: boolean;
  progress: number;
}

interface PortalEngulfmentOverlayProps {
  service: Service | undefined;
  progress: number;
  onComplete: () => void;
  viewport: { width: number; height: number };
}

interface AppInterfaceProps {
  visible: boolean;
  progress: number;
}

interface QuantumState {
  state: string;
  probability: number;
  energy: number;
}

interface QuantumEntanglementData {
  strength: number;
  resonance: number;
  phase: number;
}

interface QuantumStates {
  superposition: Map<string, QuantumState[]>;
  entanglement: Map<string, QuantumEntanglementData>;
  coherence: number;
  uncertainty: number;
}

interface TemporalEvent {
  eventId: string;
  timestamp: number;
  type: string;
  portalId: string;
  position: [number, number, number];
  energy: number;
  consequenceSpawn: number;
  dimensionalLayer: number;
}

interface TemporalPrediction {
  predictionId: string;
  type: string;
  target?: string;
  confidence: number;
  timeframe: number;
  trend?: string;
}

interface TemporalHistory {
  interactions: TemporalEvent[];
  patterns: Map<string, any>;
  predictions: TemporalPrediction[];
  timeStreamId: number;
}

interface PortalConsciousnessData {
  awareness: number;
  memory: Array<{
    timestamp: number;
    type: string;
    userBehavior: string;
    response: string;
  }>;
  personality: {
    curiosity: number;
    responsiveness: number;
    patience: number;
    creativity: number;
  };
  currentMood: string;
  interactionHistory: any[];
  learningRate: number;
}

// Hyperdimensional space interfaces
interface HyperdimensionalState {
  dimensions: number;
  manifolds: Map<string, PortalManifold>;
  curvature: number;
  spatialFolds: SpatialFold[];
  realityAnchors: RealityAnchor[];
  dimensionalStability: number;
}

interface PortalManifold {
  id: string;
  basePosition: [number, number, number];
  hyperCoordinates: HyperdimensionalCoordinate;
  curvatureField: CurvaturePoint[];
  spatialGradient: SpatialGradient;
  dimensionalResonance: number;
  stabilityIndex: number;
}

interface CurvaturePoint {
  position: [number, number, number];
  curvature: number;
  intensity: number;
}

interface SpatialGradient {
  directionVector: [number, number, number];
  magnitude: number;
  frequency: number;
}

interface SpatialFold {
  origin: [number, number, number];
  destination: [number, number, number];
  strength: number;
  phase: number;
}

interface RealityAnchor {
  position: [number, number, number];
  stability: number;
  influence: number;
}

// Reality distortion interfaces
interface RealityFieldState {
  distortionLevel: number;
  spatialAnchors: SpatialAnchor[];
  timeDialation: number;
  gravityWells: GravityWell[];
  quantumTunnels: QuantumTunnel[];
  realityStability: number;
  impossibleGeometry: boolean;
}

interface SpatialAnchor {
  position: [number, number, number];
  strength: number;
  radius: number;
}

interface GravityWell {
  id: number;
  position: [number, number, number];
  mass: number;
  portalId: string;
  influence: number;
  decayRate: number;
  createdAt: number;
}

interface QuantumTunnel {
  id: number;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  stability: number;
  throughput: number;
  createdAt: number;
  lifespan: number;
}

// Helper functions for hyperdimensional space
const generatePortalManifold = (portalId: string, basePosition: [number, number, number]): PortalManifold => {
  return {
    id: portalId,
    basePosition,
    hyperCoordinates: new HyperdimensionalCoordinate(
      Array.from({ length: 11 }, () => (Math.random() - 0.5) * 2)
    ),
    curvatureField: generateCurvatureField(),
    spatialGradient: generateSpatialGradient(),
    dimensionalResonance: Math.random() * 2 * Math.PI,
    stabilityIndex: 0.8 + Math.random() * 0.2
  };
};

const generateCurvatureField = (): CurvaturePoint[] => {
  return Array.from({ length: 27 }, (_, i) => {
    const x = (i % 3) - 1;
    const y = Math.floor((i % 9) / 3) - 1;
    const z = Math.floor(i / 9) - 1;
    
    return {
      position: [x, y, z],
      curvature: Math.sin(x * 2) * Math.cos(y * 1.5) * Math.sin(z * 1.8),
      intensity: Math.random() * 0.5 + 0.3
    };
  });
};

const generateSpatialGradient = (): SpatialGradient => {
  return {
    directionVector: [
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ],
    magnitude: Math.random() * 0.8 + 0.2,
    frequency: Math.random() * 3 + 1
  };
};

// Helper functions for reality distortion
const createGravityWell = (
  position: [number, number, number], 
  mass: number, 
  portalId: string
): GravityWell => {
  return {
    id: Math.random(),
    position,
    mass,
    portalId,
    influence: mass * 2,
    decayRate: 0.99,
    createdAt: Date.now()
  };
};

const createQuantumTunnel = (
  startPos: [number, number, number], 
  endPos: [number, number, number], 
  stability = 0.8
): QuantumTunnel => {
  return {
    id: Math.random(),
    startPosition: startPos,
    endPosition: endPos,
    stability,
    throughput: 0,
    createdAt: Date.now(),
    lifespan: 5000 + Math.random() * 10000
  };
};

// Impossible geometry generators
const generatePenroseStairs = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 3;
    const height = Math.sin(angle * 3) * 0.5;
    
    return {
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ] as [number, number, number],
      rotation: [0, angle, Math.sin(angle * 2) * 0.3] as [number, number, number],
      impossible: true
    };
  });
};

function VetNavContent({ visible, progress }: AppContentProps) {
  const contentRef = useRef<THREE.Group | null>(null);
  
  useFrame(() => {
    if (contentRef.current) {
      contentRef.current.rotation.y += 0.01;
    }
  });
  
  if (!visible) return null;
  
  return (
    <group ref={contentRef} scale={progress * 2}>
      <group position={[0, 0.5, 0]}>
        <Box args={[0.3, 0.1, 0.3]}>
          <meshStandardMaterial color="#1e40af" emissive="#0f766e" emissiveIntensity={0.3} />
        </Box>
        <Box args={[0.2, 0.05, 0.2]} position={[0, 0.075, 0]}>
          <meshStandardMaterial color="#0f766e" />
        </Box>
      </group>
      
      {[0, 1, 2].map(i => (
        <Sphere 
          key={i}
          args={[0.05, 8, 8]} 
          position={[
            Math.cos(i * 2.1) * 0.8,
            Math.sin(i * 1.5) * 0.3,
            Math.sin(i * 2.1) * 0.8
          ]}
        >
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </Sphere>
      ))}
    </group>
  );
}

function TariffContent({ visible, progress }: AppContentProps) {
  if (!visible) return null;
  
  return (
    <group scale={progress * 2}>
      <group>
        {[0, 1, 2, 3, 4].map(i => (
          <Cylinder
            key={i}
            args={[0.05, 0.05, 0.2 + i * 0.1, 8]}
            position={[
              (i - 2) * 0.2,
              (0.1 + i * 0.05),
              0
            ]}
          >
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#059669" 
              emissiveIntensity={0.4}
            />
          </Cylinder>
        ))}
      </group>
      
      {[0, 1, 2, 3].map(i => (
        <Box
          key={i}
          args={[0.03, 0.03, 0.03]}
          position={[
            Math.cos(i * 1.5) * 0.6,
            Math.sin(i * 0.8) * 0.4,
            Math.sin(i * 1.2) * 0.6
          ]}
        >
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
        </Box>
      ))}
    </group>
  );
}

function PetRadarContent({ visible, progress }: AppContentProps) {
  if (!visible) return null;
  
  return (
    <group scale={progress * 2}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <group
          key={i}
          position={[
            Math.cos(i * 1.0) * 0.7,
            Math.sin(i * 0.6) * 0.4,
            Math.sin(i * 1.3) * 0.7
          ]}
          rotation={[0, i * 0.5, 0]}
        >
          <Sphere args={[0.02, 6, 6]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} />
          </Sphere>
          <Sphere args={[0.015, 6, 6]} position={[0.03, 0.02, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} />
          </Sphere>
          <Sphere args={[0.015, 6, 6]} position={[-0.03, 0.02, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} />
          </Sphere>
        </group>
      ))}
      
      <Torus args={[0.8, 0.01, 4, 32]} rotation={[Math.PI/2, 0, 0]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
      </Torus>
    </group>
  );
}

function FundraiserContent({ visible, progress }: AppContentProps) {
  if (!visible) return null;
  
  return (
    <group scale={progress * 2}>
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <Cylinder
          key={i}
          args={[0.04, 0.04, 0.01, 12]}
          position={[
            (Math.random() - 0.5) * 1.2,
            i * 0.15 - 0.3,
            (Math.random() - 0.5) * 1.2
          ]}
          rotation={[Math.PI/2, 0, i * 0.3]}
        >
          <meshStandardMaterial 
            color="#f59e0b" 
            emissive="#f59e0b" 
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Cylinder>
      ))}
      
      <group position={[0, -0.3, 0]}>
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            args={[0.6, 0.02, 0.05]}
            position={[0, i * 0.08, 0]}
          >
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
          </Box>
        ))}
      </group>
    </group>
  );
}

function ConsequenceRipple({ consequence, onInteract }: { consequence: Consequence; onInteract: (consequence: Consequence) => void }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [isRippleActive, setIsRippleActive] = useState(false);
  
  const springProps = useSpring({
    to: {
      scale: (isRippleActive ? [1.5, 1.5, 1.5] : [0.1, 0.1, 0.1]) as [number,number,number],
      opacity: isRippleActive ? 0.8 : 0.2,
    },
    config: { tension: 300, friction: 10 }
  });
  
  useEffect(() => {
    setIsRippleActive(true);
  return () => {
    setIsRippleActive(false);
  };
  }, []);
  
  return (
    <animated.group position={consequence.position} scale={springProps.scale}>
      <Sphere args={[0.1, 8, 8]}
        ref={meshRef}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onInteract(consequence);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <animated.meshBasicMaterial 
          color="white" 
          transparent 
          opacity={springProps.opacity}
        />
      </Sphere>
    </animated.group>
  );
}

function PortalEngulfmentOverlay({ service, progress, onComplete, viewport }: PortalEngulfmentOverlayProps) {
  const overlayRef = useRef<THREE.Group | null>(null);
  
  const { scale, opacity } = useSpring({
    to: {
        scale: progress * Math.max(viewport.width, viewport.height) * 0.01,
        opacity: progress > 0.7 ? 1 : 0.8,
    },
    config: { tension: 80, friction: 20 },
    onRest: () => { if (progress >= 1) onComplete(); }
  });
  
  useFrame(() => {
    if (overlayRef.current && progress > 0.5) {
      overlayRef.current.rotation.z += 0.005;
    }
  });

  if (!service) return null;
  
  return (
    <animated.group ref={overlayRef} scale={scale}>
      <Sphere args={[1, 64, 64]}>
        <animated.meshBasicMaterial 
          color={service.color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {progress > 0.6 && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Sphere
              key={i}
              args={[0.02 * (1/Math.max(viewport.width, viewport.height) * 100), 8, 8]}
              position={[
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
              ]}
            >
              <meshBasicMaterial 
                color="white" 
                transparent 
                opacity={Math.random() * 0.8}
              />
            </Sphere>
          ))}
        </group>
      )}
    </animated.group>
  );
}

function ServiceObject({ 
  service, 
  isActive, 
  onClick,
  portalState,
  consciousness
}: ServiceObjectProps) {
  const generalMeshRef = useRef<THREE.Mesh | null>(null);
  const vetNavGroupRef = useRef<THREE.Group | null>(null);
  const vetNavPrimaryMeshRef = useRef<THREE.Mesh | null>(null);
  const vetNavOuterMeshRef = useRef<THREE.Mesh | null>(null);

  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [consequences, setConsequences] = useState<Consequence[]>([]);

  const individualObjectSpring = useSpring({ 
    to: { 
      scale: (() => {
        const s = pressed && !portalState.isTransitioning ? 0.95 : isActive && !portalState.isTransitioning ? 1.1 : hovered && !portalState.isTransitioning ? 1.2 : 1;
        return [s, s, s] as [number, number, number];
      })()
    },
    config: { tension: 300, friction: 10 },
    onRest: () => {
      if (pressed) {
        setPressed(false);
      }
    },
  });

  const spawnConsequence = (position: [number, number, number]) => {
    const newConsequence: Consequence = {
      id: Math.random(),
      position,
      birthTime: Date.now(),
      type: 'ripple'
    };
    setConsequences(prev => [...prev, newConsequence]);
    setTimeout(() => {
      setConsequences(prev => prev.filter(c => c.id !== newConsequence.id));
    }, 2000);
  };

  useFrame((state, delta) => {
    const isThisPortalExpanding = portalState.isTransitioning && portalState.activePortal === service.id;
    if (isThisPortalExpanding) return;

    if (service.id === 'vetnav') {
        if (vetNavPrimaryMeshRef.current) {
            vetNavPrimaryMeshRef.current.rotation.y += delta * 0.1;
            vetNavPrimaryMeshRef.current.rotation.x += delta * 0.05;
        }
        if (vetNavOuterMeshRef.current) {
            vetNavOuterMeshRef.current.rotation.y += delta * 0.1; 
            vetNavOuterMeshRef.current.rotation.x += delta * 0.05;
        }
    } else { 
        if (generalMeshRef.current) {
            generalMeshRef.current.rotation.y += delta * 0.1;
            generalMeshRef.current.rotation.x += delta * 0.05;
        }
    }
  });

  const eventHandlers = {
    onClick: (event: ThreeEvent<MouseEvent>) => { 
      event.stopPropagation();
      onClick();

      const clickPosThree = event.point as THREE.Vector3; 
      const clickPos = clickPosThree ? [clickPosThree.x, clickPosThree.y, clickPosThree.z] as [number,number,number] : service.position3D;
      
      spawnConsequence([
        clickPos[0] + (Math.random() - 0.5) * 2,
        clickPos[1] + (Math.random() - 0.5) * 2,
        clickPos[2] + (Math.random() - 0.5) * 2 
      ]);
      
      setPressed(true);
      if (navigator.vibrate) navigator.vibrate(50);
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => { 
      event.stopPropagation();
      setHover(true);
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => { 
      event.stopPropagation();
      setHover(false);
    },
  };

  const commonMaterialProps = {
    color: hovered && !isActive && !portalState.isTransitioning ? 'hotpink' : service.color,
    emissive: isActive && !portalState.isTransitioning ? 
              (service.id === 'vetnav' ? 'green' : service.id === 'tariff-explorer' ? 'yellow' : service.color) : 
              (hovered && !portalState.isTransitioning ? 'red' : 'black'),
    emissiveIntensity: isActive && !portalState.isTransitioning ? 1 : (hovered && !portalState.isTransitioning ? 0.5 : 0),
    roughness: 0.3,
    metalness: 0.6,
  };

  let renderedShape;
  switch (service.id) {
    case 'vetnav':
      renderedShape = (
        <group ref={vetNavGroupRef}> 
          <Sphere args={[1, 32, 32]} ref={vetNavPrimaryMeshRef} {...eventHandlers}>
            <meshStandardMaterial {...commonMaterialProps} />
          </Sphere>
          <Sphere args={[1.05, 32, 32]} ref={vetNavOuterMeshRef}>
            <meshBasicMaterial color={service.color} wireframe opacity={0.2} transparent />
          </Sphere>
        </group>
      );
      break;
    case 'tariff-explorer':
      renderedShape = (
        <Cylinder args={[0.7, 0.7, 2, 32]} ref={generalMeshRef} {...eventHandlers}>
          <meshStandardMaterial {...commonMaterialProps} />
        </Cylinder>
      );
      break;
    case 'pet-radar':
      renderedShape = (
        <Torus args={[0.8, 0.3, 16, 100]} ref={generalMeshRef} {...eventHandlers}>
          <meshStandardMaterial {...commonMaterialProps} />
        </Torus>
      );
      break;
    case 'fundraiser':
      renderedShape = (
        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.1} smoothness={4} ref={generalMeshRef} {...eventHandlers}>
          <meshStandardMaterial {...commonMaterialProps} />
        </RoundedBox>
      );
      break;
    default:
      renderedShape = (
        <Box args={[1.5, 1.5, 1.5]} ref={generalMeshRef} {...eventHandlers}>
          <meshStandardMaterial {...commonMaterialProps} />
        </Box>
      );
      break;
  }

  const getAppContent = () => {
    if (!portalState.isTransitioning || portalState.activePortal !== service.id) {
      return null;
    }
    
    const progress = Math.max(0, Math.min(portalState.expansionProgress, 1));
    
    switch (service.id) {
      case 'vetnav':
        return <VetNavContent visible={true} progress={progress} />;
      case 'tariff-explorer':
        return <TariffContent visible={true} progress={progress} />;
      case 'pet-radar':
        return <PetRadarContent visible={true} progress={progress} />;
      case 'fundraiser':
        return <FundraiserContent visible={true} progress={progress} />;
      default:
        return null;
    }
  };

  const currentAnimatedScale = isActive && !portalState.isTransitioning ? 1.1 : individualObjectSpring.scale;

  return (
    <animated.group 
      position={service.position3D} 
      scale={currentAnimatedScale} 
    >
      {renderedShape}
      {getAppContent()}
      
      {isActive && portalState.isTransitioning && (
        <Sphere args={[2, 32, 32]}> 
          <animated.meshBasicMaterial
            color={service.color} 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </Sphere>
      )}

      {consequences.map(consequence => (
        <ConsequenceRipple 
          key={consequence.id}
          consequence={consequence}
          onInteract={(c) => {
            for(let i = 0; i < 3; i++) {
              spawnConsequence([
                c.position[0] + (Math.random() - 0.5),
                c.position[1] + (Math.random() - 0.5), 
                c.position[2] + (Math.random() - 0.5)
              ]);
            }
          }}
        />
      ))}
    </animated.group>
  );
}

function VetNavInterface({ visible, progress }: AppInterfaceProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-700 z-50" style={{ opacity: progress, transform: `scale(${0.8 + progress * 0.2})` }}>
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">VetNav Benefits Portal</h1>
          <p className="text-xl mb-8">Navigate your veteran benefits</p>
          <button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg">Back to Portal</button>
        </div>
      </div>
    </div>
  );
}

function TariffInterface({ visible, progress }: AppInterfaceProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 to-green-700 z-50" style={{ opacity: progress, transform: `scale(${0.8 + progress * 0.2})` }}>
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tariff Explorer</h1>
          <p className="text-xl mb-8">Analyze trade data and tariffs</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">Back to Portal</button>
        </div>
      </div>
    </div>
  );
}

function PetRadarInterface({ visible, progress }: AppInterfaceProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-purple-700 z-50" style={{ opacity: progress, transform: `scale(${0.8 + progress * 0.2})` }}>
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Pet Radar</h1>
          <p className="text-xl mb-8">Find lost pets in your area</p>
          <button onClick={() => window.location.reload()} className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg">Back to Portal</button>
        </div>
      </div>
    </div>
  );
}

function FundraiserInterface({ visible, progress }: AppInterfaceProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900 to-orange-700 z-50" style={{ opacity: progress, transform: `scale(${0.8 + progress * 0.2})` }}>
      <div className="flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Fundraiser Platform</h1>
          <p className="text-xl mb-8">Support meaningful causes</p>
          <button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg">Back to Portal</button>
        </div>
      </div>
    </div>
  );
}

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };
    
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);
  
  return orientation;
};

function ConsequenceNetwork({ network, portalTilt }: { network: any, portalTilt: { x: number, y: number } }) {
  return (
    <group rotation={[portalTilt.x, portalTilt.y, 0]}>
      {Array.from(network.nodes.values()).map((node: any) => (
        <group key={node.id} position={node.position}>
          <Sphere args={[0.03, 8, 8]}>
            <meshBasicMaterial 
              color={`hsl(${node.resonanceFreq * 60}, 70%, 60%)`}
              transparent
              opacity={0.7 + Math.sin(Date.now() * 0.001 * node.resonanceFreq) * 0.3}
            />
          </Sphere>
          
          <Torus args={[0.1, 0.005, 4, 16]} rotation={[Math.PI/2, 0, 0]}>
            <meshBasicMaterial 
              color={`hsl(${node.resonanceFreq * 60}, 50%, 40%)`}
              transparent
              opacity={node.energy / 100}
            />
          </Torus>
        </group>
      ))}
      
      {network.connections.map((connection: any, idx: number) => {
        const fromNode = network.nodes.get(connection.from);
        const toNode = network.nodes.get(connection.to);
        
        if (!fromNode || !toNode) return null;
        
        const midpoint: [number, number, number] = [
          (fromNode.position[0] + toNode.position[0]) / 2,
          (fromNode.position[1] + toNode.position[1]) / 2,
          (fromNode.position[2] + toNode.position[2]) / 2
        ];
        
        const distance = Math.sqrt(
          Math.pow(toNode.position[0] - fromNode.position[0], 2) +
          Math.pow(toNode.position[1] - fromNode.position[1], 2) +
          Math.pow(toNode.position[2] - fromNode.position[2], 2)
        );

        const p1 = new THREE.Vector3(...fromNode.position);
        const p2 = new THREE.Vector3(...toNode.position);
        const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        return (
          <group position={midpoint} quaternion={quaternion}>
            <Cylinder 
              args={[0.002, 0.002, distance, 8]}
            >
              <meshBasicMaterial 
                color="cyan"
                transparent
                opacity={connection.strength * 0.4}
              />
            </Cylinder>
          </group>
        );
      })}
    </group>
  );
}

function CrossPortalEffect({ sourceService, targetService, influence }: { sourceService: Service, targetService: Service, influence: any }) {
  const effectRef = useRef<THREE.Group | null>(null);
  const animationActive = useRef(true);

  useEffect(() => {
    animationActive.current = true;
    return () => {
      animationActive.current = false;
    };
  }, []);
  
  useFrame((state) => {
    if (!animationActive.current) return;
    if (effectRef.current) {
      const time = state.clock.elapsedTime;
      effectRef.current.rotation.z = time * 0.5;
      effectRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });
  
  if (!influence) return null;
  
  const midpoint: [number,number,number] = [
    (sourceService.position3D[0] + targetService.position3D[0]) / 2,
    (sourceService.position3D[1] + targetService.position3D[1]) / 2,
    (sourceService.position3D[2] + targetService.position3D[2]) / 2
  ];
  
  return (
    <group ref={effectRef} position={midpoint}>
      <Torus args={[0.5, 0.02, 8, 32]}>
        <meshBasicMaterial 
          color={influence.effect === 'dataGlow' ? '#00ff88' : 
                influence.effect === 'protectiveField' ? '#4488ff' :
                influence.effect === 'economicSync' ? '#ffaa00' : '#ff44aa'}
          transparent
          opacity={influence.intensity}
        />
      </Torus>
      
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Sphere 
            key={i}
            args={[0.01, 6, 6]}
            position={[
              Math.cos(angle) * 0.5,
              Math.sin(angle) * 0.5,
              Math.sin(angle * 2) * 0.1
            ]}
          >
            <meshBasicMaterial color="white" />
          </Sphere>
        );
      })}
    </group>
  );
}

function DimensionalLayer({ layerIndex, currentLayer, services, children }: { layerIndex: number, currentLayer: number, services: Service[], children: React.ReactNode }) {
  const layerRef = useRef<THREE.Group | null>(null);
  const isActive = layerIndex === currentLayer;
  const offset = (layerIndex - currentLayer) * 15;
  
  const { position, opacity, scale } = useSpring({
    position: [0, 0, offset] as [number,number,number],
    opacity: isActive ? 1 : 0.2,
    scale: isActive ? 1 : 0.6,
    config: { tension: 200, friction: 25 }
  });
  
  useFrame(() => {
    if (layerRef.current) {
      if (!isActive) {
        layerRef.current.rotation.y += 0.0005 * (layerIndex + 1);
      }
    }
  });
  
  return (
    <animated.group 
      ref={layerRef}
      position={position}
      scale={scale}
    >
      <animated.group>
        {children}
        
        {isActive && layerIndex === 1 && (
          <group>
            {services.map((service, i) => (
              <Torus 
                key={`${service.id}-datalayer-${i}`}
                args={[1.2, 0.02, 4, 32]}
                position={service.position3D}
                rotation={[Math.PI/2, 0, 0]}
              >
                <meshBasicMaterial color="#00ffff" transparent opacity={0.25} />
              </Torus>
            ))}
          </group>
        )}
        
        {isActive && layerIndex === 2 && (
          <group>
            {services.map((service, i) => (
              <group key={`${service.id}-possibilitylayer-${i}`} position={service.position3D}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Sphere 
                    key={j}
                    args={[0.1, 8, 8]}
                    position={[
                      (Math.random() - 0.5) * 2,
                      (Math.random() - 0.5) * 2,
                      (Math.random() - 0.5) * 2
                    ]}
                  >
                    <meshBasicMaterial 
                      color={service.color} 
                      transparent 
                      opacity={0.4}
                    />
                  </Sphere>
                ))}
              </group>
            ))}
          </group>
        )}
      </animated.group>
    </animated.group>
  );
}

const useQuantumSuperposition = (portalId: string) => {
  const [activeStates, setActiveStates] = useState<QuantumState[]>([]);
  
  useEffect(() => {
    // Create quantum superposition - portal exists in multiple states simultaneously
    const states: QuantumState[] = [
      { state: 'dormant', probability: 0.4, energy: 0.2 },
      { state: 'curious', probability: 0.3, energy: 0.5 },
      { state: 'anticipating', probability: 0.2, energy: 0.8 },
      { state: 'resonating', probability: 0.1, energy: 1.0 }
    ];
    
    setActiveStates(states);
    
    // Update quantum states periodically
    const interval = setInterval(() => {
      setActiveStates(prev => prev.map(s => ({
        ...s,
        probability: Math.max(0, Math.min(1, s.probability + (Math.random() - 0.5) * 0.1)),
        energy: Math.max(0, Math.min(1, s.energy + (Math.random() - 0.5) * 0.05))
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [portalId]);
  
  return activeStates;
};

function QuantumPortalField({ services, activePortal, onQuantumCollapse }: {
  services: Service[];
  activePortal: string | null;
  onQuantumCollapse: (portalId: string) => void;
}) {
  const fieldRef = useRef<THREE.Group | null>(null);
  const [fieldEnergy, setFieldEnergy] = useState(0);
  const [quantumParticles, setQuantumParticles] = useState<Array<{
    id: number;
    position: [number, number, number];
    velocity: [number, number, number];
    energy: number;
    phase: number;
  }>>([]);
  
  // Initialize quantum particles
  useEffect(() => {
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      ] as [number, number, number],
      velocity: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      ] as [number, number, number],
      energy: Math.random(),
      phase: Math.random() * Math.PI * 2
    }));
    setQuantumParticles(particles);
  }, []);

    return () => {
      setQuantumParticles([]);
    };
  
  // Quantum field animation
  useEffect(() => {
  const animationActive = useRef(true);

  useEffect(() => {
    animationActive.current = true;
    return () => {
      animationActive.current = false;
    };
  }, []);
    return () => {
      // Cleanup animation when component unmounts
    };
  }, []);
  useFrame((state) => {
    if (!animationActive.current) return;
    if (fieldRef.current) {
      const time = state.clock.elapsedTime;
      
      // Update field energy
      const newEnergy = Math.sin(time * 0.5) * 0.5 + 0.5;
      setFieldEnergy(newEnergy);
      
      // Update quantum particles
      setQuantumParticles(prev => prev.map(particle => {
        // Update position based on velocity
        const newPosition: [number, number, number] = [
          particle.position[0] + particle.velocity[0],
          particle.position[1] + particle.velocity[1],
          particle.position[2] + particle.velocity[2]
        ];
        
        // Boundary check and bounce
        const bounds = [10, 10, 5];
        const newVelocity = [...particle.velocity] as [number, number, number];
        
        bounds.forEach((bound, i) => {
          if (Math.abs(newPosition[i]) > bound) {
            newVelocity[i] *= -1;
            newPosition[i] = Math.sign(newPosition[i]) * bound;
          }
        });
        
        // Update phase and energy
        const newPhase = (particle.phase + 0.01) % (Math.PI * 2);
        const newEnergy = Math.max(0.2, Math.min(1, particle.energy + (Math.random() - 0.5) * 0.1));
        
        return {
          ...particle,
          position: newPosition,
          velocity: newVelocity,
          phase: newPhase,
          energy: newEnergy
        };
      }));
      
      // Rotate field
      fieldRef.current.rotation.y = time * 0.1;
    }
  });
  
  return (
    <group ref={fieldRef}>
      {/* Quantum field grid */}
      <group>
        {Array.from({ length: 10 }).map((_, i) => (
          <group key={`grid-${i}`}>
            <Line
              points={[
                [-5, (i - 5) * 1, 0],
                [5, (i - 5) * 1, 0]
              ]}
            >
              <lineBasicMaterial 
                color="#001133" 
                transparent 
                opacity={0.1 + fieldEnergy * 0.1} 
              />
            </Line>
            <Line
              points={[
                [(i - 5) * 1, -5, 0],
                [(i - 5) * 1, 5, 0]
              ]}
            >
              <lineBasicMaterial 
                color="#001133" 
                transparent 
                opacity={0.1 + fieldEnergy * 0.1} 
              />
            </Line>
          </group>
        ))}
      </group>
      
      {/* Quantum particles */}
      {quantumParticles.map(particle => (
        <group key={particle.id} position={particle.position}>
          <Sphere args={[0.02, 4, 4]}>
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={particle.energy * 0.5}
            />
          </Sphere>
          
          {/* Particle trail */}
          <Trail
            width={0.5}
            length={3}
            color={new THREE.Color('#00ffff')}
            attenuation={(width) => width * particle.energy}
          >
            <Sphere args={[0.01, 4, 4]} />
          </Trail>
        </group>
      ))}
      
      {/* Portal quantum fields */}
      {services.map(service => (
        <group key={service.id} position={service.position3D}>
          {/* Portal quantum aura */}
          <Sphere args={[0.5, 16, 16]}>
            <meshBasicMaterial
              color={service.color}
              transparent
              opacity={service.id === activePortal ? 0.2 : 0.05}
            />
          </Sphere>
          
          {/* Quantum probability waves */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Torus
              key={i}
              args={[0.6 + i * 0.2, 0.02, 8, 32]}
              rotation={[Math.PI/2, 0, Date.now() * 0.001 * (0.1 + i * 0.05)]}
            >
              <meshBasicMaterial
                color={service.color}
                transparent
                opacity={(0.2 - i * 0.05) * (service.id === activePortal ? 1 : 0.3)}
              />
            </Torus>
          ))}
        </group>
      ))}
    </group>
  );
}

function PredictiveInteractionField({ predictions, services, onPredictionRealized }: { 
  predictions: TemporalPrediction[], 
  services: Service[],
  onPredictionRealized: (prediction: TemporalPrediction) => void
}) {
  const [predictionVisuals, setPredictionVisuals] = useState<Array<TemporalPrediction & { visualId: number; alpha: number; scale: number; position: [number, number, number] }>>([]);
  
  useEffect(() => {
    const visuals = predictions.map(prediction => ({
      ...prediction,
      visualId: Math.random(),
      alpha: 0,
      scale: 0.1,
      position: prediction.target ? 
        services.find((s: Service) => s.id === prediction.target)?.position3D || [0, 0, 0] as [number, number, number] :
        [Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 2 - 1] as [number, number, number]
    }));
    
    setPredictionVisuals(visuals);
    
    // Single timeout to handle all animations
    const timeout = setTimeout(() => {
      setPredictionVisuals(prev => 
        prev.map(visual => ({
          ...visual,
          alpha: visual.confidence,
          scale: 1
        }))
      );
    }, 200);
    
    return () => clearTimeout(timeout);
  }, [predictions, services]);

  return (
    <group>
      {predictionVisuals.map(visual => (
        <group key={visual.visualId} position={visual.position}>
          {/* Prediction probability sphere */}
          <Sphere args={[0.15 * visual.scale, 12, 12]}>
            <meshBasicMaterial 
              color={
                visual.type === 'nextPortal' ? '#00ffff' :
                visual.type === 'energyEvolution' ? '#ffff00' : '#ff00ff'
              }
              transparent
              opacity={visual.alpha * 0.3}
            />
          </Sphere>
          
          {/* Confidence visualization */}
          <Torus args={[0.2, 0.01, 4, 16]} rotation={[Math.PI/2, 0, 0]}>
            <meshBasicMaterial 
              color="white"
              transparent
              opacity={visual.confidence}
            />
          </Torus>
          
          {/* Prediction type indicator */}
          {visual.type === 'nextPortal' && (
            <Box args={[0.05, 0.05, 0.05]} position={[0, 0.3, 0]}>
              <meshBasicMaterial color="#00ffff" />
            </Box>
          )}
          
          {visual.type === 'energyEvolution' && (
            <Cylinder args={[0.02, 0.02, 0.3, 8]} position={[0, 0.3, 0]}>
              <meshBasicMaterial color="#ffff00" />
            </Cylinder>
          )}
        </group>
      ))}
    </group>
  );
}

// Reality distortion field component
function RealityDistortionField({ 
  distortionLevel, 
  const animationActive = useRef(true);

  useEffect(() => {
    animationActive.current = true;
    return () => {
      animationActive.current = false;
    };
  }, []);
  gravityWells, 
  quantumTunnels 
}: { 
  distortionLevel: number;
  gravityWells: GravityWell[];
  quantumTunnels: QuantumTunnel[];
}) {
  const fieldRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!animationActive.current) return;
    if (fieldRef.current) {
      const time = state.clock.elapsedTime;
      
      // Reality distortion effects
      fieldRef.current.rotation.x = Math.sin(time * 0.1) * distortionLevel * 0.1;
      fieldRef.current.rotation.y = Math.cos(time * 0.15) * distortionLevel * 0.1;
      
      // Impossible geometry animation
      if (distortionLevel > 0.5) {
        fieldRef.current.scale.setScalar(1 + Math.sin(time * 2) * distortionLevel * 0.05);
      }
    }
  });
  
  return (
    <group ref={fieldRef}>
      {/* Gravity wells visualization */}
      {gravityWells.map(well => (
        <group key={well.id} position={well.position}>
          {/* Gravitational lensing effect */}
          <Sphere args={[well.influence, 32, 32]}>
            <meshBasicMaterial 
              color="#000044"
              transparent
              opacity={0.1 * well.mass}
              side={THREE.DoubleSide}
            />
          </Sphere>
          
          {/* Accretion disk */}
          <Torus args={[well.influence * 1.5, well.influence * 0.1, 8, 32]}>
            <meshBasicMaterial 
              color="#4400ff"
              transparent
              opacity={0.3}
            />
          </Torus>
        </group>
      ))}
      
      {/* Quantum tunnels */}
      {quantumTunnels.map(tunnel => (
        <group key={tunnel.id}>
          {/* Tunnel entrance */}
          <Torus 
            args={[0.5, 0.1, 8, 16]}
            position={tunnel.startPosition}
          >
            <meshBasicMaterial 
              color="#ff00ff"
              transparent
              opacity={tunnel.stability}
            />
          </Torus>
          
          {/* Tunnel exit */}
          <Torus 
            args={[0.5, 0.1, 8, 16]}
            position={tunnel.endPosition}
          >
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={tunnel.stability}
            />
          </Torus>
          
          {/* Tunnel connecting particles */}
          {Array.from({ length: 10 }).map((_, i) => {
            const t = i / 9;
            const pos = [
              tunnel.startPosition[0] + (tunnel.endPosition[0] - tunnel.startPosition[0]) * t,
              tunnel.startPosition[1] + (tunnel.endPosition[1] - tunnel.startPosition[1]) * t,
              tunnel.startPosition[2] + (tunnel.endPosition[2] - tunnel.startPosition[2]) * t
            ] as [number, number, number];
            
            return (
              <Sphere key={i} args={[0.02, 6, 6]} position={pos}>
                <meshBasicMaterial 
                  color="white"
                  transparent
                  opacity={tunnel.stability * (1 - Math.abs(t - 0.5) * 2)}
                />
              </Sphere>
            );
          })}
        </group>
      ))}
      
      {/* Impossible geometry when reality distortion is high */}
      {distortionLevel > 0.7 && (
        <group>
          {/* Penrose stairs */}
          {generatePenroseStairs().map((step, i) => (
            <Box 
              key={i}
              args={[0.5, 0.1, 0.3]}
              position={step.position}
              rotation={step.rotation}
            >
              <meshStandardMaterial 
                color="#888888"
                transparent
                opacity={0.8}
              />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
}

function QuantumEntanglementEffect({ sourcePortal, targetPortal, entanglement }: {
  sourcePortal: Service;
  targetPortal: Service;
  entanglement: QuantumEntanglementData;
}) {
  const effectRef = useRef<THREE.Group | null>(null);
  
  useFrame((state) => {
    if (!animationActive.current) return;
    if (effectRef.current) {
      const time = state.clock.elapsedTime;
      effectRef.current.rotation.z = time * entanglement.resonance * 0.1;
      effectRef.current.scale.setScalar(1 + Math.sin(time * entanglement.resonance) * 0.1);
    }
  });
  
  const midpoint: [number, number, number] = [
    (sourcePortal.position3D[0] + targetPortal.position3D[0]) / 2,
    (sourcePortal.position3D[1] + targetPortal.position3D[1]) / 2,
    (sourcePortal.position3D[2] + targetPortal.position3D[2]) / 2
  ];
  
  return (
    <group ref={effectRef} position={midpoint}>
      {/* Entanglement field */}
      <Torus args={[0.3, 0.01, 8, 32]} rotation={[Math.PI/2, 0, entanglement.phase]}>
        <meshBasicMaterial 
          color="#00ffff"
          transparent
          opacity={entanglement.strength * 0.5}
        />
      </Torus>
      
      {/* Quantum particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.1;
        
        return (
          <Sphere
            key={i}
            args={[0.01, 6, 6]}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.2,
              Math.sin(angle) * radius
            ]}
          >
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0.5 + Math.sin(Date.now() * 0.002 + i) * 0.3}
            />
          </Sphere>
        );
      })}
      
      {/* Phase lines */}
      <group rotation={[0, entanglement.phase, 0]}>
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <Cylinder
              key={i}
              args={[0.002, 0.002, 0.6, 4]}
              position={[
                Math.cos(angle) * 0.3,
                0,
                Math.sin(angle) * 0.3
              ]}
              rotation={[Math.PI/2, 0, angle]}
            >
              <meshBasicMaterial 
                color="#80ffff"
                transparent
                opacity={entanglement.strength * 0.3}
              />
            </Cylinder>
          );
        })}
      </group>
    </group>
  );
}

// Move services definition outside component
const services: Service[] = [
  { 
    id: 'vetnav', 
    title: 'VetNav', 
    subtitle: 'Benefits Navigator', 
    position3D: [-3.5, 1.5, 0], 
    color: '#2563eb', 
    icon: ShieldCheck, 
    description: 'Navigate veteran benefits effectively.' 
  },
  { 
    id: 'tariff-explorer', 
    title: 'Tariff Explorer', 
    subtitle: 'Trade Insights', 
    position3D: [3.5, 1.5, 0], 
    color: '#10b981', 
    icon: BarChart3, 
    description: 'Explore and understand trade tariffs.' 
  },
  { 
    id: 'pet-radar', 
    title: 'Pet Radar', 
    subtitle: 'Lost & Found Pets', 
    position3D: [-2.5, -1.5, 0], 
    color: '#8b5cf6', 
    icon: PawPrint, 
    description: 'Help find lost pets in your area.' 
  },
  { 
    id: 'fundraiser', 
    title: 'Fundraiser Tool', 
    subtitle: 'Support Causes', 
    position3D: [2.5, -1.5, 0], 
    color: '#f59e0b', 
    icon: TrendingUp, 
    description: 'Manage and promote fundraising campaigns.' 
  }
];

// Neural network initialization helper
const initializeNeuralNetwork = (services: Service[]) => {
  const nodes = new Map<string, NeuralNode>();
  const synapses: NeuralSynapse[] = [];
  
  // Create nodes for each service
  services.forEach(service => {
    const node = new NeuralNode(
      service.id,
      service.position3D,
      'service'
    );
    nodes.set(service.id, node);
  });
  
  // Create synapses between nodes
  Array.from(nodes.values()).forEach(node1 => {
    Array.from(nodes.values()).forEach(node2 => {
      if (node1.id !== node2.id) {
        const synapse = new NeuralSynapse(node1, node2);
        synapses.push(synapse);
      }
    });
  });
  
  return { nodes, synapses };
};

export default function Landing3D() {
  // All useState declarations at the top
  const [isMounted, setIsMounted] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [portalState, setPortalState] = useState<PortalState>({
    activePortal: null,
    expansionProgress: 0,
    isTransitioning: false
  });
  const [viewportState, setViewportState] = useState<ViewportState>({
    isEngulfed: false,
    engulfmentProgress: 0,
    targetApp: null
  });
  const [appTransition, setAppTransition] = useState<AppTransitionState>({
    isTransitioning: false,
    currentApp: null,
    transitionProgress: 0
  });
  const [dimensionalLayers, setDimensionalLayers] = useState({
    currentLayer: 0,
    totalLayers: 3,
    layerOffset: 0,
    isShifting: false
  });
  const [consequenceNetwork, setConsequenceNetwork] = useState({
    nodes: new Map<string, any>(),
    connections: [],
    energy: 100,
    resonance: 0
  });
  const [crossPortalEffects, setCrossPortalEffects] = useState({
    resonanceField: new Map<string, any>(),
    activeInfluences: [],
    harmonic: 0
  });
  const [portalPerspective, setPortalPerspective] = useState({
    tilt: { x: 0, y: 0 },
    depth: 0,
    magneticField: 0
  });
  const [temporalHistory, setTemporalHistory] = useState<TemporalHistory>({
    interactions: [],
    patterns: new Map(),
    predictions: [],
    timeStreamId: Date.now()
  });
  const [portalConsciousness, setPortalConsciousness] = useState<Map<string, PortalConsciousnessData>>(new Map());
  const [quantumStates, setQuantumStates] = useState<QuantumStates>({
    superposition: new Map(),
    entanglement: new Map(),
    coherence: 1.0,
    uncertainty: 0.0
  });
  const [neuralNetwork, setNeuralNetwork] = useState({
    nodes: new Map<string, NeuralNode>(),
    synapses: [] as NeuralSynapse[],
    activationPattern: [],
    learningRate: 0.01,
    memoryCapacity: 1000,
    consciousness: 0,
    creativity: 0,
    intuition: 0
  });
  const [emergentAI, setEmergentAI] = useState({
    globalConsciousness: 0,
    emergentBehaviors: [] as string[],
    creativityIndex: 0,
    intuitionLevel: 0,
    empathyScore: 0,
    curiosityDrive: 0.5,
    autonomy: 0,
    goals: [] as string[],
    fears: [] as string[],
    desires: [] as string[],
    memories: [] as any[],
    personality: {
      openness: Math.random(),
      conscientiousness: Math.random(),
      extraversion: Math.random(),
      agreeableness: Math.random(),
      neuroticism: Math.random()
    }
  });
  const [hyperdimensionalSpace, setHyperdimensionalSpace] = useState<HyperdimensionalState>({
    dimensions: 11,
    manifolds: new Map(),
    curvature: 0,
    spatialFolds: [],
    realityAnchors: [],
    dimensionalStability: 1.0
  });
  const [realityField, setRealityField] = useState<RealityFieldState>({
    distortionLevel: 0,
    spatialAnchors: [],
    timeDialation: 1.0,
    gravityWells: [],
    quantumTunnels: [],
    realityStability: 1.0,
    impossibleGeometry: false
  });

  // Add quantum entanglement state
  const [quantumEntanglements, setQuantumEntanglements] = useState<Map<string, QuantumEntanglementData>>(new Map());

  // Call the viewport hook
  const viewport = useViewportSize();

  // Initialize mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);
    return () => {
      setIsMounted(false);
    };

  // Device orientation effect
  useEffect(() => {
    if (!isMounted) return;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const tiltX = ((event.beta ?? 0) - 90) * 0.01;
      const tiltY = (event.gamma ?? 0) * 0.01;
      const depth = Math.abs((event.alpha ?? 0) % 360 - 180) * 0.001;
      
      setPortalPerspective({
        tilt: { x: tiltX, y: tiltY },
        depth: depth,
        magneticField: Math.sin((event.alpha ?? 0) * 0.017) * 0.5
      });
    };
    
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [isMounted]);

  // Initialize systems effect
  useEffect(() => {
    if (!isMounted) return;
    
    // Use the external initializeNeuralNetwork function
    const { nodes, synapses } = initializeNeuralNetwork(services);
    setNeuralNetwork(prev => ({
      ...prev,
      nodes,
      synapses
    }));

    return () => {
      setNeuralNetwork(prev => ({
        ...prev,
        nodes: new Map(),
        synapses: []
      }));
    };
    
    // Initialize portal consciousness
    const consciousness = new Map<string, PortalConsciousnessData>();
    services.forEach(service => {
      consciousness.set(service.id, {
        awareness: Math.random() * 0.5 + 0.3,
        memory: [],
        personality: {
          curiosity: Math.random(),
          responsiveness: Math.random(),
          patience: Math.random(),
          creativity: Math.random()
        },
        currentMood: 'neutral',
        interactionHistory: [],
        learningRate: 0.1
      });
    });
    setPortalConsciousness(consciousness);
    
    // Create hyperdimensional manifolds
    const newManifolds = new Map<string, any>();
    services.forEach(service => {
      const manifold = generatePortalManifold(service.id, service.position3D);
      newManifolds.set(service.id, manifold);
    });
    
    setHyperdimensionalSpace(prev => ({
      ...prev,
      manifolds: newManifolds
    }));
  }, [isMounted, services]);

  // Dimensional layer navigation effect
  useEffect(() => {
    if (!isMounted) return;
    
    const tiltThreshold = 0.3;
    const shouldShift = Math.abs(portalPerspective.tilt.x) > tiltThreshold && !dimensionalLayers.isShifting;
    const direction = portalPerspective.tilt.x > 0 ? 1 : -1;
    const newLayer = Math.max(0, Math.min(
      dimensionalLayers.totalLayers - 1,
      dimensionalLayers.currentLayer + (shouldShift ? direction : 0)
    ));
    
    if (shouldShift && newLayer !== dimensionalLayers.currentLayer) {
      setDimensionalLayers(prev => ({
        ...prev,
        currentLayer: newLayer,
        isShifting: true
      }));
    }
    
    // Single timeout to handle shift completion
    const timeout = setTimeout(() => {
      if (dimensionalLayers.isShifting) {
        setDimensionalLayers(prev => ({ ...prev, isShifting: false }));
      }
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [portalPerspective.tilt.x, dimensionalLayers.currentLayer, dimensionalLayers.isShifting, isMounted, dimensionalLayers.totalLayers]);

  // Add handleServiceObjectClick function
  const handleServiceObjectClick = (id: string) => {
    if (portalState.activePortal === id && portalState.isTransitioning) return;
    if (portalState.activePortal && portalState.activePortal !== id && portalState.isTransitioning) return;
    
    const newActiveServiceId = activeServiceId === id ? null : id;
    setActiveServiceId(newActiveServiceId);
    
    // Create quantum entanglement with previously clicked portal
    if (activeServiceId && activeServiceId !== id) {
      const entanglementKey = `${activeServiceId}-${id}`;
      const reverseKey = `${id}-${activeServiceId}`;
      
      if (!quantumEntanglements.has(entanglementKey) && !quantumEntanglements.has(reverseKey)) {
        setQuantumEntanglements(prev => {
          const newEntanglements = new Map(prev);
          newEntanglements.set(entanglementKey, {
            strength: Math.random() * 0.8 + 0.2,
            resonance: Math.random() * 2 * Math.PI,
            phase: Math.random() * Math.PI * 2
          });
          return newEntanglements;
        });
      }
    }
    
    if (activeServiceId === id && portalState.isTransitioning && portalState.activePortal === id) {
      setPortalState({ activePortal: null, expansionProgress: 0, isTransitioning: false });
      setViewportState(prev => ({...prev, isEngulfed: false, engulfmentProgress: 0, targetApp: null}));
    }

    // Record temporal interaction
    const service = services.find(s => s.id === id);
    if (service) {
      const temporalEvent: TemporalEvent = {
        eventId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        type: 'click',
        portalId: id,
        position: service.position3D,
        energy: 1.0,
        consequenceSpawn: 1,
        dimensionalLayer: dimensionalLayers.currentLayer
      };

      setTemporalHistory(prev => {
        const newInteractions = [...prev.interactions, temporalEvent];
        
        // Keep only last 50 interactions
        const trimmedInteractions = newInteractions.length > 50 ? 
          newInteractions.slice(-50) : newInteractions;

        // Update patterns
        const newPatterns = new Map<string, any>();
        
        // Analyze portal sequences
        const portalSequences = trimmedInteractions
          .filter(event => event.type === 'click')
          .map(event => event.portalId);

        if (portalSequences.length >= 2) {
          const sequencePatterns = new Map<string, number>();
          for (let i = 0; i < portalSequences.length - 1; i++) {
            const sequence = `${portalSequences[i]}->${portalSequences[i + 1]}`;
            sequencePatterns.set(sequence, (sequencePatterns.get(sequence) || 0) + 1);
          }
          newPatterns.set('portalSequences', sequencePatterns);
        }

        // Analyze dimensional layers
        const layerCounts = trimmedInteractions.reduce((acc, event) => {
          acc[event.dimensionalLayer] = (acc[event.dimensionalLayer] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        newPatterns.set('layerPreferences', layerCounts);

        // Analyze energy trends
        const energyTrends = trimmedInteractions.slice(-10).map(event => event.energy);
        const avgEnergy = energyTrends.reduce((a, b) => a + b, 0) / energyTrends.length;
        const energyTrend = energyTrends[energyTrends.length - 1] > avgEnergy ? 'increasing' : 'decreasing';
        newPatterns.set('energyTrend', energyTrend);

        // Generate predictions
        const predictions: TemporalPrediction[] = [];
        const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Portal sequence prediction
        const portalSequencePatterns = newPatterns.get('portalSequences') as Map<string, number>;
        if (portalSequencePatterns && trimmedInteractions.length > 0) {
          const lastPortal = trimmedInteractions[trimmedInteractions.length - 1].portalId;
          let maxCount = 0;
          let likelyNextPortal: string | null = null;

          portalSequencePatterns.forEach((count, sequence) => {
            const [source, target] = sequence.split('->');
            if (source === lastPortal && count > maxCount) {
              maxCount = count;
              likelyNextPortal = target;
            }
          });

          if (likelyNextPortal) {
            predictions.push({
              predictionId: generateId(),
              type: 'nextPortal',
              target: likelyNextPortal,
              confidence: maxCount / trimmedInteractions.length,
              timeframe: 5000
            });
          }
        }

        // Energy evolution prediction
        predictions.push({
          predictionId: generateId(),
          type: 'energyEvolution',
          confidence: 0.7,
          timeframe: 3000,
          trend: energyTrend
        });

        // Dimensional shift prediction
        const entries = Object.entries(layerCounts);
        if (entries.length > 0) {
          const [mostActiveLayer] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
          predictions.push({
            predictionId: generateId(),
            type: 'dimensionalShift',
            target: mostActiveLayer,
            confidence: 0.6,
            timeframe: 8000
          });
        }

        return {
          ...prev,
          interactions: trimmedInteractions,
          patterns: newPatterns,
          predictions
        };
      });

      // Update portal consciousness
      const consciousness = portalConsciousness.get(id);
      if (consciousness) {
        const updatedConsciousness = {
          ...consciousness,
          awareness: Math.min(1, consciousness.awareness + 0.05),
          memory: [
            ...consciousness.memory.slice(-19),
            {
              timestamp: Date.now(),
              type: 'click',
              userBehavior: 'direct',
              response: consciousness.currentMood
            }
          ],
          personality: {
            ...consciousness.personality,
            responsiveness: Math.min(1, consciousness.personality.responsiveness + 0.02)
          },
          currentMood: consciousness.memory.filter(m => 
            m.type === 'successful' || m.type === 'exploratory'
          ).length > 3 ? 'excited' : 'curious'
        };
        
        setPortalConsciousness(prev => {
          const newMap = new Map(prev);
          newMap.set(id, updatedConsciousness);
          return newMap;
        });
      }
    }
  };

  // Add this effect at the top level with other effects
  useEffect(() => {
    // Create quantum tunnels for all entanglements
    const newTunnels = Array.from(quantumEntanglements.entries())
      .map(([key, entanglement]) => {
        const [portal1Id, portal2Id] = key.split('-');
        const sourcePortal = services.find(s => s.id === portal1Id);
        const targetPortal = services.find(s => s.id === portal2Id);
        
        if (!sourcePortal || !targetPortal) return null;
        
        return createQuantumTunnel(
          sourcePortal.position3D,
          targetPortal.position3D,
          entanglement.strength
        );
      })
      .filter((tunnel): tunnel is QuantumTunnel => tunnel !== null);

    setRealityField(prev => ({
      ...prev,
      quantumTunnels: [...prev.quantumTunnels, ...newTunnels]
    }));
  }, [quantumEntanglements, services]);

  // Update Canvas content
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {isMounted && (
        <div className="w-full h-full">
          <Canvas
            camera={{ 
              position: [0, 0, viewport.aspect < 1 ? 14 : 11],
              fov: viewport.aspect < 1 ? 65 : 50
            }}
            className="w-full h-full"
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color('#05050a'));
            }}
          >
            <Suspense fallback={
              <Html center>
                <span style={{color: 'white'}}>Loading Hyperdimensional Neural Reality...</span>
              </Html>
            }>
              {/* Reality distortion field */}
              <RealityDistortionField 
                distortionLevel={realityField.distortionLevel}
                gravityWells={realityField.gravityWells}
                quantumTunnels={realityField.quantumTunnels}
              />
              
              {/* Hyperdimensional manifold projections */}
              {Array.from(hyperdimensionalSpace.manifolds.values()).map(manifold => (
                <group key={manifold.id} position={manifold.basePosition}>
                  {/* Curvature field visualization */}
                  {manifold.curvatureField.map((field, i) => (
                    <Sphere
                      key={i}
                      args={[0.02, 6, 6]}
                      position={[
                        field.position[0] * 0.5,
                        field.position[1] * 0.5,
                        field.position[2] * 0.5
                      ]}
                    >
                      <meshBasicMaterial 
                        color={`hsl(${field.curvature * 180 + 180}, 70%, 50%)`}
                        transparent
                        opacity={field.intensity}
                      />
                    </Sphere>
                  ))}
                </group>
              ))}

              {/* Quantum field */}
              <QuantumPortalField 
                services={services}
                activePortal={activeServiceId}
                onQuantumCollapse={(portalId) => {
                  // Create gravity well on quantum collapse
                  const service = services.find(s => s.id === portalId);
                  if (service) {
                    const well = createGravityWell(
                      service.position3D,
                      Math.random() * 0.5 + 0.5,
                      portalId
                    );
                    setRealityField(prev => ({
                      ...prev,
                      gravityWells: [...prev.gravityWells, well]
                    }));
                  }
                }}
              />

              {/* Quantum entanglement effects with reality distortion */}
              {Array.from(quantumEntanglements.entries()).map(([key, entanglement]) => {
                const [portal1Id, portal2Id] = key.split('-');
                const sourcePortal = services.find(s => s.id === portal1Id);
                const targetPortal = services.find(s => s.id === portal2Id);
                
                if (!sourcePortal || !targetPortal) return null;
                
                return (
                  <QuantumEntanglementEffect
                    key={key}
                    sourcePortal={sourcePortal}
                    targetPortal={targetPortal}
                    entanglement={entanglement}
                  />
                );
              })}

              {/* Predictive interaction field */}
              <PredictiveInteractionField 
                predictions={temporalHistory.predictions}
                services={services}
                onPredictionRealized={(prediction) => {
                  console.log('Prediction realized:', prediction);
                  const targetPortalId = prediction.target;
                  if (targetPortalId) {
                    // Update portal consciousness on prediction realization
                    const consciousness = portalConsciousness.get(targetPortalId);
                    if (consciousness) {
                      const updatedConsciousness = {
                        ...consciousness,
                        awareness: Math.min(1, consciousness.awareness + 0.05),
                        memory: [
                          ...consciousness.memory.slice(-19),
                          {
                            timestamp: Date.now(),
                            type: 'prediction',
                            userBehavior: 'realized',
                            response: consciousness.currentMood
                          }
                        ],
                        personality: {
                          ...consciousness.personality,
                          responsiveness: Math.min(1, consciousness.personality.responsiveness + 0.02)
                        },
                        currentMood: 'excited'
                      };
                      
                      setPortalConsciousness(prev => {
                        const newMap = new Map(prev);
                        newMap.set(targetPortalId, updatedConsciousness);
                        return newMap;
                      });
                    }
                  }
                }}
              />

              {/* Service objects */}
              {services.map((service) => (
                <ServiceObject
                  key={service.id}
                  service={service}
                  isActive={service.id === activeServiceId}
                  onClick={() => handleServiceObjectClick(service.id)}
                  portalState={portalState}
                  consciousness={portalConsciousness.get(service.id)}
                />
              ))}

              {/* Environment and controls */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
              />
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[10, 10, 10]} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}
