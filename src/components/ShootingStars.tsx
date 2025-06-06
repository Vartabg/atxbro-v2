"use client";
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ShootingStars() {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) {
        const newStar = {
          id: Date.now(),
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 100
          ),
          life: 0,
        };
        setStars(prev => [...prev.slice(-2), newStar]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setStars(prev => 
      prev.map(star => ({
        ...star,
        life: star.life + 0.02,
      })).filter(star => star.life < 1)
    );
  });

  return (
    <group>
      {stars.map(star => (
        <mesh key={star.id} position={star.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color={new THREE.Color(1, 1, 0.8)}
            emissive={new THREE.Color(1, 0.8, 0.4)}
            emissiveIntensity={1 - star.life}
          />
        </mesh>
      ))}
    </group>
  );
}
