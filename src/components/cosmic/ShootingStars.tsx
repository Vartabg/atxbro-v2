"use client";
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Meteor {
  id: number;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
  speed: number;
  progress: number;
  active: boolean;
}

export function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const meteorCounter = useRef(0);

  const createMeteor = () => {
    const startRadius = 60;
    const endRadius = 20;

    const startPhi = Math.random() * Math.PI * 2;
    const startTheta = Math.random() * Math.PI;

    const startPosition = new THREE.Vector3(
      startRadius * Math.sin(startTheta) * Math.cos(startPhi),
      startRadius * Math.sin(startTheta) * Math.sin(startPhi),
      startRadius * Math.cos(startTheta)
    );

    const endPhi = startPhi + (Math.random() - 0.5) * 0.5;
    const endTheta = startTheta + (Math.random() - 0.5) * 0.5;

    const endPosition = new THREE.Vector3(
      endRadius * Math.sin(endTheta) * Math.cos(endPhi),
      endRadius * Math.sin(endTheta) * Math.sin(endPhi),
      endRadius * Math.cos(endTheta)
    );

    return {
      id: meteorCounter.current++,
      startPosition,
      endPosition,
      currentPosition: startPosition.clone(),
      speed: 0.02 + Math.random() * 0.03,
      progress: 0,
      active: true
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setMeteors(prev => [...prev.filter(m => m.active), createMeteor()]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    setMeteors(prev => 
      prev.map(meteor => {
        if (!meteor.active) return meteor;

        meteor.progress += meteor.speed;
        
        if (meteor.progress >= 1) {
          return { ...meteor, active: false };
        }

        meteor.currentPosition.lerpVectors(
          meteor.startPosition,
          meteor.endPosition,
          meteor.progress
        );

        return meteor;
      }).filter(meteor => meteor.active)
    );
  });

  return (
    <group ref={groupRef}>
      {meteors.map(meteor => (
        <mesh key={meteor.id} position={meteor.currentPosition}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
