"use client";
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Enhanced3DMap } from './Enhanced3DMap';
import { PlanetSelectionInterface } from './PlanetSelectionInterface';
import { PlanetDashboard } from './PlanetDashboard';
import * as THREE from 'three';

interface CameraTransition {
  start: THREE.Vector3;
  end: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
  progress: number;
  duration: number;
  isActive: boolean;
}

const VETNAV_PLANET_INFO = {
  name: "VetNav",
  description: "Veterans Benefits & Transition Support Hub",
  capabilities: [
    "Interactive Benefits Map",
    "Transition Assistance Programs", 
    "Myth Busters & FAQ",
    "State-by-State Benefits",
    "Profile Matching System"
  ],
  color: "from-blue-600 to-blue-800"
};

const VETNAV_FEATURES = [
  {
    id: 'interactive-map',
    title: 'Interactive Map',
    description: 'Explore benefits by state with 3D visualization',
    icon: '🗺️',
    color: 'hover:bg-green-600 hover:bg-opacity-20'
  },
  {
    id: 'transition-assistance',
    title: 'Transition Assistance',
    description: 'Step-by-step guidance for military transition',
    icon: '🎯',
    color: 'hover:bg-blue-600 hover:bg-opacity-20'
  },
  {
    id: 'myth-busters',
    title: 'Myth Busters',
    description: 'Common misconceptions about veteran benefits',
    icon: '💡',
    color: 'hover:bg-yellow-600 hover:bg-opacity-20'
  },
  {
    id: 'profile-matcher',
    title: 'Profile Matcher',
    description: 'Find benefits specific to your service record',
    icon: '🎖️',
    color: 'hover:bg-purple-600 hover:bg-opacity-20'
  },
  {
    id: 'state-benefits',
    title: 'State Benefits',
    description: 'Discover state-specific veteran programs',
    icon: '🏛️',
    color: 'hover:bg-red-600 hover:bg-opacity-20'
  },
  {
    id: 'emergency-resources',
    title: 'Emergency Resources',
    description: 'Crisis support and immediate assistance',
    icon: '🚨',
    color: 'hover:bg-orange-600 hover:bg-opacity-20'
  }
];

function TransitionCamera({ transition, onComplete }: { 
  transition: CameraTransition | null;
  onComplete: () => void;
}) {
  const { camera, controls } = useThree();
  
  useFrame((state, delta) => {
    if (!transition || !transition.isActive) return;
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    transition.progress += delta / transition.duration;
    const easedProgress = easeOutCubic(Math.min(transition.progress, 1));
    
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

function VetNavPlanet({ onClick, showSelection }: { onClick: () => void; showSelection: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
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
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color={hovered ? "#4fa8d8" : "#2563eb"}
          emissive={hovered ? "#1e40af" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {!showSelection && (
        <Html position={[0, 3.5, 0]} center>
          <div className="text-white text-center font-bold text-lg pointer-events-none select-none">
            VetNav
            <div className="text-sm font-normal">Click to Scan</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function VetNav() {
  const [currentView, setCurrentView] = useState<'planet' | 'selection' | 'dashboard' | 'feature'>('planet');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [cameraTransition, setCameraTransition] = useState<CameraTransition | null>(null);
  
  const handlePlanetClick = () => {
    console.log('Planet scanned!');
    setCurrentView('selection');
  };
  
  const handleEnterPlanet = () => {
    console.log('Entering planet dashboard...');
    setCurrentView('dashboard');
  };
  
  const handleFeatureSelect = (featureId: string) => {
    console.log('Selected feature:', featureId);
    setSelectedFeature(featureId);
    
    if (featureId === 'interactive-map') {
      // Start Superman transition to map
      setCurrentView('feature');
      const transition: CameraTransition = {
        start: new THREE.Vector3(0, 0, 8),
        end: new THREE.Vector3(0, 15, 0),
        startTarget: new THREE.Vector3(0, 0, 0),
        endTarget: new THREE.Vector3(0, 0, 0),
        progress: 0,
        duration: 2.5,
        isActive: true
      };
      setCameraTransition(transition);
    } else {
      setCurrentView('feature');
    }
  };
  
  const handleBackToPlanet = () => {
    setCurrentView('planet');
    setSelectedFeature(null);
  };
  
  const handleTransitionComplete = () => {
    console.log('Map transition complete!');
  };

  return (
    <section id="vetnav" className="relative h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
      
      {/* 3D Scene - Only show when in planet, selection, or map feature */}
      {(currentView === 'planet' || currentView === 'selection' || (currentView === 'feature' && selectedFeature === 'interactive-map')) && (
        <div className="w-full h-full">
          <Canvas
            camera={{ 
              position: [0, 0, 8],
              fov: 60
            }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <pointLight position={[0, 0, 10]} intensity={0.8} />
            
            <TransitionCamera 
              transition={cameraTransition}
              onComplete={handleTransitionComplete}
            />
            
            {(currentView === 'planet' || currentView === 'selection') && (
              <>
                <VetNavPlanet 
                  onClick={handlePlanetClick} 
                  showSelection={currentView === 'selection'}
                />
                
                {currentView === 'selection' && (
                  <PlanetSelectionInterface
                    planetInfo={VETNAV_PLANET_INFO}
                    onEnterPlanet={handleEnterPlanet}
                    onCancel={() => setCurrentView('planet')}
                  />
                )}
              </>
            )}
            
            {currentView === 'feature' && selectedFeature === 'interactive-map' && (
              <Enhanced3DMap onStateClick={(state) => console.log("Selected state:", state)} />
            )}
            
            <OrbitControls
              enabled={currentView !== 'selection'}
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              minDistance={5}
              maxDistance={15}
              target={[0, 0, 0]}
              makeDefault
            />
          </Canvas>
        </div>
      )}

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <PlanetDashboard
          planetName="VetNav Command Center"
          features={VETNAV_FEATURES}
          onFeatureSelect={handleFeatureSelect}
          onBackToPlanet={handleBackToPlanet}
        />
      )}

      {/* Feature Views (other than interactive map) */}
      {currentView === 'feature' && selectedFeature !== 'interactive-map' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              {VETNAV_FEATURES.find(f => f.id === selectedFeature)?.title}
            </h1>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          
          <div className="bg-black bg-opacity-40 backdrop-blur-md p-8 rounded-xl max-w-4xl mx-auto">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">
                {VETNAV_FEATURES.find(f => f.id === selectedFeature)?.icon}
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {VETNAV_FEATURES.find(f => f.id === selectedFeature)?.title}
              </h2>
              <p className="text-blue-200">
                {VETNAV_FEATURES.find(f => f.id === selectedFeature)?.description}
              </p>
              <div className="mt-8">
                <p className="text-gray-300">Feature implementation coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
