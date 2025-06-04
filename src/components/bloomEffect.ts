// src/components/bloomEffect.ts
import { Model, Framebuffer, Geometry } from '@luma.gl/engine';
import { bloomVertexShader, bloomFragmentShader } from './bloomShader';

interface BloomEffectProps {
  threshold?: number;
  intensity?: number;
  radius?: number;
}

export class CustomBloomEffect {
  // Required properties for Deck.gl effect interface
  id = 'custom-bloom-effect';
  name = 'custom-bloom-effect';
  passes: any[] = []; // Important: Deck.gl expects this property
  props: BloomEffectProps;
  
  private brightPassModel?: Model;
  private blurHPassModel?: Model;
  private blurVPassModel?: Model;
  private compositeModel?: Model;
  private brightFBO?: Framebuffer;
  private blurFBO1?: Framebuffer;
  private blurFBO2?: Framebuffer;
  private quadGeometry?: Geometry;
  private isSetup = false;

  constructor(props: BloomEffectProps = {}) {
    this.props = {
      threshold: props.threshold ?? 0.8,
      intensity: props.intensity ?? 1.2,
      radius: props.radius ?? 1.0,
    };
    
    // Initialize passes array - this is what Deck.gl tries to map over
    this.passes = [];
  }

  // Required method: Deck.gl calls this to set up the effect
  setup(context: { device: any; canvas?: any; deck?: any }): void {
    const { device } = context;
    
    try {
      console.log('Setting up bloom effect...');
      
      // Get canvas dimensions
      const canvas = context.canvas || 
                    context.deck?.canvas || 
                    device.canvasContext?.canvas ||
                    device.gl?.canvas;
      
      const width = canvas?.width || canvas?.clientWidth || 1024;
      const height = canvas?.height || canvas?.clientHeight || 768;

      this.setupGeometry(device);
      this.setupFramebuffers(device, width, height);
      this.setupModels(device);
      
      // Set up passes for Deck.gl
      this.setupPasses();
      
      this.isSetup = true;
      console.log('Bloom effect setup complete');
    } catch (error) {
      console.error('Bloom effect setup failed:', error);
      this.passes = []; // Ensure passes is always an array
    }
  }

  private setupPasses(): void {
    // Create pass objects that Deck.gl expects
    this.passes = [
      {
        id: 'bloom-bright-extraction',
        model: this.brightPassModel,
        framebuffer: this.brightFBO,
        uniforms: {}
      },
      {
        id: 'bloom-horizontal-blur',
        model: this.blurHPassModel,
        framebuffer: this.blurFBO1,
        uniforms: {}
      },
      {
        id: 'bloom-vertical-blur',
        model: this.blurVPassModel,
        framebuffer: this.blurFBO2,
        uniforms: {}
      },
      {
        id: 'bloom-composite',
        model: this.compositeModel,
        framebuffer: null, // Will render to output buffer
        uniforms: {}
      }
    ];
  }

  private setupGeometry(device: any): void {
    this.quadGeometry = new Geometry(device, {
      topology: 'triangle-strip',
      vertexCount: 4,
      attributes: {
        position: { 
          size: 2, 
          value: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]) 
        },
      },
    });
  }

  private setupFramebuffers(device: any, width: number, height: number): void {
    const bloomWidth = Math.max(Math.floor(width / 2), 1);
    const bloomHeight = Math.max(Math.floor(height / 2), 1);

    try {
      // Create textures with proper format
      const textureOptions = {
        width: bloomWidth,
        height: bloomHeight,
        format: 'rgba8unorm' as const,
        usage: 'render-attachment | texture-binding' as const
      };

      const brightTexture = device.createTexture(textureOptions);
      const blurTexture1 = device.createTexture(textureOptions);
      const blurTexture2 = device.createTexture(textureOptions);

      // Create framebuffers
      this.brightFBO = device.createFramebuffer({
        width: bloomWidth,
        height: bloomHeight,
        colorAttachments: [{ texture: brightTexture }]
      });

      this.blurFBO1 = device.createFramebuffer({
        width: bloomWidth,
        height: bloomHeight,
        colorAttachments: [{ texture: blurTexture1 }]
      });

      this.blurFBO2 = device.createFramebuffer({
        width: bloomWidth,
        height: bloomHeight,
        colorAttachments: [{ texture: blurTexture2 }]
      });

      console.log('Bloom framebuffers created:', { bloomWidth, bloomHeight });
    } catch (error) {
      console.error('Error creating bloom framebuffers:', error);
      throw error;
    }
  }

  private setupModels(device: any): void {
    try {
      const shaderProps = {
        vs: bloomVertexShader,
        fs: bloomFragmentShader,
        geometry: this.quadGeometry,
      };

      this.brightPassModel = new Model(device, {
        ...shaderProps,
        id: 'bloom-bright-pass',
      });

      this.blurHPassModel = new Model(device, {
        ...shaderProps,
        id: 'bloom-blur-h-pass',
      });

      this.blurVPassModel = new Model(device, {
        ...shaderProps,
        id: 'bloom-blur-v-pass',
      });

      this.compositeModel = new Model(device, {
        ...shaderProps,
        id: 'bloom-composite-pass',
      });

      console.log('Bloom models created successfully');
    } catch (error) {
      console.error('Error creating bloom models:', error);
      throw error;
    }
  }

  // Required method: Deck.gl calls this for each frame
  render(opts: {
    inputBuffer: any;
    outputBuffer: any;
    device: any;
    moduleParameters?: any;
  }): void {
    if (!this.isSetup || !this.validateModels()) {
      console.warn('Bloom effect not ready for rendering');
      return;
    }

    const { inputBuffer, outputBuffer, device } = opts;
    
    if (!inputBuffer?.colorAttachments?.[0]?.texture) {
      console.warn('Invalid input buffer for bloom effect');
      return;
    }

    try {
      this.executeBloomPasses(inputBuffer, outputBuffer, device);
    } catch (error) {
      console.error('Bloom effect render error:', error);
    }
  }

  private validateModels(): boolean {
    return !!(
      this.brightPassModel && 
      this.blurHPassModel && 
      this.blurVPassModel &&
      this.compositeModel &&
      this.brightFBO && 
      this.blurFBO1 && 
      this.blurFBO2
    );
  }

  private executeBloomPasses(inputBuffer: any, outputBuffer: any, device: any): void {
    const inputTexture = inputBuffer.colorAttachments[0].texture;

    // Pass 1: Extract bright areas
    device.beginRenderPass({
      framebuffer: this.brightFBO,
      clearColor: [0, 0, 0, 0]
    });

    this.brightPassModel!.setUniforms({
      uTexture: inputTexture,
      uThreshold: this.props.threshold,
      uIntensity: this.props.intensity,
      uBlurDirection: -1,
      uTexelSize: [1.0 / inputBuffer.width, 1.0 / inputBuffer.height]
    });
    this.brightPassModel!.draw();
    device.endRenderPass();

    // Pass 2: Horizontal blur
    device.beginRenderPass({
      framebuffer: this.blurFBO1,
      clearColor: [0, 0, 0, 0]
    });

    this.blurHPassModel!.setUniforms({
      uTexture: this.brightFBO!.colorAttachments[0].texture,
      uBlurDirection: 0,
      uThreshold: this.props.threshold,
      uIntensity: 1.0,
      uTexelSize: [this.props.radius / this.brightFBO!.width, 0.0]
    });
    this.blurHPassModel!.draw();
    device.endRenderPass();

    // Pass 3: Vertical blur
    device.beginRenderPass({
      framebuffer: this.blurFBO2,
      clearColor: [0, 0, 0, 0]
    });

    this.blurVPassModel!.setUniforms({
      uTexture: this.blurFBO1!.colorAttachments[0].texture,
      uBlurDirection: 1,
      uThreshold: this.props.threshold,
      uIntensity: 1.0,
      uTexelSize: [0.0, this.props.radius / this.brightFBO!.height]
    });
    this.blurVPassModel!.draw();
    device.endRenderPass();

    // Pass 4: Composite (render to output)
    device.beginRenderPass({
      framebuffer: outputBuffer
    });

    this.compositeModel!.setUniforms({
      uTexture: inputTexture,
      uBloomTexture: this.blurFBO2!.colorAttachments[0].texture,
      uBlurDirection: 2,
      uThreshold: this.props.threshold,
      uIntensity: this.props.intensity,
      uTexelSize: [1.0 / outputBuffer.width, 1.0 / outputBuffer.height]
    });
    this.compositeModel!.draw();
    device.endRenderPass();
  }

  // Required method: cleanup resources
  cleanup({ device }: { device: any }): void {
    try {
      this.brightPassModel?.destroy();
      this.blurHPassModel?.destroy();
      this.blurVPassModel?.destroy();
      this.compositeModel?.destroy();
      this.brightFBO?.destroy();
      this.blurFBO1?.destroy();
      this.blurFBO2?.destroy();
      this.quadGeometry?.destroy();
      
      this.isSetup = false;
      this.passes = [];
      
      console.log('Bloom effect cleaned up');
    } catch (error) {
      console.error('Error cleaning up bloom effect:', error);
    }
  }

  // Optional: called before rendering
  preRender?(): void {
    // Optional preprocessing
  }

  // Optional: method that Deck.gl might call
  getUniforms?(): any {
    return {
      threshold: this.props.threshold,
      intensity: this.props.intensity,
      radius: this.props.radius
    };
  }
}