import * as THREE from 'three';

export class LODManager {
  private camera: THREE.Camera;
  private objects: Map<string, { 
    highDetail: THREE.Object3D; 
    midDetail: THREE.Object3D; 
    lowDetail: THREE.Object3D;
    lod: THREE.LOD;
  }> = new Map();

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  createLODObject(id: string, baseGeometry: THREE.BufferGeometry, material: THREE.Material) {
    const lod = new THREE.LOD();
    
    const highDetail = new THREE.Mesh(baseGeometry, material);
    const midGeometry = baseGeometry.clone();
    const midDetail = new THREE.Mesh(midGeometry, material);
    const lowGeometry = new THREE.SphereGeometry(1, 8, 8);
    const lowDetail = new THREE.Mesh(lowGeometry, material);
    
    lod.addLevel(highDetail, 0);
    lod.addLevel(midDetail, 5);
    lod.addLevel(lowDetail, 12);
    
    this.objects.set(id, { highDetail, midDetail, lowDetail, lod });
    return lod;
  }

  updateLOD() {
    this.objects.forEach(({ lod }) => {
      lod.update(this.camera);
    });
  }

  dispose() {
    this.objects.forEach(({ highDetail, midDetail, lowDetail }) => {
      [highDetail, midDetail, lowDetail].forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    });
    this.objects.clear();
  }
}
