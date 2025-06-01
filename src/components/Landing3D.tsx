"use client";

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, Cylinder } from '@react-three/drei';
import { ShieldCheck, BarChart3, PawPrint, TrendingUp } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position3D: [number, number, number];
  color: string;
  icon: any;
  description: string;
}

interface ServiceObjectProps {
  service: Service;
  isActive: boolean;
  onClick: (id: string) => void;
}

function ServiceObject({ service, isActive, onClick }: ServiceObjectProps) {
  const meshRef = useRef<any>();
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  const getShape = (id: string) => {
    switch(id) {
      case 'vetnav': return <Sphere args={[1, 32, 32]} />;
      case 'tariff-explorer': return <Cylinder args={[0.7, 0.7, 2, 32]} />;
      case 'pet-radar': return <Torus args={[0.8, 0.3, 16, 100]} />;
      case 'fundraiser': return <Box args={[1.5, 1.5, 1.5]} />;
      default: return <Box args={[1.5, 1.5, 1.5]} />;
    }
  };
  
  const baseColor = hovered ? 'hotpink' : 'orange';
  const emissiveColor = hovered ? 'red' : 'black';


  return (
    <group position={service.position3D}>
      <mesh
        ref={meshRef}
        onClick={(event) => { event.stopPropagation(); onClick(service.id); }}
        onPointerOver={(event) => { event.stopPropagation(); setHover(true); }}
        onPointerOut={(event) => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        {getShape(service.id)}
        <meshStandardMaterial 
          color={baseColor} 
          emissive={emissiveColor} 
          roughness={0.3} 
          metalness={0.6} 
        />
      </mesh>
    </group>
  );
}


export default function Landing3D() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const services: Service[] = [
    { id: 'vetnav', title: 'VetNav', subtitle: 'Benefits Navigator', position3D: [-3.5, 1.5, 0], color: 'blue', icon: ShieldCheck, description: 'Navigate veteran benefits effectively.' },
    { id: 'tariff-explorer', title: 'Tariff Explorer', subtitle: 'Trade Insights', position3D: [3.5, 1.5, 0], color: 'green', icon: BarChart3, description: 'Explore and understand trade tariffs.' },
    { id: 'pet-radar', title: 'Pet Radar', subtitle: 'Lost & Found Pets', position3D: [-2.5, -1.5, 0], color: 'purple', icon: PawPrint, description: 'Help find lost pets in your area.' },
    { id: 'fundraiser', title: 'Fundraiser Tool', subtitle: 'Support Causes', position3D: [2.5, -1.5, 0], color: 'yellow', icon: TrendingUp, description: 'Manage and promote fundraising campaigns.' },
  ];

  const handleServiceObjectClick = (id: string) => {
    setActiveServiceId(id);
  };


  return (
    <div className="relative w-full">
      <div className="w-full h-80 sm:h-96 md:h-screen">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
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

            <Text
              position={[0, 0, 0]} 
              fontSize={1.2} 
              color="white" 
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-VariableFont_opsz,wght.json" // <-- Make sure this matches your generated JSON file name
            >
              What’s good, bro
            </Text>
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              minDistance={5} 
              maxDistance={20} 
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
