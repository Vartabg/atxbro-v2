import { TextureLoader, Texture, LinearFilter, RepeatWrapping, SRGBColorSpace } from 'three';

interface TextureUrls {
  day: string;
  night: string;
  clouds: string;
  normal: string;
  specular: string;
}

interface TextureSet {
  day: Texture | null;
  night: Texture | null;
  clouds: Texture | null;
  normal: Texture | null;
  specular: Texture | null;
}

class EarthTextureManager {
  private static instance: EarthTextureManager;
  private textureLoader: TextureLoader;
  private loadedTextures: TextureSet = {
    day: null,
    night: null,
    clouds: null,
    normal: null,
    specular: null
  };

  private readonly NASA_URLS: TextureUrls = {
    day: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlueMarble_2048.jpg',
    night: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144897/BlackMarble_2016_01deg.jpg',
    clouds: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144899/earth_clouds_2048.jpg',
    normal: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144900/earth_normal_2048.jpg',
    specular: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144901/earth_specular_2048.jpg'
  };

  private readonly FALLBACK_URLS: TextureUrls = {
    day: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    night: 'https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg',
    clouds: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
    normal: 'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg',
    specular: 'https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg'
  };

  private constructor() {
    this.textureLoader = new TextureLoader();
    this.textureLoader.setCrossOrigin('anonymous');
  }

  public static getInstance(): EarthTextureManager {
    if (!EarthTextureManager.instance) {
      EarthTextureManager.instance = new EarthTextureManager();
    }
    return EarthTextureManager.instance;
  }

  private async loadTexture(url: string, type: keyof TextureSet): Promise<Texture> {
    try {
      const texture = await new Promise<Texture>((resolve, reject) => {
        this.textureLoader.load(
          url,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        );
      });

      // Configure texture properties
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;

      // Special handling for different texture types
      switch (type) {
        case 'normal':
          texture.colorSpace = LinearFilter;
          break;
        case 'specular':
          texture.colorSpace = LinearFilter;
          break;
        case 'night':
          texture.colorSpace = SRGBColorSpace;
          break;
      }

      return texture;
    } catch (error) {
      console.warn(`Failed to load ${type} texture from primary source:`, error);
      throw error;
    }
  }

  private async generateProceduralTexture(type: keyof TextureSet): Promise<Texture> {
    // Implement procedural texture generation as last resort
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    switch (type) {
      case 'day':
        await this.generateProceduralDayMap(ctx);
        break;
      case 'night':
        await this.generateProceduralNightMap(ctx);
        break;
      case 'clouds':
        await this.generateProceduralCloudMap(ctx);
        break;
      case 'normal':
        await this.generateProceduralNormalMap(ctx);
        break;
      case 'specular':
        await this.generateProceduralSpecularMap(ctx);
        break;
    }

    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private async generateProceduralDayMap(ctx: CanvasRenderingContext2D): Promise<void> {
    // Implement realistic continent patterns
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#1B4F72');  // Deep ocean
    gradient.addColorStop(0.7, '#2E86C1'); // Shallow ocean
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);

    // Add continent patterns based on real geography
    ctx.fillStyle = '#2ECC71';
    this.drawContinentShapes(ctx);
  }

  private async generateProceduralNightMap(ctx: CanvasRenderingContext2D): Promise<void> {
    // Dark base with city light distribution
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add city lights based on population density data
    ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
    this.drawCityLights(ctx);
  }

  private async generateProceduralCloudMap(ctx: CanvasRenderingContext2D): Promise<void> {
    // Generate realistic cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add cloud formations using Perlin noise
    this.generateCloudNoise(ctx);
  }

  private async generateProceduralNormalMap(ctx: CanvasRenderingContext2D): Promise<void> {
    // Generate height-based normal map
    ctx.fillStyle = '#8080FF';  // Neutral normal
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add terrain-based normal variations
    this.generateTerrainNormals(ctx);
  }

  private async generateProceduralSpecularMap(ctx: CanvasRenderingContext2D): Promise<void> {
    // Generate specular map for water reflectivity
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add ocean specular highlights
    this.generateOceanSpecular(ctx);
  }

  private drawContinentShapes(ctx: CanvasRenderingContext2D): void {
    // Implement realistic continent shapes
    // This is a simplified version - would need actual geographical data for accuracy
    const continents = [
      { path: [[800, 200], [900, 300], [850, 400]], name: 'North America' },
      { path: [[700, 500], [800, 600], [750, 700]], name: 'South America' },
      // Add more continent definitions
    ];

    continents.forEach(continent => {
      ctx.beginPath();
      ctx.moveTo(continent.path[0][0], continent.path[0][1]);
      continent.path.forEach(point => ctx.lineTo(point[0], point[1]));
      ctx.closePath();
      ctx.fill();
    });
  }

  private drawCityLights(ctx: CanvasRenderingContext2D): void {
    // Implement city light distribution based on population density
    const majorCities = [
      { x: 820, y: 280, population: 8.4 },  // New York
      { x: 1200, y: 350, population: 9.3 },  // London
      // Add more city definitions
    ];

    majorCities.forEach(city => {
      const radius = Math.sqrt(city.population) * 2;
      const gradient = ctx.createRadialGradient(
        city.x, city.y, 0,
        city.x, city.y, radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(city.x, city.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private generateCloudNoise(ctx: CanvasRenderingContext2D): void {
    // Implement Perlin noise-based cloud generation
    // This would be replaced with actual cloud pattern algorithms
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const radius = Math.random() * 50 + 25;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private generateTerrainNormals(ctx: CanvasRenderingContext2D): void {
    // Implement terrain-based normal map generation
    // This would be replaced with actual elevation data
    const terrainPoints = [
      { x: 800, y: 300, height: 1.0 },  // Mountains
      { x: 1200, y: 400, height: 0.5 },  // Hills
      // Add more terrain definitions
    ];

    terrainPoints.forEach(point => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, 50
      );
      const normalColor = this.heightToNormal(point.height);
      gradient.addColorStop(0, normalColor);
      gradient.addColorStop(1, '#8080FF');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 50, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private generateOceanSpecular(ctx: CanvasRenderingContext2D): void {
    // Implement ocean specular map generation
    ctx.fillStyle = '#404040';  // Base ocean specularity
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add varying specularity for different ocean regions
    const oceanRegions = [
      { x: 1024, y: 512, radius: 200, reflectivity: 0.8 },  // Equatorial
      { x: 512, y: 256, radius: 150, reflectivity: 0.6 },   // Northern
      // Add more ocean region definitions
    ];

    oceanRegions.forEach(region => {
      const gradient = ctx.createRadialGradient(
        region.x, region.y, 0,
        region.x, region.y, region.radius
      );
      const specColor = Math.floor(region.reflectivity * 255);
      gradient.addColorStop(0, `rgb(${specColor},${specColor},${specColor})`);
      gradient.addColorStop(1, '#404040');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(region.x, region.y, region.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private heightToNormal(height: number): string {
    const r = Math.floor(128 + height * 127);
    const g = Math.floor(128 + height * 127);
    const b = 255;
    return `rgb(${r},${g},${b})`;
  }

  public async loadAllTextures(): Promise<TextureSet> {
    const textureTypes: (keyof TextureSet)[] = ['day', 'night', 'clouds', 'normal', 'specular'];
    
    for (const type of textureTypes) {
      try {
        // Try NASA textures first
        this.loadedTextures[type] = await this.loadTexture(this.NASA_URLS[type], type);
      } catch (error) {
        try {
          // Try fallback textures
          this.loadedTextures[type] = await this.loadTexture(this.FALLBACK_URLS[type], type);
        } catch (fallbackError) {
          console.warn(`Failed to load ${type} texture from fallback source:`, fallbackError);
          // Generate procedural texture as last resort
          this.loadedTextures[type] = await this.generateProceduralTexture(type);
        }
      }
    }

    return this.loadedTextures;
  }

  public getLoadedTextures(): TextureSet {
    return this.loadedTextures;
  }

  public disposeTextures(): void {
    Object.values(this.loadedTextures).forEach(texture => {
      if (texture) {
        texture.dispose();
      }
    });
  }
}

export default EarthTextureManager; 