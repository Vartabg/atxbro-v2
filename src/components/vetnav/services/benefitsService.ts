// src/data/services/benefitsService.ts

import benefitsData from '../benefitsMasterList.json';
import { VeteranBenefit, BenefitFilters } from '../types';

const typedBenefits: VeteranBenefit[] = benefitsData as VeteranBenefit[];

export const filterBenefits = (filters: BenefitFilters = {}): VeteranBenefit[] => {
  let filteredBenefits = [...typedBenefits];
  if (filters.category && filters.category !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.category === filters.category
    );
  }
  
  if (filters.state && filters.state !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => (filters.state === 'federal' && benefit.level === 'federal') || 
                benefit.state === filters.state
    );
  }

  if (filters.level && filters.level !== 'all') {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.level === filters.level
    );
  }

  if (filters.underutilized !== undefined) {
    filteredBenefits = filteredBenefits.filter(
      benefit => benefit.underutilized === filters.underutilized
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredBenefits = filteredBenefits.filter(benefit => 
      filters.tags!.some(tag => benefit.tags.includes(tag))
    );
  }
  
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filteredBenefits = filteredBenefits.filter(benefit => 
      benefit.title.toLowerCase().includes(keyword) ||
      benefit.description.toLowerCase().includes(keyword)
    );
  }
  return filteredBenefits;
};

export const getBenefitById = (id: string): VeteranBenefit | undefined => {
  return typedBenefits.find(benefit => benefit.id === id);
};

export const getAllBenefits = (): VeteranBenefit[] => {
  return typedBenefits;
};

export const getAllCategories = (): string[] => {
  const categories = new Set(typedBenefits.map(benefit => benefit.category as string));
  return Array.from(categories).sort();
};

export const getAllStates = (): string[] => {
  const states = new Set(
    typedBenefits
      .filter(benefit => benefit.state !== null && benefit.state !== undefined)
      .map(benefit => benefit.state as string)
  );
  return Array.from(states).sort();
};

export const getAllTags = (): string[] => {
  const tagsSet = new Set<string>();
  typedBenefits.forEach(benefit => {
    if (Array.isArray(benefit.tags)) {
      benefit.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

export const getFederalBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'federal');
};

export const getStateBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.level === 'state');
};

export const getUnderutilizedBenefits = (): VeteranBenefit[] => {
  return typedBenefits.filter(benefit => benefit.underutilized === true);
};

// Re-add the default export for backward compatibility
const benefitsServiceApi = {
  filterBenefits,
  getBenefitById,
  getAllBenefits,
  getAllCategories,
  getAllStates,
  getAllTags,
  getFederalBenefits,
  getStateBenefits,
  getUnderutilizedBenefits
};

export default benefitsServiceApi;
