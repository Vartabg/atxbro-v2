export interface Benefit {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  state?: string;
  eligibility: string[];
  description: string;
  amount?: string;
  processingTime?: string;
  link: string;
  priority: string;
  targetAudience: string[];
}

export const benefitsData: Benefit[] = [
  {
    id: 'post-911-gi-bill',
    name: 'Post-9/11 GI Bill',
    category: 'Education',
    jurisdiction: 'Federal',
    eligibility: ['Post-9/11 Veterans', 'Active Duty with 90+ days service'],
    description: 'Comprehensive education benefits covering tuition, housing, and books',
    amount: 'Up to full tuition + Monthly Housing Allowance + $1,000 books stipend',
    processingTime: '30 days',
    link: 'https://va.gov/education/about-gi-bill-benefits/post-9-11/',
    priority: 'High',
    targetAudience: ['All Veterans']
  },
  {
    id: 'disability-compensation',
    name: 'VA Disability Compensation',
    category: 'Disability',
    jurisdiction: 'Federal',
    eligibility: ['Veterans with service-connected disabilities'],
    description: 'Monthly tax-free payment for veterans with service-connected disabilities',
    amount: '$165 - $3,737+ per month',
    processingTime: '131-141 days',
    link: 'https://va.gov/disability/',
    priority: 'High',
    targetAudience: ['Disabled Veterans']
  },
  {
    id: 'va-healthcare',
    name: 'VA Health Care',
    category: 'Healthcare',
    jurisdiction: 'Federal',
    eligibility: ['Honorably discharged veterans'],
    description: 'Comprehensive healthcare services including preventive, primary, and specialty care',
    processingTime: '30-60 days',
    link: 'https://va.gov/health-care/',
    priority: 'High',
    targetAudience: ['All Veterans']
  }
];
