"use client";
import * as THREE from 'three';

export class MobileOptimizedMaterials {
  // Create optimized material for service objects
  static createServiceMaterial(color: string, isActive: boolean = false): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: isActive ? 0.8 : 0.6,
      roughness: isActive ? 0.2 : 0.4,
      emissive: isActive ? color : '#000000',
      emissiveIntensity: isActive ? 0.3 : 0,
    });

    // Optimize for mobile performance
    material.flatShading = false; // Keep smooth shading but optimize elsewhere
    material.side = THREE.FrontSide; // Only render front faces
    
    return material;
  }

  // Create LOD-aware material that simplifies at distance
  static createLODMaterial(color: string, lodLevel: 'high' | 'medium' | 'low'): THREE.Material {
    if (lodLevel === 'low') {
      // Use basic material for distant objects
      return new THREE.MeshBasicMaterial({ 
        color: color,
        side: THREE.FrontSide 
      });
    }
    
    return this.createServiceMaterial(color, false);
  }

  // Dispose material properly to free GPU memory
  static disposeMaterial(material: THREE.Material | THREE.Material[]): void {
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach(mat => {
      if (mat.map) mat.map.dispose();
      if (mat.normalMap) mat.normalMap.dispose();
      if (mat.roughnessMap) mat.roughnessMap.dispose();
      mat.dispose();
    });
  }
}
