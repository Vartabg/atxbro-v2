import * as THREE from 'three';
import Planet from '../common/Planet';

export class Mars extends Planet {
  private mesh: THREE.Mesh;

  constructor(radius: number) {
    super(radius);
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xb87333 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
  }

  update(time: number): void {
    this.mesh.rotation.y += 0.001 * time * 0.001;
  }
}
