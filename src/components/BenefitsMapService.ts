import { v4 as uuidv4 } from 'uuid';

interface Benefit { id: string; name: string; state: string; }
interface StateBenefitStats { [stateCode: string]: { count: number; federalCount: number; stateCount: number; }; }

const fipsToAbbr = { '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI', '56': 'WY' };

class BenefitsMapService {
  private benefitsData: Benefit[] = [];
  private stateStats: StateBenefitStats = {};

  constructor() { this.loadBenefitsData(); }

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
    } catch (error) {
      console.error("Failed to load benefits data:", error);
    }
  }

  private calculateStateStats() {
    this.benefitsData.forEach(benefit => {
      const state = benefit.state || 'Federal';
      if (!this.stateStats[state]) {
        this.stateStats[state] = { count: 0, federalCount: 0, stateCount: 0 };
      }
      this.stateStats[state].count++;
    });
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
    return stats.count > 0 ? stats.count * 15000 : 1000;
  }

  // Restoring the "greenish" color scheme based on benefit count
  public getStateColor = (feature: any) => {
    const fipsCode = feature?.properties?.id;
    const stats = this.getStateStats(fipsCode);
    const benefitCount = stats.count;

    if (benefitCount > 10) return [46, 125, 50, 200]; // Rich Green
    if (benefitCount > 5) return [70, 130, 180, 200]; // Teal
    if (benefitCount > 0) return [156, 39, 176, 200]; // Purple
    return [80, 80, 90, 180]; // Default dark grey/blue
  }
}

export const benefitsMapService = new BenefitsMapService();
