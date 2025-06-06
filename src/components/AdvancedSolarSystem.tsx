"use client";
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Planet {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  description: string;
  icon: string;
}

const PLANETS: Planet[] = [
  {
    id: 'vetnav',
    name: 'VetNav',
    position: [-8, 2, 0],
    color: '#2563eb',
    description: 'Veterans Benefits & Transition Hub',
    icon: '🎖️'
  },
  {
    id: 'jetshome',
    name: 'JetsHome',
    position: [8, 2, 0],
    color: '#2d7d32',
    description: 'Sports Analytics & Statistics',
    icon: '🏈'
  },
  {
    id: 'petradar',
    name: 'Pet Radar',
    position: [-6, -3, 0],
    color: '#ff9800',
    description: 'Lost & Found Pet Network',
    icon: '🐾'
  },
  {
    id: 'tariff-explorer',
    name: 'Trade Explorer',
    position: [6, -3, 0],
    color: '#7b1fa2',
    description: 'Global Trade Insights',
    icon: '📊'
  }
];

function AdvancedPlanet({ planet, isSelected, onClick }: any) {
  const planetRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group ref={planetRef} position={planet.position}>
      <mesh 
        ref={surfaceRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(planet);
        }}
        scale={isSelected ? 1.5 : 1}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.7}
          metalness={0.1}
          emissive={planet.color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export function AdvancedSolarSystem({ onPlanetSelect }: any) {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  
  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
    onPlanetSelect(planet);
  };
  
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF8C00"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {PLANETS.map((planet) => (
        <AdvancedPlanet
          key={planet.id}
          planet={planet}
          isSelected={selectedPlanet?.id === planet.id}
          onClick={handlePlanetClick}
        />
      ))}
      
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 12 + Math.random() * 2;
        return (
          <mesh key={i} position={[
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.5,
            Math.sin(angle) * radius
          ]}>
            <dodecahedronGeometry args={[0.1]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        );
      })}
    </group>
  );
}
