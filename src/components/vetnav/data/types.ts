// src/data/types.ts

/**
 * Definition for a single veteran benefit,
 * aligning with benefitsMasterList.json and validation script.
 */
export interface VeteranBenefit {
  id: string;                            // MUST HAVE
  title: string;                         // WAS 'benefitName', MUST BE 'title'
  level: 'federal' | 'state' | 'local' | 'private';
  state: string | null;
  category: string;                      // Or your specific enum if JSON matches
  description: string;
  eligibility: string[];                 // WAS 'string', MUST BE 'string[]' (an array)
  application: {                         // WAS 'string', MUST BE an object
    url: string;
    instructions?: string;
  };
  source: string;
  tags: string[];
  priority: 'critical' | 'high' | 'medium' | 'low'; // MUST HAVE
  underutilized?: boolean;               // Optional is fine
  underutilizedReason?: string | null;   // Optional is fine
}

/**
 * Filter options for benefits
 */
export interface BenefitFilters {
  category?: string;
  state?: string;
  level?: 'federal' | 'state' | 'local' | 'private' | 'all'; // Adjusted level
  underutilized?: boolean;
  tags?: string[];
  keyword?: string;
}

/**
 * User profile to store veteran information for matching
 */
export interface VeteranProfile {
  hasServiceConnectedDisability?: boolean;
  disabilityRating?: number;
  servedAfter911?: boolean;
  isWarTimeVeteran?: boolean;
  activeState?: string;
  isLowIncome?: boolean;
  honorableDischarge?: boolean;
  eligibleForMedicaid?: boolean;
  age?: number;
  branch?: 'army' | 'navy' | 'airforce' | 'marines' | 'coastguard' | 'spaceforce' | 'national_guard' | 'reserves'; // Corrected 'spacepforce'
  yearsOfService?: number;
}