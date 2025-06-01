import * as THREE from 'three';
import { lambertProjection } from './lambertProjection';

export interface StateFeature {
  type: 'Feature';
  properties: {
    name: string;
    id: string;
    benefits: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface ProcessedState {
  id: string;
  name: string;
  benefits: number;
  shape: THREE.Shape;
  position: [number, number, number];
  color: string;
}

// Create THREE.Shape from GeoJSON using Lambert projection
function createShapeFromCoordinates(coordinates: number[][]): THREE.Shape {
  const shape = new THREE.Shape();
  
  if (coordinates.length === 0) return shape;
  
  // Get the outer ring (first array)
  const outerRing = coordinates[0];
  
  if (outerRing.length === 0) return shape;
  
  // Project all coordinates using Lambert projection
  const projectedPoints = outerRing.map(coord => 
    lambertProjection(coord[0], coord[1])
  );
  
  // Find bounds for scaling
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  projectedPoints.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  
  // Scale to reasonable size for 3D scene
  const scaleX = 0.3 / Math.max(maxX - minX, 0.1);
  const scaleY = 0.3 / Math.max(maxY - minY, 0.1);
  const scale = Math.min(scaleX, scaleY);
  
  // Center the shape
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // Create the shape
  const [startX, startY] = projectedPoints[0];
  shape.moveTo((startX - centerX) * scale, (startY - centerY) * scale);
  
  for (let i = 1; i < projectedPoints.length; i++) {
    const [x, y] = projectedPoints[i];
    shape.lineTo((x - centerX) * scale, (y - centerY) * scale);
  }
  
  shape.closePath();
  return shape;
}

// Calculate geographic center using Lambert projection
function calculateCenterPosition(coordinates: number[][]): [number, number, number] {
  if (coordinates.length === 0 || coordinates[0].length === 0) {
    return [0, 0, 0];
  }
  
  const outerRing = coordinates[0];
  let totalLng = 0;
  let totalLat = 0;
  
  for (const coord of outerRing) {
    totalLng += coord[0];
    totalLat += coord[1];
  }
  
  const centerLng = totalLng / outerRing.length;
  const centerLat = totalLat / outerRing.length;
  
  const [x, y] = lambertProjection(centerLng, centerLat);
  
  return [x, y, 0];
}

export function processGeoJsonStates(geoJsonData: any): ProcessedState[] {
  if (!geoJsonData || !geoJsonData.features) {
    console.error('Invalid GeoJSON data');
    return [];
  }
  
  return geoJsonData.features.map((feature: StateFeature) => {
    const shape = createShapeFromCoordinates(feature.geometry.coordinates);
    const position = calculateCenterPosition(feature.geometry.coordinates);
    
    return {
      id: feature.properties.id,
      name: feature.properties.name,
      benefits: feature.properties.benefits,
      shape,
      position,
      color: '#2F80ED'
    };
  });
}

export async function loadStatesData(): Promise<ProcessedState[]> {
  try {
    const response = await fetch('/data/usa-states-detailed.json');
    const geoJsonData = await response.json();
    return processGeoJsonStates(geoJsonData);
  } catch (error) {
    console.error('Error loading states data:', error);
    return [];
  }
}
