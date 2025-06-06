"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CentralSun() {
  const sunRef = useRef<THREE.Mesh>(null);
  
  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(1.0, 0.8, 0.3),
      emissive: new THREE.Color(1.0, 0.6, 0.1),
      emissiveIntensity: 1.5,
      roughness: 1.0,
      metalness: 0.0,
    });
  }, []);
  
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={sunRef} material={sunMaterial}>
        <sphereGeometry args={[2, 32, 32]} />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial
          color={new THREE.Color(1.0, 0.6, 0.1)}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
