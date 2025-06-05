"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      // Distribute stars in a sphere around the scene
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Star colors - mix of white, blue, and yellow
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        colors[i * 3] = 1; // white stars
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.85) {
        colors[i * 3] = 0.8; // blue giants
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1; // yellow stars
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.7;
      }
    }
    
    return [positions, colors];
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
      ref.current.rotation.x += 0.0001;
    }
  });
  
  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial size={0.8} sizeAttenuation vertexColors />
    </Points>
  );
}

function ShootingStars() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((star, i) => {
        star.position.x -= 0.1 + i * 0.02;
        if (star.position.x < -100) {
          star.position.x = 100;
          star.position.y = (Math.random() - 0.5) * 100;
          star.position.z = (Math.random() - 0.5) * 100;
        }
      });
    }
  });
  
  const shootingStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 8; i++) {
      stars.push(
        <mesh
          key={i}
          position={[
            Math.random() * 200 - 100,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50
          ]}
        >
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshBasicMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          <mesh position={[-2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.05, 4]} />
            <meshBasicMaterial color="#88ccff" transparent opacity={0.6} />
          </mesh>
        </mesh>
      );
    }
    return stars;
  }, []);
  
  return <group ref={ref}>{shootingStars}</group>;
}

function NebulaCloud() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.z += 0.0003;
    }
  });
  
  return (
    <mesh ref={ref} position={[50, 30, -80]} scale={[40, 20, 30]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial 
        color="#4a0e4e" 
        transparent 
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function CosmicBackground() {
  return (
    <group>
      <StarField />
      <ShootingStars />
      <NebulaCloud />
      
      {/* Distant galaxies */}
      <mesh position={[-80, 40, -150]} scale={[15, 8, 10]}>
        <ringGeometry args={[1, 2, 16]} />
        <meshBasicMaterial 
          color="#6a5acd" 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={[90, -30, -120]} scale={[12, 12, 8]}>
        <ringGeometry args={[0.5, 1.5, 12]} />
        <meshBasicMaterial 
          color="#ff69b4" 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
