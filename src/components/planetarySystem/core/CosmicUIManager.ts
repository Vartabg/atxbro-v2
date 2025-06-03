import * as THREE from 'three';
import { PLANETARY_CONFIG } from './PlanetaryConfig';

export interface CosmicUIElement {
  id: string;
  position: THREE.Vector3;
  element: HTMLElement;
  planetId: string;
  isVisible: boolean;
}

export class CosmicUIManager {
  private uiElements = new Map<string, CosmicUIElement>();
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(camera: THREE.PerspectiveCamera, container: HTMLElement) {
    this.camera = camera;
    this.container = container;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('click', this.onClick.bind(this));
  }

  public createPlanetUI(planetId: string, planet: THREE.Object3D): void {
    const config = PLANETARY_CONFIG[planetId];
    if (!config) return;

    // Create holographic info panel
    const uiElement = this.createHolographicPanel(config);
    
    const cosmicUI: CosmicUIElement = {
      id: `ui-${planetId}`,
      position: planet.position.clone(),
      element: uiElement,
      planetId,
      isVisible: false
    };

    this.uiElements.set(planetId, cosmicUI);
    this.container.appendChild(uiElement);
  }

  private createHolographicPanel(config: any): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'cosmic-ui-panel';
    panel.innerHTML = `
      <div class="hologram-border">
        <div class="planet-info">
          <h3 class="planet-name">${config.name}</h3>
          <div class="orbital-data">
            <span class="data-point">Orbital Period: ${config.orbitalPeriod} days</span>
            <span class="data-point">Radius: ${config.radius}x Earth</span>
          </div>
          <button class="navigation-btn" data-route="${config.appRoute}">
            NAVIGATE TO ${config.name.toUpperCase()}
          </button>
        </div>
      </div>
    `;

    // Apply cosmic styling
    Object.assign(panel.style, {
      position: 'absolute',
      background: 'linear-gradient(135deg, rgba(0,100,255,0.1), rgba(100,0,255,0.1))',
      border: `2px solid ${config.themeConfig.primaryColor}`,
      borderRadius: '12px',
      padding: '20px',
      color: '#ffffff',
      fontFamily: 'Orbitron, monospace',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 0 30px ${config.themeConfig.primaryColor}50`,
      transform: 'translate(-50%, -50%)',
      opacity: '0',
      transition: 'all 0.3s ease',
      pointerEvents: 'none'
    });

    return panel;
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
  }

  private onClick(event: MouseEvent): void {
    // Handle click interactions
    this.uiElements.forEach((uiElement) => {
      if (uiElement.isVisible) {
        const rect = uiElement.element.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
          const navButton = uiElement.element.querySelector('.navigation-btn');
          if (navButton) {
            const route = navButton.getAttribute('data-route');
            if (route) {
              window.location.href = route;
            }
          }
        }
      }
    });
  }

  public update(): void {
    this.uiElements.forEach((uiElement) => {
      this.updateUIElementPosition(uiElement);
    });
  }

  private updateUIElementPosition(uiElement: CosmicUIElement): void {
    const screenPosition = this.worldToScreen(uiElement.position);
    
    if (screenPosition) {
      uiElement.element.style.left = `${screenPosition.x}px`;
      uiElement.element.style.top = `${screenPosition.y}px`;
    }
  }

  private worldToScreen(position: THREE.Vector3): { x: number; y: number } | null {
    const vector = position.clone().project(this.camera);
    
    const x = (vector.x * 0.5 + 0.5) * this.container.clientWidth;
    const y = (vector.y * -0.5 + 0.5) * this.container.clientHeight;
    
    return { x, y };
  }

  public dispose(): void {
    this.container.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.removeEventListener('click', this.onClick.bind(this));
    this.uiElements.forEach((uiElement) => {
      this.container.removeChild(uiElement.element);
    });
    this.uiElements.clear();
  }
} 