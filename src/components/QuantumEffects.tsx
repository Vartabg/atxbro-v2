"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Hyperdimensional coordinate system (from your research!)
class HyperdimensionalCoordinate {
  coords: number[];
  magnitude: number;
  phase: number;

  constructor(coords: number[]) {
    this.coords = coords;
    this.magnitude = Math.sqrt(coords.reduce((sum, c) => sum + c * c, 0));
    this.phase = Math.atan2(coords[1] || 0, coords[0] || 0);
  }

  distort(factor: number): HyperdimensionalCoordinate {
    return new HyperdimensionalCoordinate(
      this.coords.map(c => c * (1 + Math.sin(factor) * 0.1))
    );
  }
}

// Quantum particle field
export function QuantumParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { geometry, material } = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Hyperdimensional positioning
      const hyperCoord = new HyperdimensionalCoordinate([
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        Math.random() * Math.PI * 2 // 4th dimension for phase
      ]);
      
      positions[i * 3] = hyperCoord.coords[0];
      positions[i * 3 + 1] = hyperCoord.coords[1];
      positions[i * 3 + 2] = hyperCoord.coords[2];
      
      phases[i] = hyperCoord.coords[3];
      
      // Quantum energy colors
      const energy = Math.random();
      colors[i * 3] = energy * 0.5;
      colors[i * 3 + 1] = 0.8 + energy * 0.2;
      colors[i * 3 + 2] = 1.0;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float phase;
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          vColor = color;
          vPhase = phase;
          
          vec3 pos = position;
          pos.x += sin(uTime + phase) * 2.0;
          pos.y += cos(uTime * 0.7 + phase) * 1.5;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 3.0 + sin(uTime + phase) * 2.0;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vPhase;
        uniform float uTime;
        
        void main() {
          float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + vPhase);
          vec3 finalColor = vColor * pulse;
          
          float dist = length(gl_PointCoord - 0.5);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          gl_FragColor = vec4(finalColor, alpha * 0.8);
        }
      `,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    return { geometry, material };
  }, []);
  
  useFrame((state) => {
    if (material.uniforms.uTime) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });
  
  return <points ref={particlesRef} geometry={geometry} material={material} />;
}

// Gravitational wave effect
export function GravitationalWaves() {
  const waveRef = useRef<THREE.Mesh>(null);
  
  const waveMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          float wave = sin(length(pos.xz) * 0.1 - uTime * 2.0) * 0.5;
          pos.y += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        
        void main() {
          float dist = length(vPosition.xz);
          float wave = sin(dist * 0.1 - uTime * 2.0) * 0.5 + 0.5;
          
          vec3 color = vec3(0.1, 0.3, 0.8) * wave;
          float alpha = (1.0 - smoothstep(0.0, 50.0, dist)) * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame((state) => {
    if (waveMaterial.uniforms.uTime) {
      waveMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh ref={waveRef} material={waveMaterial} position={[0, -20, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
    </mesh>
  );
}
