"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SimpleStarField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 2000; // Reduced count to prevent performance issues
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // White stars
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1; 
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} vertexColors sizeAttenuation={false} />
    </points>
  );
}
