"use client";
import React from 'react';
import { ProceduralNebula } from './ProceduralNebula';
import { AdvancedStarfield } from './AdvancedStarfield';
import { RealisticPlanet } from './RealisticPlanet';
import { ShootingStars } from './ShootingStars';
import { WarpTransition } from './WarpTransition';

interface CosmicSceneProps {
  showWarp?: boolean;
  onWarpComplete?: () => void;
}

export function CosmicScene({ showWarp = false, onWarpComplete }: CosmicSceneProps) {
  return (
    <>
      <ProceduralNebula />
      <AdvancedStarfield />
      <ShootingStars />
      <WarpTransition isActive={showWarp} onComplete={onWarpComplete} />
    </>
  );
}
