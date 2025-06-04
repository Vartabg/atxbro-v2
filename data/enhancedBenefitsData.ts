// Enhanced benefits data based on research
export const enhancedBenefitsData = {
  eligibilityMyths: [
    {
      myth: "I make too much money to be eligible",
      fact: "Income is not a primary factor for all benefits (e.g., disability compensation, much of VA healthcare). It is key for Pension and can affect healthcare priority.",
      source: "VA.gov eligibility pages"
    },
    {
      myth: "I have been out of the military for too long",
      fact: "Most core VA benefits (healthcare, disability) do not have an expiration date based on time since service.",
      source: "VA eligibility guidelines"
    },
    {
      myth: "I'm not eligible as I never deployed/was not in combat",
      fact: "Deployment/combat is not required for general VA healthcare or many other benefits.",
      source: "VA healthcare eligibility"
    },
    {
      myth: "I don't have a service-connected disability, so I can't get VA health care",
      fact: "VA healthcare is available to eligible veterans regardless of service-connected disability status.",
      source: "VA healthcare enrollment"
    },
    {
      myth: "I will take a spot from someone who needs it more",
      fact: "The VA system is designed for all eligible veterans; accessing earned benefits does not deprive others.",
      source: "VA capacity planning"
    },
    {
      myth: "VA benefits are automatic upon discharge",
      fact: "Veterans must actively apply for each benefit program.",
      source: "VA application process"
    },
    {
      myth: "Disability ratings negatively affect employment",
      fact: "Generally false, unless receiving TDIU (Total Disability Based on Individual Unemployability).",
      source: "VA disability compensation"
    }
  ],

  commonBarriers: [
    {
      barrier: "Complex Application Process",
      description: "Veterans find the VA benefits system difficult to understand and navigate",
      solutions: ["Simplified UI/UX", "Guided step-by-step workflows", "Plain language content", "Progress indicators"]
    },
    {
      barrier: "Lack of Awareness",
      description: "Veterans may not know about all benefits they are eligible for",
      solutions: ["Proactive benefit suggestions", "Clear eligibility explanations", "Personalized dashboards"]
    },
    {
      barrier: "Documentation Challenges",
      description: "Difficulty gathering, managing, and submitting required evidence",
      solutions: ["Secure document upload", "Evidence checklists", "Templates for statements", "Cloud storage integration"]
    },
    {
      barrier: "Geographical/Virtual Barriers",
      description: "Rural veterans face distance and connectivity challenges",
      solutions: ["Low-bandwidth mode", "Offline access", "Mail-in options", "VSO locator with telehealth"]
    }
  ],

  processingTimes: {
    "VA Healthcare": "30-60 days enrollment",
    "Disability Compensation": "131.5-141.5 days average",
    "Post-9/11 GI Bill": "30 days",
    "VA Pension": "90-120 days",
    "Home Loan COE": "Online: seconds, Mail: varies",
    "VR&E": "45-60 days"
  },

  commonRejectionReasons: [
    "Insufficient medical evidence/lack of documentation",
    "Errors in paperwork/small filing errors",
    "Failure to meet eligibility criteria",
    "Condition not adequately linked to service (no nexus)",
    "Downplaying symptoms in application"
  ],

  fasterProcessingTips: [
    "Submit Fully Developed Claims (FDC) with all evidence upfront",
    "Obtain nexus letters from healthcare providers",
    "Gather complete service treatment records",
    "Work with accredited VSO representatives",
    "Be thorough and specific when describing symptoms"
  ]
};
