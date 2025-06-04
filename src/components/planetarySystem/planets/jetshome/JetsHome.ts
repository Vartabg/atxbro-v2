import * as THREE from 'three';
import Planet from '../common/Planet';

export class JetsHome extends Planet {
  private mesh: THREE.Mesh;

  constructor(radius: number) {
    super(radius);
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0x66ccff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
  }

  update(time: number): void {
    this.mesh.rotation.y += 0.0008 * time * 0.001;
  }
}
