import { useState, useEffect } from 'react';
import { Benefit } from '../types/benefits';
import { federalBenefits } from '../data/federalBenefits';
import { stateBenefits } from '../data/stateBenefits';

export interface UseBenefitsReturn {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  filterByCategory: (category: string) => void;
  clearFilter: () => void;
  activeFilter: string | null;
}

export const useBenefits = (stateCode?: string): UseBenefitsReturn => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (stateCode) {
      loadBenefitsForState(stateCode);
    }
  }, [stateCode]);

  const loadBenefitsForState = async (state: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get top federal benefits
      const topFederal = federalBenefits.slice(0, 6);
      
      // Get state-specific benefits
      const stateSpecific = stateBenefits.filter(benefit => 
        benefit.state === state
      );

      const allBenefits = [...topFederal, ...stateSpecific].sort((a, b) => { // Added sorting from previous step for consistency
        const categoryPriority = {
          'disability': 1,
          'healthcare': 2,
          'education': 3,
          'housing': 4,
          'employment': 5,
          'business': 6,
          'family': 7,
          'burial': 8
        } as Record<string, number>; 
        return categoryPriority[a.category] - categoryPriority[b.category];
      });
      setBenefits(allBenefits);
      setFilteredBenefits(allBenefits);
    } catch (err) {
      setError('Failed to load benefits');
      setBenefits([]);
      setFilteredBenefits([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category: string) => {
    setActiveFilter(category);
    const filtered = benefits.filter(benefit => benefit.category === category);
    setFilteredBenefits(filtered);
  };

  const clearFilter = () => {
    setActiveFilter(null);
    setFilteredBenefits(benefits);
  };

  return {
    benefits: filteredBenefits,
    loading,
    error,
    filterByCategory,
    clearFilter,
    activeFilter
  };
}; 