"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

interface WarpTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function WarpTransition({ isActive, onComplete }: WarpTransitionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  const shaderMaterial = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uProgress;
      varying vec2 vUv;
      
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        
        float tunnel = smoothstep(0.0, 0.3, dist) * smoothstep(0.8, 0.3, dist);
        float intensity = tunnel * uProgress;
        
        vec3 color = vec3(0.5, 0.8, 1.0) * intensity;
        
        gl_FragColor = vec4(color, intensity);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state, delta) => {
    if (isActive) {
      progressRef.current = Math.min(progressRef.current + delta * 2, 1);
      if (progressRef.current >= 1 && onComplete) {
        onComplete();
      }
    } else {
      progressRef.current = Math.max(progressRef.current - delta * 3, 0);
    }

    if (shaderMaterial.uniforms.uProgress) {
      shaderMaterial.uniforms.uProgress.value = progressRef.current;
    }
  });

  if (progressRef.current === 0) return null;

  return (
    <Plane 
      ref={meshRef}
      args={[20, 20]} 
      material={shaderMaterial}
      position={[0, 0, -10]}
    />
  );
}
