"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Sample state data (simplified for prototype)
const sampleStates = [
  {
    id: 'TX',
    name: 'Texas',
    position: [0, -1, 0],
    size: [2, 1.5, 0.1],
    benefitsCount: 42
  },
  {
    id: 'CA',
    name: 'California', 
    position: [-3, 0, 0],
    size: [1.5, 2, 0.1],
    benefitsCount: 38
  },
  {
    id: 'FL',
    name: 'Florida',
    position: [2, -1.5, 0],
    size: [1.2, 0.8, 0.1],
    benefitsCount: 35
  },
  {
    id: 'NY',
    name: 'New York',
    position: [1, 1, 0],
    size: [1, 1, 0.1],
    benefitsCount: 41
  }
];

const StateMesh = ({ 
  stateData, 
  isSelected, 
  isHovered,
  onSelect, 
  onHover, 
  onUnhover 
}: {
  stateData: any;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const materialColor = useMemo(() => {
    if (isSelected) return '#9333ea'; // Purple for selected
    if (isHovered) return '#0ea5e9';  // Light blue for hover
    return '#1e40af';                // Default blue
  }, [isSelected, isHovered]);

  useFrame(() => {
    if (meshRef.current && (isSelected || isHovered)) {
      meshRef.current.position.z = 0.2;
    } else if (meshRef.current) {
      meshRef.current.position.z = 0;
    }
  });

  return (
    <group position={stateData.position}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          onUnhover();
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={stateData.size} />
        <meshStandardMaterial 
          color={materialColor}
          emissive={isSelected || isHovered ? materialColor : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.1 : 0}
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {stateData.id}
      </Text>
    </group>
  );
};

const InteractiveUSMap = ({ onStateSelect }: { onStateSelect?: (stateId: string) => void }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId);
    onStateSelect?.(stateId);
  };

  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg overflow-hidden relative">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <group>
          {sampleStates.map((state) => (
            <StateMesh
              key={state.id}
              stateData={state}
              isSelected={selectedState === state.id}
              isHovered={hoveredState === state.id}
              onSelect={() => handleStateSelect(state.id)}
              onHover={() => setHoveredState(state.id)}
              onUnhover={() => setHoveredState(null)}
            />
          ))}
        </group>

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={15}
          minDistance={5}
        />
      </Canvas>
      
      {selectedState && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-blue-900">
            {sampleStates.find(s => s.id === selectedState)?.name}
          </h3>
          <p className="text-sm text-gray-600">
            {sampleStates.find(s => s.id === selectedState)?.benefitsCount} benefits available
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveUSMap;
