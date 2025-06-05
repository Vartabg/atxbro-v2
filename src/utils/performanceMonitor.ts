"use client";

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private memoryUsage = { textures: 0, geometries: 0, drawCalls: 0 };

  updateFPS() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }

  updateMemoryUsage(renderer: any) {
    if (renderer && renderer.info) {
      this.memoryUsage = {
        textures: renderer.info.memory.textures,
        geometries: renderer.info.memory.geometries,
        drawCalls: renderer.info.render.calls
      };
    }
    return this.memoryUsage;
  }

  getFPS() { return this.fps; }
  getMemoryUsage() { return this.memoryUsage; }
  
  // Mobile GPU memory limit check (384MB for iOS Safari)
  isNearMemoryLimit() {
    const estimatedUsage = this.memoryUsage.textures * 4 + this.memoryUsage.geometries * 2;
    return estimatedUsage > 300; // Conservative 300MB limit
  }
}
