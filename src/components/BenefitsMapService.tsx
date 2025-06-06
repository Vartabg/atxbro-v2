export const benefitsMapService = {
  getStateElevation: (stateId: string) => {
    const elevations: Record<string, number> = {
      'TX': 30000,
      'CA': 25000,
      'FL': 20000,
      'NY': 15000
    };
    return elevations[stateId] || 10000;
  },
  
  getStateColor: (stateId: string) => {
    const colors: Record<string, [number, number, number, number]> = {
      'TX': [255, 100, 100, 200],
      'CA': [100, 255, 100, 200],
      'FL': [100, 100, 255, 200],
      'NY': [255, 255, 100, 200]
    };
    return colors[stateId] || [150, 150, 150, 200];
  },
  
  getStateStats: (stateId: string) => {
    const stats: Record<string, any> = {
      'TX': { totalBenefits: 45, averageProcessingTime: '30 days' },
      'CA': { totalBenefits: 52, averageProcessingTime: '25 days' },
      'FL': { totalBenefits: 38, averageProcessingTime: '35 days' },
      'NY': { totalBenefits: 41, averageProcessingTime: '28 days' }
    };
    return stats[stateId] || { totalBenefits: 20, averageProcessingTime: '40 days' };
  }
};
