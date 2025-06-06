"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Moon Component
function PlanetMoon({ 
  size, 
  distance, 
  speed, 
  color, 
  planetPosition 
}: { 
  size: number; 
  distance: number; 
  speed: number; 
  color: string;
  planetPosition: [number, number, number];
}) {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  const moonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          
          // Subtle surface variation
          vec3 pos = position + normal * sin(uTime + position.x * 10.0) * 0.02;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Simple noise for surface texture
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec3 baseColor = uColor;
          
          // Surface craters and texture
          float craters = noise(vUv * 8.0);
          baseColor *= 0.7 + craters * 0.3;
          
          // Simple lighting
          vec3 light = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, light), 0.0);
          
          vec3 finalColor = baseColor * (0.3 + diff * 0.7);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 }
      }
    });
  }, [color]);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed;
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.01;
      moonMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={orbitRef} position={planetPosition}>
      <mesh ref={moonRef} position={[distance, 0, 0]} material={moonMaterial}>
        <sphereGeometry args={[size, 16, 16]} />
      </mesh>
    </group>
  );
}

// Ring System Component
function PlanetRings({ 
  innerRadius, 
  outerRadius, 
  planetPosition, 
  color,
  segments = 128 
}: { 
  innerRadius: number; 
  outerRadius: number; 
  planetPosition: [number, number, number];
  color: string;
  segments?: number;
}) {
  const ringsRef = useRef<THREE.Mesh>(null);

  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uInnerRadius;
        uniform float uOuterRadius;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function for ring gaps
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center) * 2.0;
          
          // Ring bands
          float ringPattern = sin(dist * 50.0) * 0.5 + 0.5;
          
          // Ring gaps (Cassini division style)
          float gaps = noise(vec2(dist * 10.0, uTime * 0.1));
          gaps = step(0.8, gaps);
          
          // Fade at edges
          float innerFade = smoothstep(0.3, 0.4, dist);
          float outerFade = 1.0 - smoothstep(0.8, 1.0, dist);
          
          vec3 ringColor = uColor * ringPattern;
          float alpha = innerFade * outerFade * (1.0 - gaps * 0.5) * 0.7;
          
          gl_FragColor = vec4(ringColor, alpha);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
        uInnerRadius: { value: innerRadius },
        uOuterRadius: { value: outerRadius }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, [color, innerRadius, outerRadius]);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.001;
      ringMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh 
      ref={ringsRef} 
      position={planetPosition} 
      rotation={[Math.PI / 2, 0, 0]}
      material={ringMaterial}
    >
      <ringGeometry args={[innerRadius, outerRadius, segments]} />
    </mesh>
  );
}

// Asteroid Belt Component
function AsteroidBelt({ 
  radius, 
  planetPosition, 
  count = 100 
}: { 
  radius: number; 
  planetPosition: [number, number, number];
  count?: number;
}) {
  const asteroidsRef = useRef<THREE.InstancedMesh>(null);

  const { positions, rotations } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 1;
      
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      
      rotations[i * 3] = Math.random() * Math.PI;
      rotations[i * 3 + 1] = Math.random() * Math.PI;
      rotations[i * 3 + 2] = Math.random() * Math.PI;
    }
    
    return { positions, rotations };
  }, [count, radius]);

  useFrame((state) => {
    if (asteroidsRef.current) {
      const time = state.clock.elapsedTime;
      const dummy = new THREE.Object3D();
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        dummy.position.set(
          positions[i3] + planetPosition[0],
          positions[i3 + 1] + planetPosition[1],
          positions[i3 + 2] + planetPosition[2]
        );
        dummy.rotation.set(
          rotations[i3] + time * 0.01,
          rotations[i3 + 1] + time * 0.02,
          rotations[i3 + 2] + time * 0.015
        );
        dummy.scale.setScalar(0.1 + Math.random() * 0.05);
        dummy.updateMatrix();
        asteroidsRef.current.setMatrixAt(i, dummy.matrix);
      }
      asteroidsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={asteroidsRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.8} metalness={0.2} />
    </instancedMesh>
  );
}

// Multi-Moon System Component
function MoonSystem({ 
  planetPosition, 
  moons 
}: { 
  planetPosition: [number, number, number];
  moons: Array<{
    size: number;
    distance: number;
    speed: number;
    color: string;
    name: string;
  }>;
}) {
  return (
    <group>
      {moons.map((moon, index) => (
        <PlanetMoon
          key={index}
          size={moon.size}
          distance={moon.distance}
          speed={moon.speed}
          color={moon.color}
          planetPosition={planetPosition}
        />
      ))}
    </group>
  );
}

export { PlanetMoon, PlanetRings, AsteroidBelt, MoonSystem };
