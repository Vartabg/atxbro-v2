// Central manager for the planetary navigation system
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLANETARY_CONFIG, PERFORMANCE_CONFIG, PHYSICS_CONFIG } from './PlanetaryConfig';
import { LODManager } from '../utils/LODManager';
import { TextureManager } from '../utils/TextureManager';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';
import { OrbitRenderer } from '../physics/OrbitRenderer';
import { OrbitalElements, OrbitRenderConfig } from '../types/OrbitalTypes';
import type { PerformanceMetrics } from '../utils/PerformanceMonitor';
import { OrbitalMechanics, OrbitalState } from '../physics/OrbitalMechanics';
import { Earth } from '../planets/earth/Earth';
import { CosmicUIManager } from './CosmicUIManager';

export class PlanetarySystemManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private cosmicUI: CosmicUIManager;
  private planets: Map<string, THREE.Object3D> = new Map();
  private isInitialized = false;
  private animationId: number | null = null;
  private lodManager = LODManager.getInstance();
  private textureManager = TextureManager.getInstance();
  private performanceMonitor = PerformanceMonitor.getInstance();
  private orbitRenderer: OrbitRenderer;
  private planetOrbits = new Map<string, OrbitalElements>();
  private startTime = Date.now();
  private showOrbits = true;
  private specialPlanets = new Map<string, any>();
  
  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: false,
      powerPreference: 'high-performance'
    });
    
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupResizeHandler();
    this.setupInteractionControls();
    this.orbitRenderer = new OrbitRenderer(this.scene);
    
    // Initialize Cosmic UI
    this.cosmicUI = new CosmicUIManager(this.camera, canvas.parentElement!);
    
    this.performanceMonitor.subscribe(this.handlePerformanceUpdate.bind(this));
  }

  private setupInteractionControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI;
    
    // Smooth navigation between planets
    this.controls.addEventListener('change', () => {
      this.onCameraMove();
    });
  }

  private onCameraMove(): void {
    // Update UI elements based on camera position
    this.updateUIVisibility();
    
    // Calculate which planet is closest to camera focus
    const focusedPlanet = this.findFocusedPlanet();
    if (focusedPlanet) {
      this.highlightFocusedPlanet(focusedPlanet);
    }
  }

  private updateUIVisibility(): void {
    this.planets.forEach((planet, planetId) => {
      const distanceToCamera = planet.position.distanceTo(this.camera.position);
      const isNearby = distanceToCamera < 25;
      
      if (isNearby && !planet.userData.isHighlighted) {
        this.highlightPlanet(planet, planetId);
      } else if (!isNearby && planet.userData.isHighlighted) {
        this.unhighlightPlanet(planet, planetId);
      }
    });
  }

  private findFocusedPlanet(): { planet: THREE.Object3D, planetId: string } | null {
    let closestPlanet: THREE.Object3D | null = null;
    let closestDistance = Infinity;
    let closestPlanetId = '';
    
    this.planets.forEach((planet, planetId) => {
      const distanceToCamera = planet.position.distanceTo(this.camera.position);
      if (distanceToCamera < closestDistance) {
        closestDistance = distanceToCamera;
        closestPlanet = planet;
        closestPlanetId = planetId;
      }
    });
    
    return closestPlanet ? { planet: closestPlanet, planetId: closestPlanetId } : null;
  }

  private highlightPlanet(planet: THREE.Object3D, planetId: string): void {
    planet.userData.isHighlighted = true;
    
    // Create or show UI for this planet
    this.cosmicUI.createPlanetUI(planetId, planet);
    
    // Add visual highlight effect
    if (planet instanceof THREE.LOD) {
      planet.levels.forEach(level => {
        if (level.object instanceof THREE.Mesh) {
          const material = level.object.material as THREE.Material;
          material.emissive = new THREE.Color(0x222244);
        }
      });
    }
  }

  private unhighlightPlanet(planet: THREE.Object3D, planetId: string): void {
    planet.userData.isHighlighted = false;
    
    // Hide UI for this planet
    // Add visual unhighlight effect
    if (planet instanceof THREE.LOD) {
      planet.levels.forEach(level => {
        if (level.object instanceof THREE.Mesh) {
          const material = level.object.material as THREE.Material;
          material.emissive = new THREE.Color(0x000000);
        }
      });
    }
  }

  private highlightFocusedPlanet(focusedPlanet: { planet: THREE.Object3D, planetId: string }): void {
    // Add special focus effects for the currently focused planet
    const { planet, planetId } = focusedPlanet;
    
    if (this.specialPlanets.has(planetId)) {
      const specialPlanet = this.specialPlanets.get(planetId);
      if (specialPlanet instanceof Earth) {
        // Enhance Earth's atmosphere when focused
        specialPlanet.setAtmosphereIntensity(1.5);
      }
    }
  }

  private handlePerformanceUpdate(metrics: PerformanceMetrics): void {
    // Adjust quality based on performance
    if (!this.performanceMonitor.isPerformanceGood()) {
      this.adjustQualityForPerformance(metrics);
    }
  }

  private adjustQualityForPerformance(metrics: PerformanceMetrics): void {
    // Reduce quality if performance is poor
    if (metrics.fps < 30) {
      this.planets.forEach(planet => {
        if (planet instanceof THREE.LOD) {
          // Force lower LOD levels
          planet.levels.forEach(level => {
            level.distance *= 0.8; // Reduce distance thresholds
          });
        }
      });

      // Disable orbits if performance is very poor
      if (metrics.fps < 20 && this.showOrbits) {
        this.showOrbits = false;
        if (this.orbitRenderer) {
          this.orbitRenderer.setVisible(false);
        }
      }
    }
  }

  private setupResizeHandler(): void {
    const handleResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
  }

  private setupRenderer(): void {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    if (isMobile) {
      this.renderer.setPixelRatio(1);
    }
  }

  private setupCamera(): void {
    this.camera.position.set(0, 5, 15); // Move camera up and back
    this.camera.lookAt(0, 0, 0);
    this.camera.far = 1000; // Increase far plane
    this.camera.updateProjectionMatrix();
  }

  private setupLighting(): void {
    // Brighter directional light (the Sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(10, 10, 10);
    this.scene.add(sunLight);

    // More ambient light to see planets clearly
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Add a helper to visualize the sun position
    const sunHelper = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    sunHelper.position.copy(sunLight.position);
    this.scene.add(sunHelper);
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Starting planetary system initialization...');
      
      // Add a simple test object to verify rendering works
      const testGeometry = new THREE.BoxGeometry(1, 1, 1);
      const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const testCube = new THREE.Mesh(testGeometry, testMaterial);
      testCube.position.set(0, 0, 0);
      this.scene.add(testCube);
      console.log('Added test cube to scene');

      // Initialize each planet
      let planetCount = 0;
      for (const [planetId, config] of Object.entries(PLANETARY_CONFIG)) {
        console.log(`Initializing planet: ${planetId}`);
        await this.initializePlanet(planetId, config);
        planetCount++;
      }

      console.log(`Initialized ${planetCount} planets`);
      console.log('Scene children count:', this.scene.children.length);
      console.log('Camera position:', this.camera.position);
      console.log('Renderer size:', this.renderer.getSize(new THREE.Vector2()));

      this.isInitialized = true;
      this.startRenderLoop();
      
      console.log('Planetary System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize planetary system:', error);
      throw error;
    }
  }

  private async initializePlanet(planetId: string, config: any): Promise<void> {
    if (planetId === 'vetnav') {
      // Create special Earth implementation
      const earth = new Earth(config.radius);
      const earthGroup = earth.getGroup();
      
      // Create orbital elements
      const orbitalElements = OrbitalMechanics.createOrbitalElements(
        config.orbitalRadius * 5,
        0.02, // Small eccentricity for Earth
        0,    // No inclination for Earth
        config.orbitalPeriod / PHYSICS_CONFIG.timeScale,
        0     // Start at 0 degrees
      );

      this.planetOrbits.set(planetId, orbitalElements);

      // Calculate initial position
      const initialState = OrbitalMechanics.calculateOrbitalState(orbitalElements, 0);
      earthGroup.position.copy(initialState.position);
      earthGroup.userData = { planetId, config, orbitalElements, currentState: initialState };

      // Create orbit visualization
      if (this.showOrbits) {
        const color = parseInt(config.themeConfig.primaryColor.replace('#', '0x'));
        this.orbitRenderer.createOrbitPath(planetId, orbitalElements, color);
      }

      this.specialPlanets.set(planetId, earth);
      this.planets.set(planetId, earthGroup);
      this.scene.add(earthGroup);
      
      console.log(`Initialized special Earth planet at position:`, earthGroup.position);
    } else {
      // Use standard planet creation for other planets
      const planetLOD = this.lodManager.createPlanetLOD(config.radius, 4);
      
      const orbitalElements = OrbitalMechanics.createOrbitalElements(
        config.orbitalRadius * 5,
        0.05,
        Math.random() * 5,
        config.orbitalPeriod / PHYSICS_CONFIG.timeScale,
        Math.random() * 360
      );

      this.planetOrbits.set(planetId, orbitalElements);

      const initialState = OrbitalMechanics.calculateOrbitalState(orbitalElements, 0);
      planetLOD.position.copy(initialState.position);
      planetLOD.userData = { planetId, config, orbitalElements, currentState: initialState };

      if (this.showOrbits) {
        const color = parseInt(config.themeConfig.primaryColor.replace('#', '0x'));
        this.orbitRenderer.createOrbitPath(planetId, orbitalElements, color);
      }

      // Load textures for standard planets
      try {
        const textures = await this.textureManager.loadPlanetTextures(
          planetId,
          config.themeConfig.surfaceTextureUrl,
          config.themeConfig.normalMapUrl,
          config.themeConfig.nightTextureUrl
        );
        
        planetLOD.levels.forEach(level => {
          if (level.object instanceof THREE.Mesh && level.object.material instanceof THREE.MeshLambertMaterial) {
            level.object.material.map = textures.surface;
            level.object.material.needsUpdate = true;
          }
        });
      } catch (error) {
        console.warn(`Failed to load textures for ${planetId}:`, error);
      }
      
      this.planets.set(planetId, planetLOD);
      this.scene.add(planetLOD);
      
      console.log(`Initialized planet ${planetId} at position:`, planetLOD.position);
    }
  }

  private startRenderLoop(): void {
    const render = (time: number) => {
      this.performanceMonitor.startFrame(this.renderer);
      
      this.controls.update(); // Update controls
      this.updatePlanets(time);
      this.cosmicUI.update(); // Update UI positions
      this.renderer.render(this.scene, this.camera);
      
      this.performanceMonitor.endFrame(this.renderer);
      this.animationId = requestAnimationFrame(render);
    };
    
    this.animationId = requestAnimationFrame(render);
  }

  private updatePlanets(time: number): void {
    const currentTime = (time - this.startTime) * 0.001 * PHYSICS_CONFIG.timeScale;
    const sunDirection = new THREE.Vector3(1, 0, 0);

    this.planets.forEach((planet, planetId) => {
      const config = planet.userData.config;
      const orbitalElements = planet.userData.orbitalElements;

      if (orbitalElements) {
        const orbitalState = OrbitalMechanics.calculateOrbitalState(orbitalElements, currentTime);
        planet.position.copy(orbitalState.position);
        
        // Enhanced interaction states
        this.updatePlanetInteractionState(planet, planetId, time);
        
        if (this.specialPlanets.has(planetId)) {
          const specialPlanet = this.specialPlanets.get(planetId);
          if (planetId === 'vetnav' && specialPlanet instanceof Earth) {
            specialPlanet.update(time, sunDirection);
          }
        } else {
          const rotationSpeed = (2 * Math.PI) / (config.rotationPeriod * 3600);
          planet.rotation.y += rotationSpeed * (time * 0.001) * PHYSICS_CONFIG.timeScale;
        }
        
        planet.userData.currentState = orbitalState;
      }
    });
  }

  private updatePlanetInteractionState(planet: THREE.Object3D, planetId: string, time: number): void {
    // Add hover/focus states based on camera distance
    const distanceToCamera = planet.position.distanceTo(this.camera.position);
    const isNearby = distanceToCamera < 25;
    
    if (isNearby && !planet.userData.isHighlighted) {
      this.highlightPlanet(planet, planetId);
    } else if (!isNearby && planet.userData.isHighlighted) {
      this.unhighlightPlanet(planet, planetId);
    }
  }

  public getCurrentFPS(): number {
    return this.performanceMonitor.getMetrics().fps;
  }

  public getPlanet(planetId: string): THREE.Object3D | undefined {
    return this.planets.get(planetId);
  }

  public toggleOrbits(): void {
    this.showOrbits = !this.showOrbits;
    this.orbitRenderer.toggleAllOrbits(this.showOrbits);
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.orbitRenderer.dispose();
    this.cosmicUI.dispose();
    this.controls.dispose();
    
    // Dispose special planets
    this.specialPlanets.forEach(planet => {
      if (planet.dispose) {
        planet.dispose();
      }
    });
    
    this.planets.forEach(planet => {
      if (planet instanceof THREE.LOD) {
        planet.levels.forEach(level => {
          if (level.object instanceof THREE.Mesh) {
            level.object.geometry.dispose();
            if (level.object.material instanceof THREE.Material) {
              level.object.material.dispose();
            }
          }
        });
      }
    });
    
    this.renderer.dispose();
  }

  public getSpecialPlanet(planetId: string): any {
    return this.specialPlanets.get(planetId);
  }
} 