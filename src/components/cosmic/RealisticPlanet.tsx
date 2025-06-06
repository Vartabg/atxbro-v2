"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticPlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  rotationSpeed?: number;
  onClick?: () => void;
}

export function RealisticPlanet({
  position,
  size,
  color,
  name,
  hasAtmosphere = true,
  atmosphereColor = "#4a90e2",
  rotationSpeed = 0.01,
  onClick
}: RealisticPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed * delta;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += rotationSpeed * delta * 0.8;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <Sphere ref={planetRef} args={[size, 32, 32]}>
        <meshStandardMaterial 
          color={color}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      
      {hasAtmosphere && (
        <Sphere ref={atmosphereRef} args={[size * 1.1, 32, 32]}>
          <meshBasicMaterial 
            color={atmosphereColor}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  );
}
