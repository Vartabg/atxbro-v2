export class MobileOptimizer {
  static isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }

  static getOptimalSettings() {
    const isMobile = this.isMobile();
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    return {
      maxParticles: isMobile ? (isLowEnd ? 50 : 100) : 200,
      shadowsEnabled: !isMobile,
      antialiasing: !isMobile,
      pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio,
      maxTextureSize: isMobile ? 1024 : 2048,
      lodDistance: isMobile ? 3 : 5,
      renderDistance: isMobile ? 15 : 25,
      effectsQuality: isMobile ? 'low' : 'high',
      frameTarget: isMobile ? 30 : 60
    };
  }

  static shouldReduceEffects(): boolean {
    return this.isMobile() || navigator.hardwareConcurrency <= 4;
  }

  static getOptimalGeometry(baseComplexity: number): number {
    const settings = this.getOptimalSettings();
    return this.isMobile() ? Math.max(4, baseComplexity / 4) : baseComplexity;
  }
}
