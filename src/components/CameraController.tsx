import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraControllerProps {
  targetPlanet: { position: [number, number, number]; size: number } | null;
  isTracking: boolean;
}

export function CameraController({ targetPlanet, isTracking }: CameraControllerProps) {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  const originalCameraPos = useRef(new Vector3(0, 0, 50));
  const originalTarget = useRef(new Vector3(0, 0, 0));
  
  useFrame((state, delta) => {
    if (isTracking && targetPlanet && controls) {
      // Planet becomes the new center of attention
      const planetPos = new Vector3(...targetPlanet.position);
      
      // Position camera to make planet the focal point
      const viewDistance = Math.max(targetPlanet.size * 4, 20);
      
      // Camera positioned to make planet center stage
      targetPosition.current.set(
        planetPos.x, // Same X as planet
        planetPos.y + viewDistance * 0.3, // Slightly above
        planetPos.z + viewDistance // Back from planet
      );
      
      // Look directly at the planet (planet becomes center)
      targetLookAt.current.copy(planetPos);
      
      // Smooth camera transition
      camera.position.lerp(targetPosition.current, delta * 2.5);
      controls.target.lerp(targetLookAt.current, delta * 3);
      
      // Orbit controls centered on the planet
      controls.enablePan = false;
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.minDistance = viewDistance * 0.6;
      controls.maxDistance = viewDistance * 1.8;
      
    } else if (controls) {
      // Return to sun-centered view
      camera.position.lerp(originalCameraPos.current, delta * 1.5);
      controls.target.lerp(originalTarget.current, delta * 1.5);
      
      // Reset to system-wide view
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.minDistance = 20;
      controls.maxDistance = 200;
    }
    
    if (controls) {
      controls.update();
    }
  });

  return null;
}
