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
      this.benefitsData = await response.json();
      this.calculateStateStats();
      console.log('Benefits data loaded and processed successfully.');
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
    const stateCode = feature.properties.iso_3166_2;
    const stats = this.stateStats[stateCode];
    return stats ? stats.count * 1000 : 0; // Elevation based on total benefits
  }

  public getStateColor = (feature: any): [number, number, number, number] => {
    const stateCode = feature.properties.iso_3166_2;
    const stats = this.stateStats[stateCode];
    if (!stats) {
      return [80, 80, 80, 200]; // Default grey for states with no data
    }
    const ratio = stats.stateCount / (stats.count || 1);
    const red = 255 * (1 - ratio);
    const green = 255 * ratio;
    return [red, green, 50, 210]; // Color gradient from red (mostly federal) to green (mostly state)
  }
}

export const benefitsMapService = new BenefitsMapService();
