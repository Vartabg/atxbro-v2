"use client";
import * as THREE from 'three';

export class TextureManager {
  private static instance: TextureManager;
  private textureCache = new Map<string, THREE.Texture>();
  private maxTextureSize = 2048; // Conservative for mobile
  private memoryUsage = 0;
  private readonly MAX_MEMORY_MB = 300; // 300MB limit for mobile

  static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager();
    }
    return TextureManager.instance;
  }

  async loadOptimizedTexture(url: string, renderer?: THREE.WebGLRenderer): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }

    // Check available GPU memory
    if (renderer) {
      const maxTextureSize = renderer.capabilities.maxTextureSize;
      this.maxTextureSize = Math.min(maxTextureSize, 2048); // Cap at 2K for mobile
    }

    const texture = new THREE.TextureLoader().load(url);
    
    // Optimize texture settings for mobile
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.flipY = false;

    this.textureCache.set(url, texture);
    this.memoryUsage += this.estimateTextureMemory(texture);
    
    return texture;
  }

  private estimateTextureMemory(texture: THREE.Texture): number {
    // Rough estimate: width * height * 4 bytes (RGBA) + mipmaps (~33% extra)
    const size = this.maxTextureSize * this.maxTextureSize * 4 * 1.33;
    return size / (1024 * 1024); // Convert to MB
  }

  disposeTexture(url: string): void {
    const texture = this.textureCache.get(url);
    if (texture) {
      texture.dispose();
      this.textureCache.delete(url);
      this.memoryUsage -= this.estimateTextureMemory(texture);
    }
  }

  isNearMemoryLimit(): boolean {
    return this.memoryUsage > this.MAX_MEMORY_MB * 0.8; // 80% threshold
  }

  getMemoryUsage(): number {
    return this.memoryUsage;
  }

  clearCache(): void {
    this.textureCache.forEach(texture => texture.dispose());
    this.textureCache.clear();
    this.memoryUsage = 0;
  }
}
