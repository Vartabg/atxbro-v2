import { v4 as uuidv4 } from 'uuid';

interface Benefit {
  id: string;
  name: string;
  state: string;
  // ... other benefit properties
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

  constructor() {
    this.loadBenefitsData();
  }

  private async loadBenefitsData() {
    try {
      const response = await fetch('/data/vetnavBenefitsDatabase.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      // Intelligently find the array within the loaded data
      if (Array.isArray(rawData)) {
        this.benefitsData = rawData;
      } else if (typeof rawData === 'object' && rawData !== null) {
        // Find the first property that is an array and use it
        const arrayKey = Object.keys(rawData).find(key => Array.isArray(rawData[key]));
        this.benefitsData = arrayKey ? rawData[arrayKey] : [];
      } else {
        this.benefitsData = [];
      }

      if (this.benefitsData.length === 0) {
        console.warn("Warning: Benefits data array is empty or could not be found in the JSON structure.");
      }

      this.calculateStateStats();
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

  public getStateElevation = (feature: any): number => {
    // Defensive coding: ensure feature and properties exist
    const stateCode = feature?.properties?.iso_3166_2;
    if (!stateCode) return 0;
    
    const stats = this.stateStats[stateCode];
    return stats ? stats.count * 1000 : 0;
  }

  public getStateColor = (feature: any): [number, number, number, number] => {
    const stateCode = feature?.properties?.iso_3166_2;
    if (!stateCode) {
        return [80, 80, 80, 200]; // Default grey
    }

    const stats = this.stateStats[stateCode];
    if (!stats || stats.count === 0) {
      return [80, 80, 80, 200];
    }
    
    const ratio = stats.stateCount / stats.count;
    const red = 255 * (1 - ratio);
    const green = 255 * ratio;
    return [red, green, 50, 210];
  }
}

export const benefitsMapService = new BenefitsMapService();
