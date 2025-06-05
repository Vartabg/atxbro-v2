import { TransitionProgram, TransitionMilestone } from '../types/benefits';

export const transitionPrograms: TransitionProgram[] = [
  {
    id: 'hiring-our-heroes-fellowship',
    name: 'Hiring Our Heroes Corporate Fellowship',
    description: '12-week paid internships with leading companies for transitioning service members.',
    type: 'fellowship',
    duration: '12 weeks',
    applicationUrl: 'https://www.hiringourheroes.org/career-services/fellowships/',
    eligibilityRequirements: [
      'Active duty service member within 6 months of separation',
      'Officer or senior NCO (E-5 and above)',
      'Security clearance preferred',
      'Commitment to pursue employment with fellowship company'
    ],
    locations: ['Nationwide', 'Remote options available'],
    applicationDeadline: 'Rolling basis'
  },
  {
    id: 'dod-skillbridge',
    name: 'DoD SkillBridge',
    description: 'Industry training and civilian work experience during last 180 days of service.',
    type: 'apprenticeship',
    duration: '3-6 months',
    applicationUrl: 'https://skillbridge.osd.mil/',
    eligibilityRequirements: [
      'Active duty service member',
      'Within 180 days of separation/retirement',
      'Command approval required',
      'Honorable service record'
    ],
    locations: ['Nationwide', '1000+ participating companies'],
    applicationDeadline: '6 months before desired start date'
  },
  {
    id: 'vet-tec',
    name: 'VET TEC Program',
    description: 'Full-time technology training programs without using GI Bill benefits.',
    type: 'training',
    duration: '3-18 months',
    applicationUrl: 'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/',
    eligibilityRequirements: [
      'At least one day of unexpired GI Bill benefits',
      'Accepted into approved program',
      'Meet program prerequisites'
    ],
    locations: ['Nationwide', 'Online and in-person options'],
    applicationDeadline: 'Program dependent'
  },
  {
    id: 'helmets-to-hardhats',
    name: 'Helmets to Hardhats',
    description: 'Connect military service members with skilled training and career opportunities in construction.',
    type: 'apprenticeship',
    duration: '2-5 years',
    applicationUrl: 'https://www.helmetstohardhats.org/',
    eligibilityRequirements: [
      'Current or former military service member',
      'Honorable discharge',
      'Interest in construction trades',
      'Pass drug screening and physical requirements'
    ],
    locations: ['Nationwide', 'Local union training centers'],
    applicationDeadline: 'Rolling basis'
  }
];

export const transitionMilestones: TransitionMilestone[] = [
  {
    id: 'initial-counseling',
    title: 'Initial Transition Counseling',
    description: 'Meet with transition counselor to discuss post-military goals and create individualized plan.',
    timeBeforeSeparation: 365, // 12 months
    isRequired: true,
    actionItems: [
      'Schedule appointment with transition counselor',
      'Complete self-assessment',
      'Identify post-military goals',
      'Create Individual Transition Plan (ITP)'
    ],
    resources: [
      'Base transition office',
      'Military OneSource',
      'VA Solid Start program'
    ]
  },
  {
    id: 'tap-workshops',
    title: 'Transition Assistance Program (TAP) Workshops',
    description: 'Mandatory workshops covering benefits, employment, education, and entrepreneurship.',
    timeBeforeSeparation: 365,
    isRequired: true,
    actionItems: [
      'Attend VA Benefits briefing',
      'Complete DOL Employment Workshop',
      'Choose optional track (Higher Education or Entrepreneurship)',
      'Complete all required assessments'
    ],
    resources: [
      'Base education office',
      'American Job Centers',
      'SBA Business Development Centers'
    ]
  },
  {
    id: 'benefits-claim-filing',
    title: 'File Benefits Delivery at Discharge (BDD) Claim',
    description: 'File VA disability claim 180-90 days before separation for faster processing.',
    timeBeforeSeparation: 180,
    isRequired: false,
    actionItems: [
      'Gather medical records',
      'Complete VA Form 21-526EZ',
      'Schedule C&P examinations',
      'Submit supporting documentation'
    ],
    resources: [
      'VA Regional Office',
      'Veterans Service Organizations (VSOs)',
      'Base medical records office'
    ]
  },
  {
    id: 'skillbridge-application',
    title: 'Apply for SkillBridge Program',
    description: 'Submit application for civilian internship during final months of service.',
    timeBeforeSeparation: 180,
    isRequired: false,
    actionItems: [
      'Research participating companies',
      'Submit application through SkillBridge portal',
      'Obtain command approval',
      'Coordinate start date with separation timeline'
    ],
    resources: [
      'SkillBridge website',
      'Career counselors',
      'Industry partners'
    ]
  },
  {
    id: 'capstone',
    title: 'TAP Capstone Event',
    description: 'Final verification that you\'re prepared for transition with required career readiness standards.',
    timeBeforeSeparation: 90,
    isRequired: true,
    actionItems: [
      'Complete Career Readiness Standards verification',
      'Finalize post-military plans',
      'Ensure all TAP requirements are met',
      'Receive certificate of completion'
    ],
    resources: [
      'Transition counselor',
      'Command career counselor',
      'Base transition office'
    ]
  },
  {
    id: 'final-out-processing',
    title: 'Final Out-Processing',
    description: 'Complete all administrative requirements and receive DD-214.',
    timeBeforeSeparation: 30,
    isRequired: true,
    actionItems: [
      'Complete final medical/dental appointments',
      'Turn in equipment and clear base facilities',
      'Receive DD-214 (ensure accuracy)',
      'Complete final finance actions'
    ],
    resources: [
      'Base personnel office',
      'Finance office',
      'Medical/dental facilities'
    ]
  }
]; 