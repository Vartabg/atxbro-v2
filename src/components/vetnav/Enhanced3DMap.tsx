"use client";
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface StateData {
  name: string;
  position: [number, number, number];
  veteranCount: number;
  benefitsCount: number;
  color: string;
}

const statesData: StateData[] = [
  { name: 'Texas', position: [2, 0, -1], veteranCount: 2100000, benefitsCount: 150, color: '#10b981' },
  { name: 'California', position: [-3, 0, 1], veteranCount: 1800000, benefitsCount: 180, color: '#10b981' },
  { name: 'Florida', position: [1, 0, -2], veteranCount: 1500000, benefitsCount: 120, color: '#f59e0b' },
  { name: 'New York', position: [-1, 0, 2], veteranCount: 900000, benefitsCount: 160, color: '#f59e0b' },
  { name: 'Pennsylvania', position: [-0.5, 0, 1.5], veteranCount: 800000, benefitsCount: 110, color: '#f59e0b' },
  { name: 'Ohio', position: [0, 0, 1], veteranCount: 750000, benefitsCount: 95, color: '#ef4444' },
  { name: 'Virginia', position: [0.5, 0, 1], veteranCount: 700000, benefitsCount: 105, color: '#f59e0b' },
  { name: 'North Carolina', position: [1, 0, 0], veteranCount: 650000, benefitsCount: 90, color: '#ef4444' },
];

function StateMarker({ state, onClick }: { state: StateData; onClick: (state: StateData) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const height = Math.max(0.5, state.veteranCount / 500000);
  
  useFrame((frameState, delta) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={state.position}
        onClick={() => onClick(state)}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <cylinderGeometry args={[0.3, 0.5, height, 8]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : state.color}
          emissive={hovered ? state.color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {hovered && (
        <Html position={[state.position[0], state.position[1] + height + 0.5, state.position[2]]} center>
          <div className="bg-black bg-opacity-80 text-white p-2 rounded text-xs whitespace-nowrap">
            <div className="font-bold">{state.name}</div>
            <div>{(state.veteranCount / 1000000).toFixed(1)}M Veterans</div>
            <div>{state.benefitsCount} Benefits Available</div>
          </div>
        </Html>
      )}
    </group>
  );
}

interface Enhanced3DMapProps {
  onStateClick: (stateName: string) => void;
}

export function Enhanced3DMap({ onStateClick }: Enhanced3DMapProps) {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  
  const handleStateClick = (state: StateData) => {
    setSelectedState(state);
    onStateClick(state.name);
    console.log(`Clicked ${state.name}:`, state);
  };

  return (
    <group rotation={[-Math.PI / 6, 0, 0]}>
      {/* Base map platform */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[12, 0.2, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* US outline suggestion */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial 
          color="#334155" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* State markers */}
      {statesData.map((state) => (
        <StateMarker 
          key={state.name} 
          state={state} 
          onClick={handleStateClick}
        />
      ))}
      
      {/* Legend */}
      <Html position={[5, 2, -2]} center>
        <div className="bg-black bg-opacity-70 text-white p-3 rounded text-xs">
          <div className="font-bold mb-2">Benefits Density</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>High (150+ benefits)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Medium (100-149 benefits)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Developing (&lt;100 benefits)</span>
            </div>
          </div>
          <div className="mt-2 text-gray-300 text-xs">
            Height = Veteran Population
          </div>
        </div>
      </Html>
      
      {/* Selected state info */}
      {selectedState && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-blue-900 bg-opacity-90 text-white p-4 rounded-lg max-w-sm">
            <h3 className="font-bold text-lg">{selectedState.name}</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div>🎖️ {(selectedState.veteranCount / 1000000).toFixed(1)}M Veterans</div>
              <div>📋 {selectedState.benefitsCount} Benefits Available</div>
              <div>🏛️ Federal + State Programs</div>
            </div>
            <button 
              onClick={() => setSelectedState(null)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
