import * as topojson from 'topojson-client';
import * as THREE from 'three';

export interface ProcessedState {
  id: string;
  name: string;
  benefits: number;
  shape: THREE.Shape;
  position: [number, number, number];
  color: string;
}

interface MapBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
  scale: number;
}

function calculateMapBounds(features: any[]): MapBounds {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  // Collect all coordinates from all states
  features.forEach(feature => {
    if (!feature.geometry || !feature.geometry.coordinates) return;
    
    let coordinates = feature.geometry.coordinates;
    
    if (feature.geometry.type === 'MultiPolygon') {
      coordinates = coordinates[0];
    }
    
    const ring = coordinates[0];
    if (!ring) return;
    
    ring.forEach(([x, y]: [number, number]) => {
      if (typeof x === 'number' && typeof y === 'number') {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    });
  });
  
  const mapWidth = maxX - minX;
  const mapHeight = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // Scale to fit in scene (target size ˜ 4 units for good visibility)
  const scale = 4 / Math.max(mapWidth, mapHeight);
  
  return { minX, maxX, minY, maxY, centerX, centerY, scale };
}

function toSceneCoords(x: number, y: number, bounds: MapBounds): [number, number] {
  return [
    (x - bounds.centerX) * bounds.scale,
    -(y - bounds.centerY) * bounds.scale  // Flip Y for WebGL
  ];
}

function createShapeFromFeature(feature: any, bounds: MapBounds): THREE.Shape {
  const shape = new THREE.Shape();
  
  try {
    if (!feature.geometry || !feature.geometry.coordinates) return shape;
    
    let coordinates = feature.geometry.coordinates;
    
    if (feature.geometry.type === 'MultiPolygon') {
      coordinates = coordinates[0];
    }
    
    const ring = coordinates[0];
    if (!ring || ring.length < 3) return shape;
    
    // Simplify coordinates for performance
    const step = ring.length > 100 ? Math.floor(ring.length / 50) : 1;
    const simplifiedRing = ring.filter((_: any, index: number) => index % step === 0);
    
    if (simplifiedRing.length < 3) return shape;
    
    // Transform first point
    const [startX, startY] = simplifiedRing[0];
    const [sceneStartX, sceneStartY] = toSceneCoords(startX, startY, bounds);
    shape.moveTo(sceneStartX, sceneStartY);
    
    // Transform remaining points
    for (let i = 1; i < simplifiedRing.length; i++) {
      const [x, y] = simplifiedRing[i];
      if (typeof x === 'number' && typeof y === 'number') {
        const [sceneX, sceneY] = toSceneCoords(x, y, bounds);
        shape.lineTo(sceneX, sceneY);
      }
    }
    
  } catch (error) {
    console.warn('Error creating shape for state:', feature.properties?.name, error);
  }
  
  return shape;
}

function calculateCenterPosition(feature: any, bounds: MapBounds): [number, number, number] {
  if (!feature.geometry || !feature.geometry.coordinates) return [0, 0, 0];
  
  try {
    let coordinates = feature.geometry.coordinates;
    
    if (feature.geometry.type === 'MultiPolygon') {
      coordinates = coordinates[0];
    }
    
    const ring = coordinates[0];
    if (!ring || ring.length === 0) return [0, 0, 0];
    
    let totalX = 0, totalY = 0, count = 0;
    
    for (const coord of ring) {
      if (Array.isArray(coord) && coord.length >= 2) {
        totalX += coord[0];
        totalY += coord[1];
        count++;
      }
    }
    
    if (count === 0) return [0, 0, 0];
    
    const centerX = totalX / count;
    const centerY = totalY / count;
    
    const [sceneX, sceneY] = toSceneCoords(centerX, centerY, bounds);
    return [sceneX, sceneY, 0];
  } catch (error) {
    console.warn('Error calculating position for state:', feature.properties?.name, error);
    return [0, 0, 0];
  }
}

// State benefits data - all 50 states + DC
const stateBenefits: Record<string, number> = {
  '01': 167, '02': 123, '04': 267, '05': 156, '06': 623, '08': 198, '09': 134,
  '10': 56, '11': 67, '12': 445, '13': 267, '15': 89, '16': 98, '17': 312, 
  '18': 189, '19': 134, '20': 112, '21': 189, '22': 189, '23': 89, '24': 178, 
  '25': 223, '26': 234, '27': 201, '28': 123, '29': 223, '30': 89, '31': 89, 
  '32': 156, '33': 78, '34': 234, '35': 145, '36': 389, '37': 289, '38': 56, 
  '39': 278, '40': 178, '41': 234, '42': 356, '44': 45, '45': 156, '46': 67, 
  '47': 234, '48': 847, '49': 134, '50': 67, '51': 312, '53': 289, '54': 134, 
  '55': 178, '56': 67
};

export async function loadTopoJsonStates(): Promise<ProcessedState[]> {
  try {
    const response = await fetch('/data/states-albers-10m.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const topology = await response.json();
    
    if (!topology.objects || !topology.objects.states) {
      throw new Error('Invalid TopoJSON structure');
    }
    
    const states = topojson.feature(topology, topology.objects.states);
    
    // Calculate map bounds first
    const bounds = calculateMapBounds(states.features);
    console.log('Map bounds calculated:', bounds);
    
    const processedStates = states.features
      .map((feature: any) => {
        try {
          const shape = createShapeFromFeature(feature, bounds);
          const position = calculateCenterPosition(feature, bounds);
          const benefits = stateBenefits[feature.id] || 100;
          
          return {
            id: feature.id,
            name: feature.properties?.name || 'Unknown',
            benefits,
            shape,
            position,
            color: '#2F80ED'
          };
        } catch (error) {
          console.warn('Error processing state:', feature.properties?.name, error);
          return null;
        }
      })
      .filter((state: any) => state !== null);
    
    console.log('States loaded:', processedStates.length);
    console.log('Sample state names:', processedStates.slice(0, 5).map(s => s.name));
    return processedStates;
    
  } catch (error) {
    console.error('Error loading TopoJSON states:', error);
    return [];
  }
}
