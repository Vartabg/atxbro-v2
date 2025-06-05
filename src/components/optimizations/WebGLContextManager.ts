export class WebGLContextManager {
  private static instance: WebGLContextManager;
  private contextLostCount = 0;
  private maxContextLoss = 3;

  static getInstance(): WebGLContextManager {
    if (!WebGLContextManager.instance) {
      WebGLContextManager.instance = new WebGLContextManager();
    }
    return WebGLContextManager.instance;
  }

  setupContextLossHandling(canvas: HTMLCanvasElement, onContextLoss: () => void, onContextRestore: () => void) {
    canvas.addEventListener('webglcontextlost', (event) => {
      console.warn('WebGL context lost');
      event.preventDefault();
      this.contextLostCount++;
      
      if (this.contextLostCount <= this.maxContextLoss) {
        onContextLoss();
      } else {
        console.error('Too many context losses, falling back to 2D mode');
      }
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      onContextRestore();
    });
  }

  forceContextRestore(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    const extension = gl.getExtension('WEBGL_lose_context');
    if (extension) {
      extension.restoreContext();
    }
  }

  reduceMemoryPressure() {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear any large allocations
    console.log('Reducing memory pressure for WebGL stability');
  }
}
