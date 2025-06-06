"use client";
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { SimpleStarField } from "./SimpleCosmicBackground";
import { AdvancedSolarSystem } from "./AdvancedSolarSystem";
import { QuantumParticleField, GravitationalWaves } from "./QuantumEffects";

export default function Landing3D() {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);

  return (
    <div className="relative w-full">
      <div className="w-full h-screen fixed inset-0">
        <Canvas
          camera={{ position: [0, 25, 35], fov: 75 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            
            <SimpleStarField />
            <Stars radius={200} depth={60} count={8000} factor={4} saturation={0} fade />
            
            <QuantumParticleField />
            <GravitationalWaves />
            <AdvancedSolarSystem onPlanetSelect={setSelectedPlanet} />
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              minDistance={15} 
              maxDistance={100} 
            />
          </Suspense>
        </Canvas>
      </div>
      
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 backdrop-blur-md text-white p-6 rounded-xl border-2 border-blue-400 max-w-sm">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{selectedPlanet.icon}</div>
            <h2 className="text-2xl font-bold text-blue-300">{selectedPlanet.name}</h2>
            <p className="text-gray-300 text-sm">{selectedPlanet.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
