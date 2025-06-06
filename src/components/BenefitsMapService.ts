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
    // This is now more resilient and will never return a null/falsy value.
    const defaultStats = { count: 0, federalCount: 0, stateCount: 0 };
    if (!this.dataLoaded || !stateCode) {
      return defaultStats;
    }
    return this.stateStats[stateCode] || defaultStats;
  }

  // Other functions remain the same
  public getStateElevation = (feature: any) => {
    const stateCode = feature?.properties?.iso_3166_2;
    const stats = this.getStateStats(stateCode);
    return stats.count * 1000;
  }
  public getStateColor = (feature: any) => {
    const stateCode = feature?.properties?.iso_3166_2;
    const stats = this.getStateStats(stateCode);
    if (!stats || stats.count === 0) return [80, 80, 80, 200];
    const ratio = stats.stateCount / stats.count;
    return [255 * (1 - ratio), 255 * ratio, 50, 210];
  }
  public getStateBenefitsData = (stateCode: string | null) => {
    if (!stateCode) return [];
    return this.benefitsData.filter(benefit => benefit.state === stateCode);
  }
}

export const benefitsMapService = new BenefitsMapService();
