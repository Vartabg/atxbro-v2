'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdvancedPlanetarySystemWithMoons } from './AdvancedPlanetarySystemWithMoons';
import { QuantumParticleField, GravitationalWaves } from './QuantumEffects';
import { CameraController } from './CameraController';
import { PlanetPortalCard } from './PlanetPortalCard';
import { VetNavPortal } from './VetNavPortal';
import VetNav from './VetNav';
import TariffExplorer from './TariffExplorer';
import PetRadar from './PetRadar';

interface PlanetData {
  id: string;
  name: string;
  app: string;
  position: [number, number, number];
  size: number;
  type: string;
  description: string;
  features: string[];
  atmosphereColor: string;
}

const JetsHomePlaceholder = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-900 to-red-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">🏈 Jets Analytics</h1>
      <p className="text-xl text-green-200 mb-8">
        Professional sports analytics and performance tracking
      </p>
      <div className="bg-green-800/50 backdrop-blur-md rounded-xl p-6">
        <p className="text-lg">Coming Soon: Game Analytics & Player Stats</p>
      </div>
    </div>
  </div>
);

export default function Landing3D() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handlePlanetClick = (planetData: PlanetData) => {
    console.log('🌍 Planet selected:', planetData.name, '- Shifting camera focus...');
    setSelectedPlanet(planetData);
    setIsTracking(true);
    setActiveApp(null);
    setShowMap(false);
  };

  const handleClosePortal = () => {
    console.log('🌌 Returning to solar system view...');
    setSelectedPlanet(null);
    setIsTracking(false);
    setActiveApp(null);
    setShowMap(false);
  };

  const handleLaunchApp = (appType: string) => {
    console.log('🚀 Launching app:', appType);
    setActiveApp(appType);
    setShowMap(false);
  };

  const handleShowMap = () => {
    console.log('🗺️ Opening interactive map...');
    setShowMap(true);
    setActiveApp(null);
  };

  const closeApp = () => {
    setActiveApp(null);
    setShowMap(false);
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
            
            {/* Camera Tracking System */}
            <CameraController 
              targetPlanet={selectedPlanet} 
              isTracking={isTracking} 
            />
            
            {/* Cosmic Effects */}
            <QuantumParticleField />
            <GravitationalWaves />
            
            {/* BRO Asteroid Belt */}
            
            {/* Planet System */}
            <AdvancedPlanetarySystemWithMoons
              onPlanetClick={handlePlanetClick}
              selectedPlanet={selectedPlanet}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Simple Instruction Text - Only when no planet selected */}
      {!selectedPlanet && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <p className="text-xl md:text-2xl text-blue-200 opacity-80">
              Select a planet to begin your journey
            </p>
          </div>
        </div>
      )}

      {/* Planet Focus Indicator */}
      {selectedPlanet && !activeApp && !showMap && (
        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
          🎯 Focused on <span className="text-blue-300 font-semibold">{selectedPlanet.name}</span>
        </div>
      )}

      {/* Planet Portal Card */}
      {selectedPlanet && !activeApp && !showMap && (
        <PlanetPortalCard
          planet={selectedPlanet}
          onClose={handleClosePortal}
          onLaunchApp={handleLaunchApp}
          onShowMap={handleShowMap}
        />
      )}

      {/* Interactive Map Mode */}
      {selectedPlanet && showMap && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {selectedPlanet.name} - Interactive Map
              </h2>
              <button
                onClick={() => setShowMap(false)}
                className="text-white hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <VetNavPortal />
            </div>
          </div>
        </div>
      )}

      {/* App Portals */}
      {activeApp === 'vetnav' && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <VetNav />
          <button
            onClick={closeApp}
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'tariff-explorer' && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <TariffExplorer />
          <button
            onClick={closeApp}
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'pet-radar' && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <PetRadar />
          <button
            onClick={closeApp}
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'jetshome' && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <JetsHomePlaceholder />
          <button
            onClick={closeApp}
            className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
