import { VeteranBenefit } from './data/types';
import benefitsData from './data/benefitsMasterList.json';

export interface StateBenefitsData {
  stateName: string;
  federalBenefits: number;
  stateBenefits: number;
  totalBenefits: number;
  benefitsDensity: number; // 0-1 for visualization
  veteranPopulation?: number; // Mock data for now
}

export class BenefitsMapService {
  private benefits: VeteranBenefit[] = benefitsData as VeteranBenefit[];

  // Get benefits data for map visualization
  getStateBenefitsData(): Map<string, StateBenefitsData> {
    const stateData = new Map<string, StateBenefitsData>();
    
    // US States list
    const states = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    states.forEach(stateName => {
      const federalBenefits = this.benefits.filter(b => b.level === 'federal').length;
      const stateBenefits = this.benefits.filter(b => b.state === stateName).length;
      const totalBenefits = federalBenefits + stateBenefits;
      
      // Mock veteran population and benefits density for visualization
      const veteranPopulation = Math.floor(Math.random() * 500000) + 50000;
      const benefitsDensity = Math.min(1, totalBenefits / 50); // Normalize to 0-1
      
      stateData.set(stateName, {
        stateName,
        federalBenefits,
        stateBenefits,
        totalBenefits,
        benefitsDensity,
        veteranPopulation
      });
    });

    return stateData;
  }

  // Get benefits for a specific state
  getStateBenefits(stateName: string): VeteranBenefit[] {
    return this.benefits.filter(benefit => 
      benefit.level === 'federal' || benefit.state === stateName
    );
  }

  // Get high-priority underutilized benefits
  getUnderutilizedBenefits(): VeteranBenefit[] {
    return this.benefits.filter(benefit => 
      benefit.underutilized && benefit.priority === 'high'
    );
  }

  // Get visualization colors for map
  getStateColor(stateName: string): [number, number, number, number] {
    const stateData = this.getStateBenefitsData().get(stateName);
    if (!stateData) return [100, 100, 100, 160]; // Gray fallback
    
    const density = stateData.benefitsDensity;
    
    // Color gradient: Red (low benefits) → Yellow → Green (high benefits)
    if (density < 0.3) {
      // Red to Yellow
      const r = 255;
      const g = Math.floor(255 * (density / 0.3));
      const b = 0;
      return [r, g, b, 180];
    } else {
      // Yellow to Green
      const r = Math.floor(255 * (1 - ((density - 0.3) / 0.7)));
      const g = 255;
      const b = 0;
      return [r, g, b, 180];
    }
  }

  // Get elevation for 3D visualization
  getStateElevation(stateName: string): number {
    const stateData = this.getStateBenefitsData().get(stateName);
    if (!stateData) return 1000;
    
    // Height based on veteran population
    return (stateData.veteranPopulation! / 500000) * 3000 + 1000;
  }
}

export const benefitsMapService = new BenefitsMapService();
