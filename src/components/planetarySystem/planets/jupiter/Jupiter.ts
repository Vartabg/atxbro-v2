import * as THREE from 'three';
import Planet from '../common/Planet';

export class Jupiter extends Planet {
  private mesh: THREE.Mesh;

  constructor(radius: number) {
    super(radius);
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xd2b48c });
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
  }

  update(time: number): void {
    this.mesh.rotation.y += 0.0005 * time * 0.001;
  }
}
