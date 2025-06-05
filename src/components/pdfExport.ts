import jsPDF from 'jspdf';

interface BenefitResult {
  id: string;
  title: string;
  description: string;
  eligibilityMatch: number;
  processingTime: string;
  nextSteps: string[];
  requiredDocuments: string[];
  estimatedValue: string;
}

interface UserProfile {
  serviceInfo: {
    branch: string;
    serviceYears: string;
    dischargeStatus: string;
    combatVeteran: boolean;
  };
  demographics: {
    age: number;
    state: string;
    dependents: number;
  };
  disabilities: string[];
}

export class VetNavPDFExporter {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF();
  }

  exportBenefitsReport(profile: UserProfile, benefits: BenefitResult[]): Blob {
    this.addHeader();
    this.addUserSummary(profile);
    this.addBenefitsList(benefits);
    this.addNextSteps(benefits);
    this.addResources();
    
    return this.doc.output('blob');
  }

  private addHeader(): void {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('VetNav Benefits Report', 20, 30);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
    
    this.doc.setDrawColor(0, 123, 255);
    this.doc.line(20, 45, 190, 45);
  }

  private addUserSummary(profile: UserProfile): void {
    let yPos = 60;
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Veteran Profile', 20, yPos);
    
    yPos += 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const profileText = [
      `Service Branch: ${profile.serviceInfo.branch}`,
      `Years of Service: ${profile.serviceInfo.serviceYears}`,
      `Discharge Status: ${profile.serviceInfo.dischargeStatus}`,
      `Combat Veteran: ${profile.serviceInfo.combatVeteran ? 'Yes' : 'No'}`,
      `State: ${profile.demographics.state}`,
      `Dependents: ${profile.demographics.dependents}`
    ];

    profileText.forEach(text => {
      this.doc.text(text, 20, yPos);
      yPos += 8;
    });
  }

  private addBenefitsList(benefits: BenefitResult[]): void {
    let yPos = 140;
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recommended Benefits', 20, yPos);
    
    yPos += 15;
    
    benefits.forEach((benefit, index) => {
      if (yPos > 250) {
        this.doc.addPage();
        yPos = 30;
      }
      
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${benefit.title}`, 20, yPos);
      
      yPos += 10;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(0, 150, 0);
      this.doc.text(`${benefit.eligibilityMatch}% Match`, 20, yPos);
      this.doc.setTextColor(0, 0, 0);
      
      yPos += 8;
      
      this.doc.setFontSize(11);
      const splitDesc = this.doc.splitTextToSize(benefit.description, 170);
      this.doc.text(splitDesc, 20, yPos);
      yPos += splitDesc.length * 6;
      
      yPos += 5;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`Processing: ${benefit.processingTime}`, 20, yPos);
      this.doc.text(`Est. Value: ${benefit.estimatedValue}`, 110, yPos);
      
      yPos += 15;
    });
  }

  private addNextSteps(benefits: BenefitResult[]): void {
    this.doc.addPage();
    let yPos = 30;
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Next Steps & Required Documents', 20, yPos);
    
    yPos += 15;
    
    benefits.forEach((benefit, index) => {
      if (yPos > 240) {
        this.doc.addPage();
        yPos = 30;
      }
      
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${benefit.title}:`, 20, yPos);
      yPos += 12;
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      
      benefit.nextSteps.forEach(step => {
        this.doc.text(`• ${step}`, 25, yPos);
        yPos += 8;
      });
      
      yPos += 5;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Required Documents:', 25, yPos);
      yPos += 8;
      
      this.doc.setFont('helvetica', 'normal');
      benefit.requiredDocuments.forEach(doc => {
        this.doc.text(`• ${doc}`, 30, yPos);
        yPos += 6;
      });
      
      yPos += 15;
    });
  }

  private addResources(): void {
    this.doc.addPage();
    let yPos = 30;
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Important Resources', 20, yPos);
    
    yPos += 20;
    
    const resources = [
      {
        title: 'Veterans Crisis Line',
        info: 'Call 988, Press 1 | Text: 838255 | Chat: VeteransCrisisLine.net'
      },
      {
        title: 'VA.gov',
        info: 'Official VA website for applications and status checks'
      },
      {
        title: 'eBenefits',
        info: 'Online portal for benefit management'
      },
      {
        title: 'Local VSO',
        info: 'Contact your local Veterans Service Organization for free help'
      }
    ];
    
    this.doc.setFontSize(12);
    
    resources.forEach(resource => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(resource.title, 20, yPos);
      yPos += 8;
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(resource.info, 25, yPos);
      yPos += 15;
    });
  }
}
