import * as THREE from 'three';
import Planet from '../common/Planet';
import { createEarthShaderMaterial, createDefaultEarthUniforms } from './EarthShader';

export class Earth extends Planet {
  private mesh: THREE.Mesh;
  private uniforms = createDefaultEarthUniforms();

  constructor(radius: number) {
    super(radius);

    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = createEarthShaderMaterial(this.uniforms);
    this.mesh = new THREE.Mesh(geometry, material);
    this.group.add(this.mesh);
  }

  update(time: number, sunDirection: THREE.Vector3): void {
    this.uniforms.uTime.value = time * 0.001;
    this.uniforms.uSunDirection.value.copy(sunDirection);
    this.mesh.rotation.y += 0.001;
  }

  setAtmosphereIntensity(value: number): void {
    this.uniforms.uSunIntensity.value = value;
  }

  override dispose(): void {
    this.mesh.geometry.dispose();
    const material = this.mesh.material as THREE.Material;
    material.dispose();
  }
}
