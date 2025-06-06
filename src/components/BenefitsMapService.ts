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

// FIPS code to State Abbreviation mapping
const fipsToAbbr = { '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY', '60': 'AS', '66': 'GU', '69': 'MP', '72': 'PR', '78': 'VI' };

class BenefitsMapService {
  private benefitsData: Benefit[] = [];
  private stateStats: StateBenefitStats = {};

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

  public getStateStats = (fipsCode: string | null) => {
    const defaultStats = { count: 0, federalCount: 0, stateCount: 0 };
    if (!fipsCode) return defaultStats;
    const stateAbbr = fipsToAbbr[fipsCode];
    return this.stateStats[stateAbbr] || defaultStats;
  }

  public getStateElevation = (feature: any) => {
    const fipsCode = feature?.properties?.id;
    const stats = this.getStateStats(fipsCode);
    return stats.count * 1000;
  }

  public getStateColor = (feature: any) => {
    const fipsCode = feature?.properties?.id;
    const stateAbbr = fipsToAbbr[fipsCode];
    const defaultColor = [25, 25, 50, 200];
    if (!stateAbbr) return defaultColor;

    const colors = [[30, 80, 180], [50, 40, 160], [20, 100, 150], [40, 60, 170]];
    const hash = Array.from(stateAbbr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseColor = colors[hash % colors.length];
    
    const stats = this.getStateStats(fipsCode);
    const brightness = stats.count > 0 ? 1.3 : 1.0;
    
    return [baseColor[0] * brightness, baseColor[1] * brightness, baseColor[2] * brightness, 220];
  }
}

export const benefitsMapService = new BenefitsMapService();
