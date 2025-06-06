import { v4 as uuidv4 } from 'uuid';

interface Benefit {
  id: string;
  name: string;
  state: string;
}

interface StateBenefitStats {
  [stateCode: string]: {
    count: number;
    federalCount: number;
    stateCount: number;
  };
}

class BenefitsMapService {
  private benefitsData: Benefit[] = [];
  private stateStats: StateBenefitStats = {};
  private dataLoaded: boolean = false;

  constructor() {
    this.loadBenefitsData();
  }

  private getDeterministicRandom = (id: string | null) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  private async loadBenefitsData() {
    try {
      const baseUrl = typeof window === 'undefined' ? `http://localhost:${process.env.PORT || 3000}` : '';
      const dataUrl = `${baseUrl}/data/vetnavBenefitsDatabase.json`;
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const rawData = await response.json();
      if (Array.isArray(rawData)) {
        this.benefitsData = rawData;
      } else if (typeof rawData === 'object' && rawData !== null) {
        const arrayKey = Object.keys(rawData).find(key => Array.isArray(rawData[key]));
        this.benefitsData = arrayKey ? rawData[arrayKey] : [];
      }
      this.calculateStateStats();
      this.dataLoaded = true;
      console.log(`Benefits data loaded with ${this.benefitsData.length} items.`);
    } catch (error) {
      console.error("Failed to load or process benefits data:", error);
    }
  }

  private calculateStateStats() {
    const stats: StateBenefitStats = {};
    this.benefitsData.forEach(benefit => {
      const state = benefit.state || 'Federal';
      if (!stats[state]) {
        stats[state] = { count: 0, federalCount: 0, stateCount: 0 };
      }
      stats[state].count++;
      if (state === 'Federal') {
        stats[state].federalCount++;
      } else {
        stats[state].stateCount++;
      }
    });
    this.stateStats = stats;
  }
  
  public getStateStats = (stateCode: string | null) => {
    const defaultStats = { count: 0, federalCount: 0, stateCount: 0 };
    if (!this.dataLoaded || !stateCode) {
      return defaultStats;
    }
    return this.stateStats[stateCode] || defaultStats;
  }

  public getStateElevation = (feature: any) => {
    const stateCode = feature?.properties?.iso_3166_2;
    const stats = this.getStateStats(stateCode);
    return stats.count * 1000;
  }

  public getStateColor = (feature: any) => {
    const stateId = feature?.properties?.iso_3166_2;
    const defaultColor = [25, 25, 50, 200];
    if (!stateId) return defaultColor;

    // Cosmic color palette
    const colors = [
      [30, 80, 180],   // Deep Blue
      [50, 40, 160],   // Purple
      [20, 100, 150],  // Teal
      [40, 60, 170]    // Indigo
    ];
    
    const randomIndex = this.getDeterministicRandom(stateId) % colors.length;
    const baseColor = colors[randomIndex];
    
    // Add a subtle glow for states with data
    const stats = this.getStateStats(stateId);
    const brightness = stats.count > 0 ? 1.3 : 1.0;
    
    return [baseColor[0] * brightness, baseColor[1] * brightness, baseColor[2] * brightness, 220];
  }
  
  public getStateBenefitsData = (stateCode: string | null) => {
    if (!stateCode) return [];
    return this.benefitsData.filter(benefit => benefit.state === stateCode);
  }
}

export const benefitsMapService = new BenefitsMapService();
