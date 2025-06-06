'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdvancedPlanetarySystemWithMoons } from './AdvancedPlanetarySystemWithMoons';
import { CameraController } from './CameraController';
import { PlanetPortalCard } from './PlanetPortalCard';
import VetNavPortal from './VetNavPortal';
import VetNav from './VetNav';
import TariffExplorer from './TariffExplorer';
import PetRadar from './PetRadar';
import { QuantumParticleField, GravitationalWaves } from './QuantumEffects';

// ... (interface PlanetData and const JetsHomePlaceholder remain the same)

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
   <p className="text-xl text-green-200 mb-8">Professional sports analytics and performance tracking</p>
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

  // Mobile-first camera logic
  const cameraPosition = useMemo(() => {
    const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9;
    // If the screen is portrait (taller than it is wide), pull camera back
    const z = aspect < 1 ? 75 : 50;
    return [0, 0, z];
  }, []);

  const handlePlanetClick = (planetData: PlanetData) => {
    setSelectedPlanet(planetData);
    setIsTracking(true);
    setActiveApp(null); 
    setShowMap(false);
  };

  const handleClosePortal = () => {
    setSelectedPlanet(null);
    setIsTracking(false);
    setActiveApp(null);
    setShowMap(false);
  };

  const handleLaunchApp = (appType: string) => {
    setActiveApp(appType);
    setShowMap(false);
  };
  
  const handleShowMap = () => {
    setShowMap(true);
    setActiveApp(null);
  };

  const closeApp = () => {
    setActiveApp(null);
    setShowMap(false);
  };

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-screen">
        <Canvas camera={{ position: cameraPosition, fov: 60 }} className="w-full h-full">
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <CameraController targetPlanet={selectedPlanet} isTracking={isTracking} />
            <QuantumParticleField />
            <GravitationalWaves />
            <AdvancedPlanetarySystemWithMoons onPlanetClick={handlePlanetClick} selectedPlanet={selectedPlanet} />
          </Suspense>
        </Canvas>
      </div>

      {!selectedPlanet && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
              What's good, bro
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 opacity-80">
              Select a planet to begin your journey
            </p>
          </div>
        </div>
      )}

      {selectedPlanet && !activeApp && !showMap && ( <PlanetPortalCard planet={selectedPlanet} onClose={handleClosePortal} onLaunchApp={handleLaunchApp} onShowMap={handleShowMap} /> )}
      
      {selectedPlanet && showMap && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{selectedPlanet.name} - Interactive Map</h2>
              <button onClick={() => setShowMap(false)} className="text-white hover:text-gray-300 text-2xl"> × </button>
            </div>
            <div className="flex-1">
              <VetNavPortal onNavigateToApp={() => setActiveApp('vetnav')} />
            </div>
          </div>
        </div>
      )}

      {activeApp === 'vetnav' && ( <div className="fixed inset-0 bg-black/95 z-50"> <VetNav /> <button onClick={closeApp} className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"> × </button> </div> )}
      {activeApp === 'tariff-explorer' && ( <div className="fixed inset-0 bg-black/95 z-50"> <TariffExplorer /> <button onClick={closeApp} className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"> × </button> </div> )}
      {activeApp === 'pet-radar' && ( <div className="fixed inset-0 bg-black/95 z-50"> <PetRadar /> <button onClick={closeApp} className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"> × </button> </div> )}
      {activeApp === 'jetshome' && ( <div className="fixed inset-0 bg-black/95 z-50"> <JetsHomePlaceholder /> <button onClick={closeApp} className="fixed top-4 right-4 text-white hover:text-gray-300 text-2xl z-60"> × </button> </div> )}
    </div>
  );
}
