"use client";

import React from 'react';
import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdvancedPlanetarySystemWithMoons, PlanetData } from "./AdvancedPlanetarySystemWithMoons";
import { QuantumParticleField, GravitationalWaves } from "./QuantumEffects";
import { VetNavPortal } from "./VetNavPortal";

export default function Landing3D() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const handlePlanetClick = (planetData: PlanetData) => {
    setSelectedPlanet(planetData);
    
    // Auto-launch app after selection
    setTimeout(() => {
      setActiveApp(planetData.app);
    }, 1000);
  };

  const closeApp = () => {
    setActiveApp(null);
    setSelectedPlanet(null);
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-screen">
        <Canvas
          camera={{ position: [0, 0, 50], fov: 60 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <QuantumParticleField />
            <GravitationalWaves />
            <AdvancedPlanetarySystemWithMoons 
              onPlanetClick={handlePlanetClick}
              selectedPlanet={selectedPlanet}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Planet Info Panel */}
      {selectedPlanet && !activeApp && (
        <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md text-white p-6 rounded-xl max-w-md border border-blue-500/30">
          <h3 className="text-xl font-bold mb-2 text-blue-300">{selectedPlanet.name}</h3>
          <p className="text-sm text-blue-200 mb-4">{selectedPlanet.description}</p>
          
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-white">Features:</h4>
            {selectedPlanet.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-sm text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setActiveApp(selectedPlanet.app)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition-colors flex-1"
            >
              Launch Application
            </button>
            <button 
              onClick={() => setSelectedPlanet(null)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
          
          <div className="mt-3 text-xs text-blue-300">
            🚀 Launching in cosmic portal mode...
          </div>
        </div>
      )}

      {/* App Portals */}
      <VetNavPortal 
        isActive={activeApp === 'vetnav'} 
        onClose={closeApp}
      />
      
      {/* Placeholder for other apps */}
      {activeApp && activeApp !== 'vetnav' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {selectedPlanet?.name} Portal
            </h2>
            <p className="mb-4">Application portal coming soon...</p>
            <button 
              onClick={closeApp}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
            >
              Return to Cosmos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
