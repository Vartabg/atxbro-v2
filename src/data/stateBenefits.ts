import { Benefit } from '../types/benefits';

export const stateBenefits: Benefit[] = [
  // TEXAS BENEFITS
  {
    id: 'tx-property-tax-exemption',
    title: 'Texas Property Tax Exemption',
    description: '100% property tax exemption on homestead for veterans with 100% disability rating.',
    category: 'housing',
    level: 'state',
    state: 'TX',
    eligibilityRequirements: [
      '100% disability rating from VA',
      'Honorable discharge',
      'Texas resident',
      'Property must be homestead'
    ],
    applicationUrl: 'https://comptroller.texas.gov/taxes/property-tax/exemptions/disabled-veterans.php',
    estimatedValue: 'Average $3,000-$15,000/year savings',
    tags: ['property-tax', 'homestead', '100-percent-disability', 'texas'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'tx-hazlewood-act',
    title: 'Texas Hazlewood Act',
    description: 'Up to 150 credit hours of free tuition at Texas public universities and colleges.',
    category: 'education',
    level: 'state',
    state: 'TX',
    eligibilityRequirements: [
      'Honorable discharge',
      'Texas resident for tuition purposes',
      'Served at least 181 days active duty',
      'Exhausted federal education benefits OR choose not to use them'
    ],
    applicationUrl: 'https://www.tvc.texas.gov/education/hazlewood-act/',
    estimatedValue: 'Up to $60,000 in tuition',
    tags: ['free-tuition', 'texas-universities', 'transferable', 'hazlewood'],
    lastUpdated: '2024-12-01'
  },

  // CALIFORNIA BENEFITS
  {
    id: 'ca-college-fee-waiver',
    title: 'California College Fee Waiver (CalVet)',
    description: 'Fee waiver for dependents of veterans who are 100% disabled or died from service-connected causes.',
    category: 'education',
    level: 'state',
    state: 'CA',
    eligibilityRequirements: [
      'Dependent of veteran with 100% service-connected disability',
      'OR dependent of veteran who died from service-connected cause',
      'California resident',
      'Enrolled at UC, CSU, or community college'
    ],
    applicationUrl: 'https://www.calvet.ca.gov/VetServices/Pages/College-Fee-Waiver.aspx',
    estimatedValue: 'Full tuition waiver',
    tags: ['dependent-benefits', 'tuition-waiver', 'california', 'calvet'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'ca-property-tax-exemption',
    title: 'California Disabled Veterans Property Tax Exemption',
    description: 'Property tax exemption for disabled veterans based on disability rating.',
    category: 'housing',
    level: 'state',
    state: 'CA',
    eligibilityRequirements: [
      'Service-connected disability',
      'Honorable discharge',
      'California resident',
      'Own and occupy property as primary residence'
    ],
    applicationUrl: 'https://www.calvet.ca.gov/VetServices/Pages/Property-Tax-Exemption.aspx',
    estimatedValue: '$100,000-$200,000 exemption value',
    tags: ['property-tax', 'disability-exemption', 'california'],
    lastUpdated: '2024-12-01'
  },

  // FLORIDA BENEFITS
  {
    id: 'fl-purple-heart-tuition-waiver',
    title: 'Florida Purple Heart Recipients Tuition Waiver',
    description: 'Free undergraduate tuition at Florida public institutions for Purple Heart recipients.',
    category: 'education',
    level: 'state',
    state: 'FL',
    eligibilityRequirements: [
      'Purple Heart recipient',
      'Honorable discharge',
      'Florida resident for at least one year',
      'Enrolled in undergraduate program'
    ],
    applicationUrl: 'https://floridavets.org/benefits-services/education/',
    estimatedValue: 'Full undergraduate tuition',
    tags: ['purple-heart', 'tuition-waiver', 'florida', 'undergraduate'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'fl-homestead-exemption',
    title: 'Florida Homestead Exemption for Disabled Veterans',
    description: 'Additional homestead exemption for veterans with service-connected disabilities.',
    category: 'housing',
    level: 'state',
    state: 'FL',
    eligibilityRequirements: [
      'Service-connected disability of 10% or higher',
      'Honorable discharge',
      'Florida resident',
      'Own and occupy homestead on January 1'
    ],
    applicationUrl: 'https://floridavets.org/benefits-services/property-tax-exemptions/',
    estimatedValue: '$5,000+ additional exemption',
    tags: ['homestead-exemption', 'disability', 'florida', 'property-tax'],
    lastUpdated: '2024-12-01'
  },

  // NEW YORK BENEFITS
  {
    id: 'ny-veterans-tuition-award',
    title: 'New York Veterans Tuition Award',
    description: 'Tuition assistance for veterans attending SUNY or CUNY schools.',
    category: 'education',
    level: 'state',
    state: 'NY',
    eligibilityRequirements: [
      'New York resident',
      'Honorable discharge',
      'Served in hostile fire/imminent danger pay area after August 2, 1990',
      'Annual income below $80,000'
    ],
    applicationUrl: 'https://www.hesc.ny.gov/pay-for-college/financial-aid/types-of-financial-aid/nys-grants-scholarships-awards/veterans-tuition-awards.html',
    estimatedValue: 'Up to full SUNY/CUNY tuition',
    tags: ['tuition-assistance', 'new-york', 'suny', 'cuny'],
    lastUpdated: '2024-12-01'
  },
  {
    id: 'ny-property-tax-exemption',
    title: 'New York Veterans Property Tax Exemptions',
    description: 'Property tax exemptions for veterans, with enhanced benefits for disabled veterans.',
    category: 'housing',
    level: 'state',
    state: 'NY',
    eligibilityRequirements: [
      'Honorable discharge',
      'New York resident',
      'Served during qualifying war period',
      'Own and occupy primary residence'
    ],
    applicationUrl: 'https://www.tax.ny.gov/pit/property/exemption/vetexmpt.htm',
    estimatedValue: '15% exemption + disability enhancements',
    tags: ['property-tax', 'new-york', 'wartime-service'],
    lastUpdated: '2024-12-01'
  }
]; 