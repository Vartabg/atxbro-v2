export interface Benefit {
  id: string;
  title: string;
  description: string;
  category: BenefitCategory;
  level: 'federal' | 'state';
  eligibilityRequirements: string[];
  applicationUrl: string;
  estimatedValue?: string;
  state?: string; // Only for state-level benefits
  tags: string[];
  lastUpdated: string;
}

export type BenefitCategory = 
  | 'disability'
  | 'healthcare' 
  | 'education'
  | 'housing'
  | 'employment'
  | 'business'
  | 'family'
  | 'burial';

export interface UserProfile {
  serviceDetails: {
    branch: 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Space Force' | 'Coast Guard';
    serviceEra: 'post911' | 'gulf' | 'vietnam' | 'peacetime';
    disabilityRating?: number;
    separationDate?: Date;
    isActive: boolean;
  };
  location: {
    currentState: string;
    intendedState?: string;
    zipCode: string;
  };
  interests: {
    education: boolean;
    employment: boolean;
    business: boolean;
    healthcare: boolean;
    housing: boolean;
  };
}

export interface TransitionProgram {
  id: string;
  name: string;
  description: string;
  type: 'fellowship' | 'training' | 'job-fair' | 'mentorship' | 'apprenticeship';
  duration: string;
  applicationUrl: string;
  eligibilityRequirements: string[];
  locations: string[];
  applicationDeadline?: string;
}

export interface TransitionMilestone {
  id: string;
  title: string;
  description: string;
  timeBeforeSeparation: number; // days
  isRequired: boolean;
  actionItems: string[];
  resources: string[];
} 