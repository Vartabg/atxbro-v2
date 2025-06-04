// Eligibility Engine - matches user profile to benefits
export class EligibilityEngine {
  constructor(benefitsData) {
    this.benefits = benefitsData;
  }

  // Main eligibility checker
  checkEligibility(userProfile, scope = 'both') {
    const results = {
      eligible: [],
      partiallyEligible: [],
      ineligible: [],
      requiresReview: []
    };

    // Check federal benefits
    if (scope === 'both' || scope === 'federal') {
      this.checkBenefitsGroup(this.benefits.federal, userProfile, results);
    }

    // Check state benefits
    if (scope === 'both' || scope === 'state') {
      const userState = userProfile.state || 'texas'; // Default to 'texas'
      if (this.benefits.state[userState]) {
        this.checkBenefitsGroup(this.benefits.state[userState], userProfile, results);
      }
    }

    // Sort by priority
    this.sortByPriority(results);
    
    return results;
  }

  checkBenefitsGroup(benefitsGroup, userProfile, results) {
    Object.values(benefitsGroup).forEach(benefit => {
      const eligibilityStatus = this.evaluateBenefit(benefit, userProfile);
      results[eligibilityStatus.category].push({
        ...benefit,
        eligibilityStatus,
        matchedCriteria: eligibilityStatus.matched,
        missingCriteria: eligibilityStatus.missing
      });
    });
  }

  evaluateBenefit(benefit, userProfile) {
    const required = benefit.eligibility;
    const matched = [];
    const missing = [];

    required.forEach(criterion => {
      if (this.meetsCriterion(criterion, userProfile)) {
        matched.push(criterion);
      } else {
        missing.push(criterion);
      }
    });

    // Determine eligibility category
    if (missing.length === 0) {
      return { category: 'eligible', matched, missing, confidence: 'high' };
    } else if (matched.length >= required.length * 0.7) {
      return { category: 'partiallyEligible', matched, missing, confidence: 'medium' };
    } else if (userProfile.dischargeStatus === 'Dishonorable') {
      return { category: 'requiresReview', matched, missing, confidence: 'low' };
    } else {
      return { category: 'ineligible', matched, missing, confidence: 'low' };
    }
  }

  meetsCriterion(criterion, userProfile) {
    switch (criterion) {
      case 'veteran':
        return userProfile.isVeteran === true;
      
      case 'honorableDischarge':
        return ['Honorable', 'General'].includes(userProfile.dischargeStatus);
      
      case 'serviceTime':
        return userProfile.serviceDays >= 90; // Minimum for most benefits
      
      case 'serviceConnectedDisability':
        return userProfile.hasServiceConnectedDisability === true;
      
      case 'post911Service':
        return userProfile.serviceAfter911 === true;
      
      case 'texasResident':
        return userProfile.state === 'texas';
      
      case '181daysService':
        return userProfile.serviceDays >= 181;
      
      default:
        return false;
    }
  }

  sortByPriority(results) {
    const priorityOrder = { 'critical': 1, 'financial': 2, 'life-improving': 3, 'optional': 4 };
    
    Object.keys(results).forEach(category => {
      results[category].sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 5;
        const bPriority = priorityOrder[b.priority] || 5;
        return aPriority - bPriority;
      });
    });
  }

  // Get personalized recommendations
  getRecommendations(userProfile) {
    const eligibility = this.checkEligibility(userProfile);
    const recommendations = [];

    // High-priority eligible benefits
    eligibility.eligible
      .filter(b => b.priority === 'critical')
      .forEach(benefit => {
        recommendations.push({
          type: 'immediate',
          benefit,
          message: `You're eligible for ${benefit.title}. This is a high-priority benefit.`,
          action: 'Apply now'
        });
      });

    // Underused benefits
    eligibility.eligible
      .filter(b => b.underused)
      .forEach(benefit => {
        recommendations.push({
          type: 'underused',
          benefit,
          message: `${benefit.title} is often overlooked but you qualify.`,
          action: 'Learn more'
        });
      });

    // Partial eligibility with guidance
    eligibility.partiallyEligible.forEach(benefit => {
      const nextStep = this.getNextStep(benefit.missingCriteria[0]);
      recommendations.push({
        type: 'potential',
        benefit,
        message: `You may qualify for ${benefit.title}. ${nextStep}`,
        action: 'Check eligibility'
      });
    });

    return recommendations;
  }

  getNextStep(missingCriterion) {
    switch (missingCriterion) {
      case 'serviceConnectedDisability':
        return 'Consider filing a disability claim first.';
      case 'honorableDischarge':
        return 'You may be able to upgrade your discharge status.';
      case 'serviceTime':
        return 'Verify your total service time with your DD-214.';
      default:
        return 'Additional documentation may be required.';
    }
  }
}
