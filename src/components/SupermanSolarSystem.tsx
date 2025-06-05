"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Planet {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  description: string;
  features: string[];
  icon: string;
}

const PLANETS: Planet[] = [
  {
    id: 'vetnav',
    name: 'VetNav',
    position: [-8, 2, 0],
    color: '#2563eb',
    description: 'Veterans Benefits & Transition Hub',
    features: ['Interactive Map', 'Transition Assistance', 'Myth Busters', 'Profile Matcher'],
    icon: '🎖️'
  },
  {
    id: 'jetshome',
    name: 'JetsHome',
    position: [8, 2, 0],
    color: '#10b981',
    description: 'Sports Analytics & Statistics',
    features: ['Team Analytics', 'Player Stats', 'Game Predictions', 'Historical Data'],
    icon: '🏈'
  },
  {
    id: 'petradar',
    name: 'Pet Radar',
    position: [-8, -2, 0],
    color: '#f59e0b',
    description: 'Pet Adoption & Lost Pet Search',
    features: ['Adoption Search', 'Lost Pet Alerts', 'Breed Matching', 'Shelter Network'],
    icon: '🐾'
  },
  {
    id: 'tradeexplorer',
    name: 'Trade Explorer',
    position: [8, -2, 0],
    color: '#8b5cf6',
    description: 'Economic Policy & Trade Analysis',
    features: ['Tariff Analysis', 'Trade Routes', 'Economic Impact', 'Policy Timeline'],
    icon: '📊'
  }
];

interface CameraTransition {
  start: THREE.Vector3;
  end: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
  progress: number;
  duration: number;
  isActive: boolean;
  targetPlanet?: string;
}

function SupermanCamera({ transition, onComplete }: { 
  transition: CameraTransition | null;
  onComplete: () => void;
}) {
  const { camera, controls } = useThree();
  
  useFrame((state, delta) => {
    if (!transition || !transition.isActive) return;
    
    // Super-speed easing - starts slow, then VERY fast, then decelerates
    const superSpeedEasing = (t: number) => {
      if (t < 0.3) return t * t; // Slow start
      if (t < 0.7) return 0.09 + (t - 0.3) * 20; // Super speed
      return 0.09 + 8 + (1 - Math.pow(1 - (t - 0.7) / 0.3, 3)) * 0.91; // Smooth deceleration
    };
    
    transition.progress += delta / transition.duration;
    const easedProgress = superSpeedEasing(Math.min(transition.progress, 1));
    
    camera.position.lerpVectors(transition.start, transition.end, easedProgress);
    
    if (controls && 'target' in controls) {
      (controls as any).target.lerpVectors(transition.startTarget, transition.endTarget, easedProgress);
      (controls as any).update();
    }
    
    if (transition.progress >= 1) {
      transition.isActive = false;
      onComplete();
    }
  });
  
  return null;
}

function PlanetSphere({ planet, isSelected, onClick }: { 
  planet: Planet; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      if (isSelected) {
        meshRef.current.rotation.x += delta * 0.1;
      }
    }
  });
  
  const scale = isSelected ? 2.5 : (hovered ? 1.2 : 1);
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={planet.position}
        scale={[scale, scale, scale]}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={hovered || isSelected ? planet.color : '#000000'}
          emissiveIntensity={hovered || isSelected ? 0.3 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh position={planet.position} scale={[scale * 1.1, scale * 1.1, scale * 1.1]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet label when not selected */}
      {!isSelected && (
        <Html position={[planet.position[0], planet.position[1] + 2.5, planet.position[2]]} center>
          <div className="text-white text-center font-bold pointer-events-none">
            <div className="text-2xl mb-1">{planet.icon}</div>
            <div className="text-lg">{planet.name}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function PlanetInfoOverlay({ planet, onEnterPlanet, onBack }: {
  planet: Planet;
  onEnterPlanet: () => void;
  onBack: () => void;
}) {
  return (
    <Html position={[planet.position[0] + 4, planet.position[1], planet.position[2]]} center>
      <div className="bg-black bg-opacity-80 backdrop-blur-md text-white p-6 rounded-xl border-2 border-blue-400 max-w-sm">
        {/* Planet Header */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{planet.icon}</div>
          <h2 className="text-2xl font-bold text-blue-300">{planet.name}</h2>
          <p className="text-gray-300 text-sm">{planet.description}</p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-200">Available Systems:</h3>
          <div className="space-y-2">
            {planet.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={onEnterPlanet}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors font-semibold"
          >
            Enter Planet
          </button>
        </div>
      </div>
    </Html>
  );
}

export default function SupermanSolarSystem() {
  const [currentView, setCurrentView] = useState<'system' | 'planet-focus' | 'entering'>('system');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [cameraTransition, setCameraTransition] = useState<CameraTransition | null>(null);
  
  const handlePlanetClick = (planetId: string) => {
    const planet = PLANETS.find(p => p.id === planetId);
    if (!planet) return;
    
    console.log('Superman vision focusing on:', planetId);
    setSelectedPlanet(planetId);
    setCurrentView('planet-focus');
    
    // Superman super-speed zoom to planet
    const transition: CameraTransition = {
      start: new THREE.Vector3(0, 0, 20), // Superman hovering position
      end: new THREE.Vector3(planet.position[0] - 6, planet.position[1], planet.position[2] + 8), // Close to planet
      startTarget: new THREE.Vector3(0, 0, 0), // Looking at solar system center
      endTarget: new THREE.Vector3(planet.position[0], planet.position[1], planet.position[2]), // Looking at planet
      progress: 0,
      duration: 3.0, // 3 seconds for dramatic effect
      isActive: true,
      targetPlanet: planetId
    };
    
    setCameraTransition(transition);
  };
  
  const handleBackToSystem = () => {
    console.log('Superman returning to system view');
    setCurrentView('system');
    setSelectedPlanet(null);
    
    // Return to system overview
    const transition: CameraTransition = {
      start: cameraTransition?.end || new THREE.Vector3(0, 0, 8),
      end: new THREE.Vector3(0, 0, 20),
      startTarget: cameraTransition?.endTarget || new THREE.Vector3(0, 0, 0),
      endTarget: new THREE.Vector3(0, 0, 0),
      progress: 0,
      duration: 2.0,
      isActive: true
    };
    
    setCameraTransition(transition);
  };
  
  const handleEnterPlanet = () => {
    if (!selectedPlanet) return;
    console.log('Entering planet:', selectedPlanet);
    setCurrentView('entering');
    
    // Navigate to specific planet component
    if (selectedPlanet === 'vetnav') {
      window.location.hash = '#vetnav';
    }
    // Add other planet navigations here
  };
  
  const handleTransitionComplete = () => {
    console.log('Superman transition complete');
  };

  const selectedPlanetData = selectedPlanet ? PLANETS.find(p => p.id === selectedPlanet) : null;

  return (
    <section className="relative h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      
      {/* Superman Status Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-60 text-white p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="text-blue-400">🦸‍♂️</div>
          <div>
            <div className="text-sm font-bold">Superman View</div>
            <div className="text-xs text-gray-300">
              {currentView === 'system' && 'Scanning Solar System'}
              {currentView === 'planet-focus' && `Analyzing ${selectedPlanetData?.name}`}
              {currentView === 'entering' && 'Entering Planet...'}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Solar System */}
      <div className="w-full h-full">
        <Canvas
          camera={{ 
            position: [0, 0, 20], // Superman starting position
            fov: 75
          }}
        >
          {/* Cosmic lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[20, 20, 20]} intensity={1} color="#ffffff" />
          <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffdd44" /> {/* Central sun */}
          
          <SupermanCamera 
            transition={cameraTransition}
            onComplete={handleTransitionComplete}
          />
          
          {/* Central Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshBasicMaterial color="#ffdd44" emissive="#ffaa00" emissiveIntensity={0.5} />
          </mesh>
          
          {/* Planets */}
          {PLANETS.map((planet) => (
            <PlanetSphere
              key={planet.id}
              planet={planet}
              isSelected={selectedPlanet === planet.id}
              onClick={() => handlePlanetClick(planet.id)}
            />
          ))}
          
          {/* Planet Info Overlay */}
          {currentView === 'planet-focus' && selectedPlanetData && (
            <PlanetInfoOverlay
              planet={selectedPlanetData}
              onEnterPlanet={handleEnterPlanet}
              onBack={handleBackToSystem}
            />
          )}
          
          <OrbitControls
            enabled={currentView === 'system'}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={15}
            maxDistance={50}
            target={[0, 0, 0]}
            makeDefault
          />
        </Canvas>
      </div>
      
      {/* System Overview UI */}
      {currentView === 'system' && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="bg-black bg-opacity-60 backdrop-blur-md text-white p-4 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">🚀 ATX Bro Solar System</h2>
            <p className="text-gray-300 text-sm mb-3">
              Use your Superman vision to focus on any planet. Click to analyze.
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {PLANETS.map((planet) => (
                <div key={planet.id} className="text-center">
                  <div className="text-lg">{planet.icon}</div>
                  <div>{planet.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
