import * as THREE from 'three';

export default class Planet {
  protected group: THREE.Group;
  protected radius: number;

  constructor(radius: number) {
    this.radius = radius;
    this.group = new THREE.Group();
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  update(_time: number, _sunDirection: THREE.Vector3): void {}

  dispose(): void {}
}
