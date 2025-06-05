"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  onClick: () => void;
  isSelected?: boolean;
  id: string;
}

export function EnhancedPlanet({ position, onClick, isSelected = false, id }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
  });
  
  const scale = isSelected ? 1.5 : 1;
  
  // Different colors and effects per planet
  const planetConfig = {
    vetnav: { 
      color: "#4a90e2", 
      emissive: "#001122", 
      icon: "🎖️", 
      name: "VetNav",
      atmosphereColor: "#87ceeb"
    },
    'jets-stats': { 
      color: "#2d7d32", 
      emissive: "#004400", 
      icon: "🏈", 
      name: "JetsHome",
      atmosphereColor: "#66bb6a"
    },
    'pet-radar': { 
      color: "#ff9800", 
      emissive: "#ff4400", 
      icon: "🐾", 
      name: "Pet Radar",
      atmosphereColor: "#ffb74d"
    },
    'tariff-explorer': { 
      color: "#7b1fa2", 
      emissive: "#4a148c", 
      icon: "📊", 
      name: "Trade Explorer",
      atmosphereColor: "#ba68c8"
    }
  };
  
  const config = planetConfig[id as keyof typeof planetConfig] || planetConfig.vetnav;
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Main planet */}
      <mesh 
        ref={planetRef} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.7}
          metalness={0.1}
          emissive={config.emissive}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Simple atmosphere */}
      <mesh>
        <sphereGeometry args={[1.65, 16, 16]} />
        <meshBasicMaterial
          color={config.atmosphereColor}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet label */}
      <Html position={[0, 2.5, 0]} center>
        <div className="text-white text-center font-bold pointer-events-none">
          <div className="text-2xl mb-1">{config.icon}</div>
          <div className="text-sm">{config.name}</div>
        </div>
      </Html>
    </group>
  );
}
