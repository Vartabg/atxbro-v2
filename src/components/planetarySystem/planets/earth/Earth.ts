import * as THREE from 'three';

export class Earth {
  private group: THREE.Group;
  private sphere: THREE.Mesh;
  private radius: number;

  constructor(radius: number = 1) {
    this.radius = radius;
    this.group = new THREE.Group();
    this.createEarth();
  }

  private createEarth(): void {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x4169E1,
      wireframe: false 
    });
    
    this.sphere = new THREE.Mesh(geometry, material);
    this.group.add(this.sphere);
  }

  public getGroup(): THREE.Group {
    return this.group;
  }

  public setAtmosphereIntensity(intensity: number): void {
    // Placeholder for atmosphere effects
    if (this.sphere.material instanceof THREE.MeshLambertMaterial) {
      this.sphere.material.emissive.setScalar(intensity * 0.1);
    }
  }

  public update(time: number, sunDirection: THREE.Vector3): void {
    this.sphere.rotation.y += 0.01;
  }

  public dispose(): void {
    this.sphere.geometry.dispose();
    if (this.sphere.material instanceof THREE.Material) {
      this.sphere.material.dispose();
    }
  }
}
