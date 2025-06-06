"use client";
import { useMemo } from 'react';
import * as THREE from 'three';

export function GalacticBackdrop() {
  const distantStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 1000; i++) {
      const phi = Math.acos(-1 + (2 * i) / 1000);
      const theta = Math.sqrt(1000 * Math.PI) * phi;
      const x = 300 * Math.cos(theta) * Math.sin(phi);
      const y = 300 * Math.sin(theta) * Math.sin(phi);  
      const z = 300 * Math.cos(phi);
      stars.push({ position: [x, y, z], brightness: Math.random() });
    }
    return stars;
  }, []);

  const nebulaClouds = useMemo(() => {
    const clouds = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 100 + Math.random() * 150;
      const height = (Math.random() - 0.5) * 80;
      clouds.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        scale: 20 + Math.random() * 30,
        color: new THREE.Color().setHSL(
          0.6 + Math.random() * 0.3, // Blue to purple hues
          0.5 + Math.random() * 0.5,
          0.3 + Math.random() * 0.4
        )
      });
    }
    return clouds;
  }, []);

  return (
    <group>
      {/* Distant star field */}
      {distantStars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <sphereGeometry args={[0.2 + star.brightness * 0.3, 8, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color(1, 1, 0.9)}
            transparent
            opacity={0.4 + star.brightness * 0.6}
          />
        </mesh>
      ))}
      
      {/* Nebula clouds */}
      {nebulaClouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position} scale={cloud.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
      
      {/* Galactic core glow */}
      <mesh position={[0, -50, -200]}>
        <sphereGeometry args={[40, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(1.0, 0.8, 0.6)}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
