"use client";
import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Cylinder, Html, RoundedBox } from '@react-three/drei';
import { ShieldCheck, BarChart3, PawPrint, TrendingUp } from 'lucide-react';
import { useSpring, animated } from '@react-spring/three';

// Import our interfaces
import VetNavInterface from './vetnav/VetNavInterface';
import TariffInterface from './TariffInterface';
import PetRadarInterface from './PetRadarInterface';
import JetsHomeInterface from './JetsHomeInterface';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position3D: [number, number, number];
  color: string;
  icon: React.ComponentType;
  description: string;
}

interface ServiceObjectProps {
  service: Service;
  isActive: boolean;
  onClick: (id: string) => void;
}

function ServiceObject({ service, isActive, onClick }: ServiceObjectProps) {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  const { scale } = useSpring({
    scale: isActive ? 1.2 : hovered ? 1.1 : 1,
    config: { tension: 300, friction: 10 }
  });

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(service.id);
  };

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  let shape;
  switch (service.id) {
    case 'vetnav':
      shape = (
        <Sphere args={[1, 32, 32]} ref={meshRef}>
          <meshStandardMaterial 
            color={isActive ? "#00ff00" : hovered ? "#ff69b4" : service.color}
            emissive={isActive ? "#004400" : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Sphere>
      );
      break;
    case 'tariff-explorer':
      shape = (
        <Cylinder args={[0.7, 0.7, 2, 32]} ref={meshRef}>
          <meshStandardMaterial 
            color={isActive ? "#00ff00" : hovered ? "#ff69b4" : service.color}
            emissive={isActive ? "#004400" : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Cylinder>
      );
      break;
    case 'pet-radar':
      shape = (
        <Torus args={[0.8, 0.3, 16, 100]} ref={meshRef}>
          <meshStandardMaterial 
            color={isActive ? "#00ff00" : hovered ? "#ff69b4" : service.color}
            emissive={isActive ? "#004400" : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </Torus>
      );
      break;
    case 'fundraiser':
      shape = (
        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.1} smoothness={4} ref={meshRef}>
          <meshStandardMaterial 
            color={isActive ? "#00ff00" : hovered ? "#ff69b4" : service.color}
            emissive={isActive ? "#004400" : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0}
          />
        </RoundedBox>
      );
      break;
    default:
      shape = (
        <Sphere args={[1, 32, 32]} ref={meshRef}>
          <meshStandardMaterial color={service.color} />
        </Sphere>
      );
  }

  return (
    <animated.group 
      position={service.position3D} 
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {shape}
    </animated.group>
  );
}

export default function Landing3D() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const services: Service[] = [
    { 
      id: 'vetnav', 
      title: 'VetNav', 
      subtitle: 'Benefits Navigator', 
      position3D: [-3.5, 1.5, 0], 
      color: '#2563eb', 
      icon: ShieldCheck, 
      description: 'Navigate veteran benefits effectively.' 
    },
    { 
      id: 'tariff-explorer', 
      title: 'Tariff Explorer', 
      subtitle: 'Trade Insights', 
      position3D: [3.5, 1.5, 0], 
      color: '#10b981', 
      icon: BarChart3, 
      description: 'Explore and understand trade tariffs.' 
    },
    { 
      id: 'pet-radar', 
      title: 'Pet Radar', 
      subtitle: 'Lost & Found Pets', 
      position3D: [-2.5, -1.5, 0], 
      color: '#8b5cf6', 
      icon: PawPrint, 
      description: 'Help find lost pets in your area.' 
    },
    { 
      id: 'fundraiser', 
      title: 'Fundraiser Tool', 
      subtitle: 'Support Causes', 
      position3D: [2.5, -1.5, 0], 
      color: '#f59e0b', 
      icon: TrendingUp, 
      description: 'Manage and promote fundraising campaigns.' 
    },
  ];

  const handleServiceObjectClick = (id: string) => {
    setActiveServiceId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-80 sm:h-96 md:h-[calc(100vh-var(--header-height,0px))]">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          className="w-full h-full"
        >
          <Suspense fallback={
            <Html center>
              <span style={{color: 'white'}}>Loading 3D Experience...</span>
            </Html>
          }>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[-5, 5, 5]} intensity={1} color="lightblue" />
            
            {services.map(service => (
              <ServiceObject 
                key={service.id} 
                service={service}
                isActive={service.id === activeServiceId}
                onClick={handleServiceObjectClick} 
              />
            ))}
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              minDistance={5} 
              maxDistance={20} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Interface Modal */}
      {activeServiceId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[95vh] w-full overflow-hidden relative">
            <button 
              onClick={() => setActiveServiceId(null)}
              className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-800 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close interface"
            >
              ✕
            </button>
            <div className="w-full h-full">
              {(() => {
                switch(activeServiceId) {
                  case 'vetnav':
                    return <VetNavInterface onClose={() => setActiveServiceId(null)} />;
                  case 'tariff-explorer':
                    return <TariffInterface onClose={() => setActiveServiceId(null)} />;
                  case 'pet-radar':
                    return <PetRadarInterface onClose={() => setActiveServiceId(null)} />;
                  case 'fundraiser':
                    return <JetsHomeInterface onClose={() => setActiveServiceId(null)} />;
                  default:
                    return (
                      <div className="flex items-center justify-center h-96 bg-gray-50">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading {activeServiceId}...</p>
                        </div>
                      </div>
                    );
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {activeServiceId && (
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-75 text-white p-4 rounded-lg max-w-sm">
          <h3 className="text-xl font-bold">{services.find(s => s.id === activeServiceId)?.title}</h3>
          <p className="text-sm">{services.find(s => s.id === activeServiceId)?.description}</p>
        </div>
      )}
    </div>
  );
}
