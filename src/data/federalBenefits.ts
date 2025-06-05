import { Benefit } from '../types/benefits';

export const federalBenefits: Benefit[] = [
  // DISABILITY COMPENSATION
  {
    id: 'va-disability-compensation',
    title: 'VA Disability Compensation',
    description: 'Tax-free monthly payments for veterans with service-connected injuries or illnesses.',
    category: 'disability',
    level: 'federal',
    eligibilityRequirements: [
      'Service-connected injury or illness',
      'Honorable discharge or general discharge under honorable conditions',
      'Current illness/injury linked to military service'
    ],
    applicationUrl: 'https://www.va.gov/disability/how-to-file-claim/',
    estimatedValue: '$165-$3,737/month',
    tags: ['monthly-payment', 'tax-free', 'service-connected'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'va-tdiu',
    title: 'Total Disability Individual Unemployability (TDIU)',
    description: 'Compensation at 100% rate for veterans unable to work due to service-connected disabilities.',
    category: 'disability',
    level: 'federal',
    eligibilityRequirements: [
      'Unable to secure/maintain substantial gainful employment',
      'One service-connected disability at 60% or higher',
      'OR multiple disabilities with one at 40% and combined rating of 70%'
    ],
    applicationUrl: 'https://www.va.gov/disability/eligibility/special-claims/unemployability/',
    estimatedValue: '$3,737/month',
    tags: ['unemployability', '100-percent-rate', 'work-disability'],
    lastUpdated: '2024-12-01'
  },

  // HEALTHCARE
  {
    id: 'va-healthcare',
    title: 'VA Health Care',
    description: 'Comprehensive healthcare services including preventive, primary, and specialty care.',
    category: 'healthcare',
    level: 'federal',
    eligibilityRequirements: [
      'Served in active military service',
      'Discharged under conditions other than dishonorable',
      'Meet minimum service requirements (varies by era)'
    ],
    applicationUrl: 'https://www.va.gov/health-care/apply/',
    estimatedValue: 'Free to low-cost care',
    tags: ['comprehensive-care', 'preventive', 'mental-health'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'champva',
    title: 'CHAMPVA',
    description: 'Health insurance for dependents of permanently disabled or deceased veterans.',
    category: 'healthcare',
    level: 'federal',
    eligibilityRequirements: [
      'Spouse/child of veteran with 100% permanent service-connected disability',
      'OR spouse/child of veteran who died from service-connected condition',
      'Not eligible for TRICARE'
    ],
    applicationUrl: 'https://www.va.gov/health-care/family-caregiver-benefits/champva/',
    estimatedValue: 'Covers 75% of costs',
    tags: ['family-coverage', 'dependents', 'health-insurance'],
    lastUpdated: '2024-12-01'
  },

  // EDUCATION
  {
    id: 'post911-gi-bill',
    title: 'Post-9/11 GI Bill',
    description: 'Education benefits covering tuition, housing allowance, and books for qualifying veterans.',
    category: 'education',
    level: 'federal',
    eligibilityRequirements: [
      'Served at least 90 days on active duty after September 10, 2001',
      'Honorable discharge',
      'Currently enrolled or accepted at approved institution'
    ],
    applicationUrl: 'https://www.va.gov/education/how-to-apply/',
    estimatedValue: 'Up to full tuition + housing allowance',
    tags: ['tuition-coverage', 'housing-allowance', 'post-911'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'vr-e-chapter31',
    title: 'Veteran Readiness & Employment (VR&E)',
    description: 'Vocational rehabilitation and employment assistance for veterans with service-connected disabilities.',
    category: 'education',
    level: 'federal',
    eligibilityRequirements: [
      'Service-connected disability rating of 20% or higher',
      'Honorable discharge',
      'Need vocational rehabilitation to overcome employment barrier'
    ],
    applicationUrl: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    estimatedValue: 'Full tuition + monthly stipend',
    tags: ['vocational-rehab', 'employment-assistance', 'disability-required'],
    lastUpdated: '2024-12-01'
  },

  // HOUSING
  {
    id: 'va-home-loan',
    title: 'VA Home Loan Guaranty',
    description: 'Home mortgages with no down payment and favorable terms for eligible veterans.',
    category: 'housing',
    level: 'federal',
    eligibilityRequirements: [
      'Served minimum active duty requirements',
      'Honorable discharge or still serving',
      'Meet credit and income requirements',
      'Property must be primary residence'
    ],
    applicationUrl: 'https://www.va.gov/housing-assistance/home-loans/',
    estimatedValue: 'No down payment required',
    tags: ['no-down-payment', 'favorable-terms', 'home-purchase'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'sah-grant',
    title: 'Specially Adapted Housing (SAH) Grant',
    description: 'Grants to help veterans with certain permanent disabilities adapt or purchase homes.',
    category: 'housing',
    level: 'federal',
    eligibilityRequirements: [
      'Permanent and total service-connected disability',
      'Loss of use of both lower extremities',
      'OR blindness in both eyes with loss of use of one lower extremity',
      'OR loss of use of one lower extremity together with other qualifying conditions'
    ],
    applicationUrl: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    estimatedValue: 'Up to $101,754',
    tags: ['home-adaptation', 'disability-grant', 'accessibility'],
    lastUpdated: '2024-12-01'
  },

  // EMPLOYMENT
  {
    id: 'federal-hiring-preference',
    title: 'Veterans\' Preference in Federal Hiring',
    description: 'Hiring preference for veterans in federal government positions.',
    category: 'employment',
    level: 'federal',
    eligibilityRequirements: [
      'Honorable or general discharge',
      'Served during wartime, campaign, or expedition',
      'OR have service-connected disability',
      'OR received Purple Heart'
    ],
    applicationUrl: 'https://www.usajobs.gov/help/working-in-government/unique-hiring-paths/veterans/',
    estimatedValue: '5-10 point preference in hiring',
    tags: ['federal-jobs', 'hiring-preference', 'government-employment'],
    lastUpdated: '2024-12-01'
  },

  // BUSINESS
  {
    id: 'sba-veteran-programs',
    title: 'SBA Veteran Business Programs',
    description: 'Small business support including loan guarantees, contracting opportunities, and training.',
    category: 'business',
    level: 'federal',
    eligibilityRequirements: [
      'Honorably discharged veteran',
      'OR service-disabled veteran',
      'Meet SBA small business size standards',
      'Own and control business operations'
    ],
    applicationUrl: 'https://www.sba.gov/funding-programs/loans/special-loans/veteran-loans',
    estimatedValue: 'Loan guarantees + fee waivers',
    tags: ['small-business', 'loan-guarantees', 'contracting-opportunities'],
    lastUpdated: '2024-12-01'
  }
]; 