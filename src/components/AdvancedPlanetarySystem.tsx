"use client";
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PlanetMoon, PlanetRings, AsteroidBelt, MoonSystem } from "./PlanetaryBodies";
import * as THREE from 'three';

interface PlanetData {
  id: string;
  name: string;
  app: string;
  position: [number, number, number];
  size: number;
  type: 'earth-like' | 'crystalline' | 'sanctuary' | 'industrial';
  description: string;
  features: string[];
  atmosphereColor: string;
  moons?: Array<{
    size: number;
    distance: number;
    speed: number;
    color: string;
    name: string;
  }>;
  rings?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
  asteroidBelt?: {
    radius: number;
    count: number;
  };
  surfaceConfig: any;
}

const ADVANCED_PLANETS: PlanetData[] = [
  {
    id: 'vetnav',
    name: 'Terra Veteranus',
    app: 'vetnav',
    position: [-25, 8, 0],
    size: 6, // Largest - most important
    type: 'earth-like',
    description: 'A proud Earth-like world dedicated to those who served. Advanced civilization with military precision and honor.',
    features: ['Veterans Command Centers', 'Benefits Navigation Networks', 'Honor Monuments', 'Support Communities'],
    atmosphereColor: '#1e40af',
    surfaceConfig: {
      dayTexture: '/textures/earth-day.jpg',
      nightTexture: '/textures/earth-night.jpg',
      normalMap: '/textures/earth-normal.jpg',
      cloudsTexture: '/textures/earth-clouds.jpg'
    }
  },
  {
    id: 'tariff',
    name: 'Mercantilis Prime',
    app: 'tariff-explorer',
    position: [30, -10, 0],
    size: 5, // Large economic powerhouse
    type: 'industrial',
    description: 'A bustling trade hub with crystalline data structures and flowing economic energy streams.',
    features: ['Trade Analysis Spires', 'Economic Data Cores', 'Market Intelligence Networks', 'Global Commerce Centers'],
    atmosphereColor: '#059669',
    surfaceConfig: {
      metalness: 0.4,
      roughness: 0.2,
      gridPattern: true,
      energyFlow: true
    },
    rings: {
      innerRadius: 8,
      outerRadius: 12,
      color: "#059669"
    },
    moons: [
      { size: 0.6, distance: 15, speed: 0.025, color: "#047857", name: "Commerce" }
    ]
    }
  },
  {
    id: 'petradar',
    name: 'Sanctum Bestia',
    app: 'pet-radar',
    position: [-15, -20, 10],
    size: 4, // Medium sanctuary world
    type: 'sanctuary',
    description: 'A lush paradise world where all creatures are protected and cherished. Floating islands and crystal healing centers.',
    features: ['Creature Sanctuaries', 'Healing Gardens', 'Telepathic Networks', 'Rainbow Bridges'],
    atmosphereColor: '#7c3aed',
    surfaceConfig: {
      bioluminescence: true,
      floatingIslands: true,
      crystalFormations: true,
      vibrantColors: true
    }
  },
  {
    id: 'jetshome',
    name: 'Athleticus Stadium',
    app: 'jetshome',
    position: [20, 25, -5],
    size: 4.5, // Sports powerhouse
    type: 'crystalline',
    description: 'A crystalline sports world with massive stadium structures and data crystal formations tracking every game.',
    features: ['Mega Stadiums', 'Performance Analytics Crystals', 'Championship Halls', 'Training Dimensions'],
    atmosphereColor: '#dc2626',
    surfaceConfig: {
      crystalline: true,
      stadiumStructures: true,
      dataStreams: true,
      energyFields: true
    }
  }
];

// Advanced Earth-like Planet Shader
function EarthLikePlanet({ data, onClick, isSelected }: any) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uSunDirection;
        uniform float uTime;
        uniform bool uSelected;
        uniform bool uHovered;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        // Procedural continent generation
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for(int i = 0; i < 4; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(uSunDirection);
          
          // Day/night calculation
          float sunDot = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.1, 0.1, sunDot);
          
          // Procedural surface
          vec2 surfaceUv = vUv * 8.0;
          float continents = fbm(surfaceUv);
          
          // Earth-like colors
          vec3 oceanColor = vec3(0.1, 0.3, 0.8);
          vec3 landColor = vec3(0.2, 0.6, 0.2);
          vec3 mountainColor = vec3(0.4, 0.3, 0.2);
          
          float elevation = continents;
          vec3 dayColor = mix(oceanColor, landColor, smoothstep(0.3, 0.7, elevation));
          dayColor = mix(dayColor, mountainColor, smoothstep(0.7, 1.0, elevation));
          
          // City lights on night side
          vec3 cityLights = vec3(1.0, 0.8, 0.4) * (1.0 - elevation) * 0.5;
          cityLights *= noise(surfaceUv * 20.0) > 0.7 ? 1.0 : 0.0;
          
          // Final color mixing
          vec3 finalColor = dayColor * dayFactor + cityLights * (1.0 - dayFactor);
          
          // Lighting
          float diff = max(sunDot, 0.0);
          finalColor *= 0.3 + diff * 0.7;
          
          // Selection glow
          if (uSelected) {
            finalColor += vec3(0.3, 0.3, 0.0) * sin(uTime * 5.0);
          }
          
          // Hover effect
          if (uHovered) {
            finalColor += vec3(0.2, 0.2, 0.2);
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
        uTime: { value: 0 },
        uSelected: { value: isSelected },
        uHovered: { value: hovered }
      }
    });
  }, [isSelected, hovered]);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vViewDirection = normalize(worldPosition.xyz - cameraPosition);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uAtmosphereColor;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        
        void main() {
          float rim = 1.0 - max(dot(vNormal, -vViewDirection), 0.0);
          rim = pow(rim, 2.0);
          
          float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
          vec3 atmosColor = uAtmosphereColor * 0.6;
          
          gl_FragColor = vec4(atmosColor, rim * 0.7 * pulse);
        }
      `,
      uniforms: {
        uAtmosphereColor: { value: new THREE.Color(data.atmosphereColor) },
        uTime: { value: 0 }
      },
      transparent: true,
      side: THREE.BackSide
    });
  }, [data.atmosphereColor]);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.003;
      planetMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      planetMaterial.uniforms.uSelected.value = isSelected;
      planetMaterial.uniforms.uHovered.value = hovered;
    }
    if (atmosphereRef.current) {
      atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={data.position}>
      {/* Planet Core */}
      <mesh
        ref={planetRef}
        material={planetMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[data.size, 128, 128]} />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[data.size * 1.05, 64, 64]} />
      </mesh>
      
      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[data.size * 1.02, 64, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3}
          alphaMap={new THREE.CanvasTexture(createCloudTexture())}
        />
      </mesh>
      
      {/* Selection Ring */}
      {(isSelected || hovered) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size * 1.2, data.size * 1.3, 64]} />
          <meshBasicMaterial 
            color={data.atmosphereColor} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Crystalline Planet Shader
function CrystallinePlanet({ data, onClick, isSelected }: any) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const crystallineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          
          // Crystal facet distortion
          vec3 pos = position;
          pos += normal * sin(uTime + position.x * 5.0 + position.y * 3.0) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform bool uSelected;
        uniform bool uHovered;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vec3 baseColor = vec3(0.8, 0.3, 0.3);
          
          // Crystal facets
          float facets = abs(sin(vUv.x * 20.0) * sin(vUv.y * 20.0));
          baseColor += facets * 0.5;
          
          // Reflective shimmering
          float shimmer = sin(uTime * 3.0 + vPosition.x + vPosition.y) * 0.3;
          baseColor += shimmer;
          
          // Lighting
          vec3 light = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, light), 0.0);
          
          // Metallic reflection
          vec3 viewDir = normalize(cameraPosition - vPosition);
          vec3 reflectDir = reflect(-light, vNormal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
          
          if (uSelected) {
            baseColor += vec3(0.5, 0.5, 0.0) * sin(uTime * 8.0);
          }
          
          if (uHovered) {
            baseColor += vec3(0.3, 0.3, 0.3);
          }
          
          vec3 finalColor = baseColor * (0.4 + diff * 0.6) + spec * 0.8;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uSelected: { value: isSelected },
        uHovered: { value: hovered }
      }
    });
  }, [isSelected, hovered]);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
      planetRef.current.rotation.z += 0.002;
      crystallineMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      crystallineMaterial.uniforms.uSelected.value = isSelected;
      crystallineMaterial.uniforms.uHovered.value = hovered;
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={planetRef}
        material={crystallineMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[data.size, 2]} />
      </mesh>
      
      {(isSelected || hovered) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size * 1.2, data.size * 1.3, 6]} />
          <meshBasicMaterial 
            color={data.atmosphereColor} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Create procedural cloud texture
function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  // Generate cloud noise
  const imageData = ctx.createImageData(512, 256);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random();
    const alpha = noise > 0.6 ? (noise - 0.6) * 2.5 : 0;
    imageData.data[i] = 255;     // R
    imageData.data[i + 1] = 255; // G
    imageData.data[i + 2] = 255; // B
    imageData.data[i + 3] = alpha * 255; // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Main Planetary System Component
interface AdvancedPlanetarySystemProps {
  onPlanetClick: (data: PlanetData) => void;
  selectedPlanet?: PlanetData | null;
}

export function AdvancedPlanetarySystem({ onPlanetClick, selectedPlanet }: AdvancedPlanetarySystemProps) {
  return (
    <group>
      {/* 3D Navigation Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={200}
        autoRotate={false}
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping={true}
      />
      
      {/* Central Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      
      {/* Planets */}
      {ADVANCED_PLANETS.map((planet) => {
        if (planet.type === 'crystalline') {
          return (
            <CrystallinePlanet
              key={planet.id}
              data={planet}
              onClick={onPlanetClick}
              isSelected={selectedPlanet?.id === planet.id}
            />
          );
        } else {
          return (
            <EarthLikePlanet
              key={planet.id}
              data={planet}
              onClick={onPlanetClick}
              isSelected={selectedPlanet?.id === planet.id}
            />
          );
        }
      })}
    </group>
  );
}

export { ADVANCED_PLANETS };
export type { PlanetData };
