"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function AdvancedStarfield() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 80 + Math.random() * 20;
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = 2 * Math.PI * Math.random();

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const magnitude = Math.random();
      sizes[i] = magnitude < 0.1 ? 3 : magnitude < 0.3 ? 2 : 1;

      const temp = 3000 + Math.random() * 7000;
      const r = temp < 3500 ? 0.9 + Math.random() * 0.1 : temp < 5000 ? 0.8 + Math.random() * 0.2 : 0.6 + Math.random() * 0.4;
      const g = temp < 3500 ? 0.4 + Math.random() * 0.3 : temp < 5000 ? 0.7 + Math.random() * 0.3 : 0.8 + Math.random() * 0.2;
      const b = temp < 3500 ? 0.2 + Math.random() * 0.2 : temp < 5000 ? 0.6 + Math.random() * 0.4 : 0.9 + Math.random() * 0.1;

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.001;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial 
        vertexColors 
        size={2} 
        sizeAttenuation={false}
        transparent
        alphaTest={0.1}
      />
    </Points>
  );
}
