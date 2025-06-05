"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  onClick: () => void;
  isSelected?: boolean;
}

export function VetNavPlanet({ position, onClick, isSelected = false }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.15;
    }
  });
  
  const scale = isSelected ? 2 : 1;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Main planet - Earth-like */}
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.8}
          metalness={0.1}
          emissive="#001122"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Aurora effect */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.8, 16]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Html position={[0, 2.5, 0]} center>
        <div className="text-white text-center font-bold pointer-events-none">
          <div className="text-2xl">🎖️</div>
          <div>VetNav</div>
        </div>
      </Html>
    </group>
  );
}

export function JetsHomePlanet({ position, onClick, isSelected = false }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });
  
  const scale = isSelected ? 2 : 1;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Sports planet - Green with stadium lights */}
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#2d7d32"
          roughness={0.6}
          metalness={0.2}
          emissive="#004400"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Stadium ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[2, 2.5, 32]} />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Html position={[0, 2.5, 0]} center>
        <div className="text-white text-center font-bold pointer-events-none">
          <div className="text-2xl">🏈</div>
          <div>JetsHome</div>
        </div>
      </Html>
    </group>
  );
}

export function PetRadarPlanet({ position, onClick, isSelected = false }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.25;
    }
  });
  
  const scale = isSelected ? 2 : 1;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Vibrant animal planet */}
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff9800"
          roughness={0.4}
          metalness={0.1}
          emissive="#ff4400"
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Floating hearts/paws */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * Math.PI / 3) * 2.5,
            Math.cos(i * Math.PI / 3) * 1.5,
            Math.sin(i * Math.PI / 2) * 1.5
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ffb74d" emissive="#ff8a65" emissiveIntensity={0.3} />
        </mesh>
      ))}
      
      <Html position={[0, 2.5, 0]} center>
        <div className="text-white text-center font-bold pointer-events-none">
          <div className="text-2xl">🐾</div>
          <div>Pet Radar</div>
        </div>
      </Html>
    </group>
  );
}

export function TradeExplorerPlanet({ position, onClick, isSelected = false }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const crystalRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
    crystalRefs.current.forEach((crystal, i) => {
      if (crystal) {
        crystal.rotation.y += delta * (1 + i * 0.5);
      }
    });
  });
  
  const scale = isSelected ? 2 : 1;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Industrial/crystalline planet */}
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#7b1fa2"
          roughness={0.2}
          metalness={0.8}
          emissive="#4a148c"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Floating crystals */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={i}
          ref={el => { if (el) crystalRefs.current[i] = el; }}
          position={[
            Math.sin(i * Math.PI / 2) * 3,
            Math.cos(i * Math.PI / 2) * 2,
            Math.sin(i * Math.PI / 4) * 2
          ]}
        >
          <octahedronGeometry args={[0.3]} />
          <meshBasicMaterial color="#e1bee7" emissive="#ba68c8" emissiveIntensity={0.4} />
        </mesh>
      ))}
      
      <Html position={[0, 2.5, 0]} center>
        <div className="text-white text-center font-bold pointer-events-none">
          <div className="text-2xl">📊</div>
          <div>Trade Explorer</div>
        </div>
      </Html>
    </group>
  );
}
