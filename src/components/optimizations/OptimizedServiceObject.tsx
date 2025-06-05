import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere, Cylinder, Torus, RoundedBox, Box } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { MobileOptimizer } from './MobileOptimizer';
import * as THREE from 'three';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position3D: [number, number, number];
  color: string;
  description: string;
}

interface OptimizedServiceObjectProps {
  service: Service;
  isActive: boolean;
  onClick: () => void;
  isTransitioning: boolean;
}

export function OptimizedServiceObject({
  service,
  isActive,
  onClick,
  isTransitioning
}: OptimizedServiceObjectProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const mobileSettings = useMemo(() => MobileOptimizer.getOptimalSettings(), []);
  
  const geometry = useMemo(() => {
    const complexity = MobileOptimizer.getOptimalGeometry(32);
    
    switch (service.id) {
      case 'vetnav':
        return new THREE.SphereGeometry(1, complexity, complexity);
      case 'tariff-explorer':
        return new THREE.CylinderGeometry(0.7, 0.7, 2, complexity);
      case 'pet-radar':
        return new THREE.TorusGeometry(0.8, 0.3, Math.max(8, complexity/2), complexity);
      case 'fundraiser':
        return new THREE.BoxGeometry(1.5, 1.5, 1.5);
      default:
        return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }
  }, [service.id]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: service.color,
      roughness: 0.3,
      metalness: 0.6,
    });
  }, [service.color]);

  const { scale } = useSpring({
    scale: pressed ? 0.95 : isActive ? 1.1 : hovered ? 1.2 : 1,
    config: { tension: 300, friction: 10 },
    onRest: () => {
      if (pressed) {
        setPressed(false);
      }
    },
  });

  useFrame((state, delta) => {
    if (meshRef.current && !isTransitioning) {
      const rotationSpeed = mobileSettings.frameTarget === 30 ? delta * 0.05 : delta * 0.1;
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.5;
    }
  });

  const eventHandlers = {
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      setPressed(true);
      onClick();
      if (navigator.vibrate) navigator.vibrate(50);
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHover(true);
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHover(false);
    },
  };

  const emissiveColor = isActive ? 
    (service.id === 'vetnav' ? 'green' : 'yellow') :
    (hovered ? 'red' : 'black');
  
  const emissiveIntensity = isActive ? 1 : (hovered ? 0.5 : 0);

  return (
    <animated.group position={service.position3D} scale={scale}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        {...eventHandlers}
      >
        <meshStandardMaterial
          color={hovered && !isActive ? 'hotpink' : service.color}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </animated.group>
  );
}
