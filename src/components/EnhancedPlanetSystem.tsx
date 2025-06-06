"use client";
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetData {
  id: string;
  name: string;
  app: string;
  position: [number, number, number];
  size: number;
  color: string;
  description: string;
  features: string[];
  textureUrl?: string;
}

const PLANET_DATA: PlanetData[] = [
  {
    id: 'vetnav',
    name: 'VetNav Command',
    app: 'vetnav',
    position: [-15, 5, 0],
    size: 3,
    color: '#1e40af',
    description: 'Veterans Benefits Navigation Hub - Your mission-critical command center for navigating veteran benefits and services.',
    features: ['Benefits Navigator', 'State Resources', 'Federal Programs', 'Transition Support'],
    textureUrl: '/textures/vetnav-planet.jpg'
  },
  {
    id: 'tariff',
    name: 'Trade Analytics',
    app: 'tariff-explorer',
    position: [15, -5, 0],
    size: 2.5,
    color: '#059669',
    description: 'Advanced trade data analysis and tariff intelligence systems.',
    features: ['Market Analysis', 'Trade Patterns', 'Economic Insights', 'Data Visualization'],
  },
  {
    id: 'petradar',
    name: 'Pet Radar',
    app: 'pet-radar',
    position: [-8, -12, 0],
    size: 2,
    color: '#7c3aed',
    description: 'Advanced pet location and adoption coordination network.',
    features: ['Lost Pet Finder', 'Adoption Network', 'Pet Services', 'Community Hub'],
  },
  {
    id: 'jetshome',
    name: 'Jets Analytics',
    app: 'jetshome',
    position: [8, 12, 0],
    size: 2,
    color: '#dc2626',
    description: 'Professional sports analytics and performance tracking systems.',
    features: ['Game Analytics', 'Player Stats', 'Performance Metrics', 'Predictive Models'],
  }
];

function EnhancedPlanet({ data, onClick, isSelected }: { 
  data: PlanetData; 
  onClick: (data: PlanetData) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Enhanced planet materials
  const planetMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float uTime;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        
        vec3 pos = position;
        pos += normal * sin(uTime + position.x * 10.0) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform bool uSelected;
      uniform bool uHovered;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vec3 baseColor = uColor;
        
        // Add surface detail
        float surface = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.1;
        baseColor += surface;
        
        // Lighting
        vec3 light = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, light), 0.0);
        
        // Selection glow
        if (uSelected) {
          baseColor += vec3(0.3, 0.3, 0.0) * sin(uTime * 5.0);
        }
        
        // Hover effect
        if (uHovered) {
          baseColor += vec3(0.2, 0.2, 0.2);
        }
        
        gl_FragColor = vec4(baseColor * (0.3 + diff * 0.7), 1.0);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(data.color) },
      uTime: { value: 0 },
      uSelected: { value: isSelected },
      uHovered: { value: hovered }
    }
  });

  // Atmosphere material
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      varying vec3 vNormal;
      
      void main() {
        vec3 camera = normalize(cameraPosition);
        float rim = 1.0 - max(dot(vNormal, camera), 0.0);
        rim = pow(rim, 2.0);
        
        vec3 atmosColor = uColor * 0.5;
        float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
        
        gl_FragColor = vec4(atmosColor, rim * 0.6 * pulse);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(data.color) },
      uTime: { value: 0 }
    },
    transparent: true,
    side: THREE.BackSide
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      planetMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      planetMaterial.uniforms.uSelected.value = isSelected;
      planetMaterial.uniforms.uHovered.value = hovered;
    }
    if (atmosphereRef.current) {
      atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={data.position}>
      {/* Planet Core */}
      <mesh
        ref={meshRef}
        material={planetMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[data.size, 64, 64]} />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[data.size * 1.1, 32, 32]} />
      </mesh>
      
      {/* Selection Ring */}
      {(isSelected || hovered) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size * 1.3, data.size * 1.4, 64]} />
          <meshBasicMaterial 
            color={data.color} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

interface EnhancedPlanetSystemProps {
  onPlanetClick: (data: PlanetData) => void;
  selectedPlanet?: PlanetData | null;
}

export function EnhancedPlanetSystem({ onPlanetClick, selectedPlanet }: EnhancedPlanetSystemProps) {
  return (
    <group>
      {PLANET_DATA.map((planet) => (
        <EnhancedPlanet
          key={planet.id}
          data={planet}
          onClick={onPlanetClick}
          isSelected={selectedPlanet?.id === planet.id}
        />
      ))}
    </group>
  );
}

export { PLANET_DATA };
export type { PlanetData };
