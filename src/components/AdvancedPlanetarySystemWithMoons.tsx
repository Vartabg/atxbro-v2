import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei'; // Ensure Stars is imported
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
  surfaceColor: string; // Added surfaceColor for enhanced shaders
  moons?: Array<{
    size: number;
    distance: number;
    speed: number;
    color: string;
  }>;
  rings?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
}

function SimpleMoon({
  size,
  distance,
  speed,
  color,
  planetPosition
}: {
  size: number;
  distance: number;
  speed: number;
  color: string;
  planetPosition: [number, number, number];
}) {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed;
    }
  });

  return (
    <group ref={orbitRef} position={planetPosition}>
      <mesh position={[distance, 0, 0]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

function SimpleRings({
  innerRadius,
  outerRadius,
  planetPosition,
  color
}: {
  innerRadius: number;
  outerRadius: number;
  planetPosition: [number, number, number];
  color: string;
}) {
  const ringsRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh
      ref={ringsRef}
      position={planetPosition}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const PLANETS_WITH_MOONS: PlanetData[] = [
  {
    id: 'vetnav',
    name: 'Terra Veteranus',
    app: 'vetnav',
    position: [-25, 8, 0],
    size: 6,
    type: 'earth-like',
    description: 'A proud Earth-like world dedicated to those who served. Advanced civilization with military precision and honor.',
    features: ['Veterans Command Centers', 'Benefits Navigation Networks', 'Honor Monuments', 'Support Communities'],
    atmosphereColor: '#1e40af',
    surfaceColor: '#3b82f6', // Example surface color
    moons: [
      { size: 0.8, distance: 10, speed: 0.02, color: '#8892b0' },
      { size: 0.5, distance: 14, speed: -0.015, color: '#a8b2d1' }
    ]
  },
  {
    id: 'tariff',
    name: 'Mercantilis Prime',
    app: 'tariff-explorer',
    position: [30, -10, 0],
    size: 5,
    type: 'industrial',
    description: 'A bustling trade hub with crystalline data structures and flowing economic energy streams.',
    features: ['Trade Analysis Spires', 'Economic Data Cores', 'Market Intelligence Networks', 'Global Commerce Centers'],
    atmosphereColor: '#059669',
    surfaceColor: '#10b981', // Example surface color
    rings: {
      innerRadius: 7,
      outerRadius: 9,
      color: '#10b981'
    }
  },
  {
    id: 'petradar',
    name: 'Sanctum Bestia',
    app: 'pet-radar',
    position: [-15, -20, 10],
    size: 4,
    type: 'sanctuary',
    description: 'A lush paradise world where all creatures are protected and cherished. Floating islands and crystal healing centers.',
    features: ['Creature Sanctuaries', 'Healing Gardens', 'Telepathic Networks', 'Rainbow Bridges'],
    atmosphereColor: '#7c3aed',
    surfaceColor: '#a855f7', // Example surface color
    moons: [
      { size: 0.6, distance: 7, speed: 0.03, color: '#c4b5fd' }
    ]
  },
  {
    id: 'jetshome',
    name: 'Athleticus Stadium',
    app: 'jetshome',
    position: [20, 25, -5],
    size: 4.5,
    type: 'crystalline',
    description: 'A crystalline sports world with massive stadium structures and data crystal formations tracking every game.',
    features: ['Mega Stadiums', 'Performance Analytics Crystals', 'Championship Halls', 'Training Dimensions'],
    atmosphereColor: '#dc2626',
    surfaceColor: '#ef4444', // Example surface color
    rings: {
      innerRadius: 6,
      outerRadius: 8,
      color: '#ef4444'
    }
  }
];

function EnhancedPlanet({ data, onClick, isSelected }: any) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const planetMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSurfaceColor: { value: new THREE.Color(data.surfaceColor) },
      uAtmosphereColor: { value: new THREE.Color(data.atmosphereColor) },
      uSelected: { value: isSelected ? 1.0 : 0.0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        // Add slight surface displacement
        vec3 pos = position + normal * sin(uTime * 2.0 + position.x * 5.0) * 0.01;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uSurfaceColor;
      uniform vec3 uAtmosphereColor;
      uniform float uSelected;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        // Basic lighting
        vec3 light = normalize(vec3(1.0, 1.0, 1.0)); // Simplified light direction for shader
        float diffuse = max(dot(vNormal, light), 0.2);
        
        // Surface patterns
        float pattern = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime) * 0.1;
        
        // Rim lighting
        float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
        vec3 rimGlow = uAtmosphereColor * pow(rim, 2.0) * 0.5;
        
        // Selection glow
        float selectedGlow = uSelected * 0.3 * (1.0 + sin(uTime * 4.0) * 0.3);
        
        vec3 finalColor = uSurfaceColor * (diffuse + pattern) + rimGlow + selectedGlow;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), [data.surfaceColor, data.atmosphereColor, isSelected]);

  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAtmosphereColor: { value: new THREE.Color(data.atmosphereColor) }
    },
    transparent: true,
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uAtmosphereColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
        gl_FragColor = vec4(uAtmosphereColor, intensity * 0.4 * pulse);
      }
    `
  }), [data.atmosphereColor]);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
    if (planetMaterial) {
      planetMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      planetMaterial.uniforms.uSelected.value = isSelected ? 1.0 : 0.0;
    }
    if (atmosphereMaterial) {
      atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const geometryArgs = data.type === 'crystalline' ? [data.size, 2] : [data.size, 64, 64];
  const GeometryComponent = data.type === 'crystalline' ? 'icosahedronGeometry' : 'sphereGeometry';

  return (
    <group position={data.position}>
      {/* Planet Surface */}
      <mesh
        ref={planetRef}
        material={planetMaterial}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        {GeometryComponent === 'sphereGeometry' ? (
          <sphereGeometry args={geometryArgs} />
        ) : (
          <icosahedronGeometry args={geometryArgs} />
        )}
      </mesh>
      {/* Atmosphere */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[data.size * 1.1, 32, 32]} />
      </mesh>
    </group>
  );
}

interface AdvancedPlanetarySystemProps {
  onPlanetClick: (data: PlanetData) => void;
  selectedPlanet?: PlanetData | null;
}

export function AdvancedPlanetarySystemWithMoons({ onPlanetClick, selectedPlanet }: AdvancedPlanetarySystemProps) {
  return (
    <group>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={200}
        autoRotate={false}
        dampingFactor={0.05}
        enableDamping={true}
      />
      {/* Beautiful Star Field */}
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      {/* Ambient and Directional Lighting - No direct sun mesh here */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
      />
      {/* Planets with Moons and Rings */}
      {PLANETS_WITH_MOONS.map((planet) => (
        <group key={planet.id}>
          {/* Planet */}
          <EnhancedPlanet
            data={planet}
            onClick={onPlanetClick}
            isSelected={selectedPlanet?.id === planet.id}
          />
          {/* Moons */}
          {planet.moons?.map((moon, index) => (
            <SimpleMoon
              key={index}
              size={moon.size}
              distance={moon.distance}
              speed={moon.speed}
              color={moon.color}
              planetPosition={planet.position}
            />
          ))}
          {/* Rings */}
          {planet.rings && (
            <SimpleRings
              innerRadius={planet.rings.innerRadius}
              outerRadius={planet.rings.outerRadius}
              planetPosition={planet.position}
              color={planet.rings.color}
            />
          )}
        </group>
      ))}
    </group>
  );
}
