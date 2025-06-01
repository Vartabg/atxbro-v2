"use client";
import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Torus, Cylinder } from '@react-three/drei';
import { ArrowLeft, ShieldCheck, BarChart3, PawPrint, TrendingUp } from 'lucide-react';

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
  onClick: () => void;
}

function ServiceObject({ service, onClick }: ServiceObjectProps) {
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
        onClick={(event) => { event.stopPropagation(); onClick(); }}
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

interface Landing3DProps {
  services: Service[];
  setCurrentView: (view: string) => void;
}

export default function Landing3D({ services, setCurrentView }: Landing3DProps) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-5, 5, 5]} intensity={1} color="lightblue" />
          
          {services.map(service => (
            <ServiceObject 
              key={service.id} 
              service={service} 
              onClick={() => setCurrentView(service.id)} 
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
      
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-4 z-10 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
          ATXBro Solutions
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 opacity-90 drop-shadow-[0_3px_10px_rgba(0,0,0,0.2)]">
          Click an object to explore. Drag to rotate. Scroll to zoom.
        </p>
      </div>
    </div>
  );
}
