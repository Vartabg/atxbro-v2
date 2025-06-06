"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

export function SimplePlanetarySystem({ onPlanetClick }) {
  const systemRef = useRef();

  useFrame((state) => {
    if (systemRef.current) {
      systemRef.current.rotation.y += 0.002;
    }
  });

  const planets = [
    { name: 'VetNav', position: [-4, 0, 0], color: '#3b82f6', size: 0.8, app: 'vetnav' },
    { name: 'Tariff Explorer', position: [4, 0, 0], color: '#10b981', size: 0.7, app: 'tariff' },
    { name: 'Pet Radar', position: [0, 3, 0], color: '#8b5cf6', size: 0.6, app: 'pet' },
    { name: 'Jets Home', position: [0, -3, 0], color: '#f59e0b', size: 0.6, app: 'jets' }
  ];

  return (
    <group ref={systemRef}>
      {/* Central Sun */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Planets */}
      {planets.map((planet) => (
        <group key={planet.name}>
          <Sphere 
            args={[planet.size]} 
            position={planet.position}
            onClick={() => onPlanetClick(planet.app)}
          >
            <meshStandardMaterial 
              color={planet.color} 
              emissive={planet.color} 
              emissiveIntensity={0.1}
            />
          </Sphere>
        </group>
      ))}
      
      {/* Orbital rings */}
      {planets.map((planet, index) => (
        <mesh key={`ring-${index}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.sqrt(planet.position[0]**2 + planet.position[1]**2) - 0.1, Math.sqrt(planet.position[0]**2 + planet.position[1]**2) + 0.1, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
      ))}
    </group>
  );
}
