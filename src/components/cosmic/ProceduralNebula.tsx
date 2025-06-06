"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

export function ProceduralNebula() {
  const meshRef = useRef<THREE.Mesh>(null);

  const shaderMaterial = useMemo(() => {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        vec2 st = vUv * 3.0;
        st.x += uTime * 0.1;
        
        float n = noise(st) * 0.5 + noise(st * 2.0) * 0.25 + noise(st * 4.0) * 0.125;
        
        vec3 color1 = vec3(0.1, 0.0, 0.3);
        vec3 color2 = vec3(0.8, 0.2, 0.9);
        vec3 color3 = vec3(0.0, 0.4, 0.8);
        
        vec3 finalColor = mix(color1, color2, n);
        finalColor = mix(finalColor, color3, smoothstep(0.6, 1.0, n));
        
        gl_FragColor = vec4(finalColor, n * 0.3);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current && shaderMaterial.uniforms.uTime) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Plane 
      ref={meshRef}
      args={[100, 100]} 
      material={shaderMaterial}
      position={[0, 0, -50]}
    />
  );
}
