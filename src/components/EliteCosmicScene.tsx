"use client";
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Research-backed procedural nebula with proper noise
const nebulaVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const nebulaFragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;

// Simple noise function
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
  vec2 uv = vUv;
  
  // Layered noise for nebula
  float n1 = noise(uv * 3.0 + uTime * 0.1);
  float n2 = noise(uv * 6.0 + uTime * 0.05);
  float n3 = noise(uv * 12.0 + uTime * 0.02);
  
  float combinedNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  
  // Distance from center for mask
  vec2 center = vec2(0.5, 0.5);
  float dist = length(uv - center);
  float mask = 1.0 - smoothstep(0.3, 0.8, dist);
  
  // Sci-fi color palette
  vec3 color1 = vec3(0.1, 0.2, 0.8); // Deep blue
  vec3 color2 = vec3(0.8, 0.2, 0.6); // Magenta
  vec3 color3 = vec3(0.2, 0.8, 0.9); // Cyan
  
  vec3 finalColor = mix(color1, color2, combinedNoise);
  finalColor = mix(finalColor, color3, smoothstep(0.3, 0.7, n1));
  
  float alpha = mask * combinedNoise * 0.6;
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export function EliteCosmicScene() {
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        uTime: { value: 0.0 }
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, []);
  
  useFrame((state) => {
    if (nebulaMaterial.uniforms.uTime) {
      nebulaMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <>
      {/* Procedural Nebula Background */}
      <mesh ref={nebulaRef} material={nebulaMaterial}>
        <sphereGeometry args={[150, 32, 32]} />
      </mesh>
      
      {/* Central Star */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={new THREE.Color(1.0, 0.9, 0.7)}
          emissive={new THREE.Color(1.0, 0.7, 0.3)}
          emissiveIntensity={2.0}
        />
      </mesh>
      
      {/* Star Corona */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial
          color={new THREE.Color(1.0, 0.8, 0.4)}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
