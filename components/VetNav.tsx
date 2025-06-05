<<<<<<< HEAD
"use client";
import { useState, ComponentType } from 'react';
import PDFExportModal from './PDFExportModal';
import MythBusters from './MythBusters';
import BarriersEducation from './BarriersEducation';
import ProcessingTimeline from './ProcessingTimeline';

// Define interfaces for better type safety
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

interface Benefit {
  id: string;
  title: string;
  description: string;
  processing: string;
  eligibilityMatch: number;
  nextSteps: string[];
  requiredDocuments: string[];
  estimatedValue: string;
  keyFacts: string[];
}

interface EducationTab {
  id: string;
  label: string;
  component: ComponentType<any>;
}

export default function VetNav() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeEducationTab, setActiveEducationTab] = useState('myths');

  const benefits: Benefit[] = [
    {
      id: "va-healthcare",
      title: "VA Health Care",
      description: "Comprehensive healthcare services including preventive, primary, and specialty care. Eligible regardless of service-connected disability status.",
      processing: "30-60 days enrollment",
      eligibilityMatch: 95,
      nextSteps: [
        "Apply online at VA.gov/health-care",
        "Gather military discharge papers (DD214)",
        "Complete enrollment interview if required",
        "Provide income information for priority group determination"
      ],
      requiredDocuments: [
        "DD214 or discharge papers",
        "Social Security card",
        "Insurance information (if applicable)",
        "Income verification documents"
      ],
      estimatedValue: "$15,000-$50,000/year",
      keyFacts: [
        "No time limit after discharge to apply",
        "Income affects priority group, not eligibility",
        "PACT Act expanded eligibility for toxic exposure veterans"
      ]
    },
    {
      id: "disability-comp",
      title: "Disability Compensation", 
      description: "Monthly tax-free payment for veterans with service-connected disabilities. Both physical and mental health conditions qualify.",
      processing: "131-141 days average",
      eligibilityMatch: 88,
      nextSteps: [
        "File claim at VA.gov/disability",
        "Gather all medical evidence and service records",
        "Obtain nexus letter from healthcare provider",
        "Attend C&P examination if scheduled",
        "Submit buddy statements if applicable"
      ],
      requiredDocuments: [
        "VA Form 21-526EZ",
        "Medical records (service and private)",
        "Nexus letter linking condition to service",
        "Buddy statements from fellow service members"
      ],
      estimatedValue: "$1,500-$3,500/month",
      keyFacts: [
        "Covers both physical and mental health conditions",
        "No time limit to file initial claim",
        "Presumptive conditions require less evidence"
      ]
    },
    {
      id: "education",
      title: "Post-9/11 GI Bill",
      description: "Education benefits for tuition, housing, and books. Transferable to family members in some cases.",
      processing: "30 days",
      eligibilityMatch: 92,
      nextSteps: [
        "Apply at VA.gov/education",
        "Choose approved school/program",
        "Submit enrollment certification",
        "Understand housing allowance eligibility"
      ],
      requiredDocuments: [
        "VA Form 22-1990",
        "DD214 showing qualifying service",
        "School enrollment verification",
        "Transfer paperwork (if applicable)"
      ],
      estimatedValue: "$100,000-$200,000 total",
      keyFacts: [
        "36 months of benefits for qualifying service",
        "Housing allowance varies by location",
        "Can be transferred to dependents"
      ]
    }
  ];

  const handleScreeningComplete = (profileData: UserProfile) => {
    setUserProfile(profileData);
    setCurrentStep('results');
  };

  const educationTabs: EducationTab[] = [
    { id: 'myths', label: 'Myth Busters', component: MythBusters },
    { id: 'barriers', label: 'Common Barriers', component: BarriersEducation },
    { id: 'timeline', label: 'Processing Times', component: ProcessingTimeline }
  ];

  return (
    <section id="vetnav" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Veterans Benefits Finder
          </h1>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium mb-8">
            State & Federal
          </div>
          <p className="text-xl text-blue-100 mb-12">
            Made by a Veteran for Veterans
          </p>

          {currentStep === 'welcome' && (
            <div>
              <button
                onClick={() => setCurrentStep('screening')}
                className="group relative w-64 h-64 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <span className="text-2xl font-medium">Find My Benefits</span>
              </button>
            </div>
          )}

          {currentStep === 'screening' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Screening</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleScreeningComplete({
                    serviceInfo: {
                      branch: 'Army',
                      serviceYears: '4',
                      dischargeStatus: 'Honorable',
                      combatVeteran: true
                    },
                    demographics: {
                      age: 35,
                      state: 'Texas',
                      dependents: 2
                    },
                    disabilities: ['PTSD', 'Tinnitus']
                  })}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                >
                  I&apos;m a Veteran - Show My Benefits
                </button>
                <button
                  onClick={() => setCurrentStep('welcome')}
                  className="w-full p-2 text-blue-200 hover:text-white"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-6">Your Benefits</h2>
                <button
                  onClick={() => setShowPDFModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-medium"
                >
                  Export PDF Report
                </button>
              </div>
              
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-left">
                  <h3 className="text-xl font-bold mb-3 text-blue-200">{benefit.title}</h3>
                  <p className="text-white/90 mb-3">{benefit.description}</p>
                  <p className="text-blue-200 text-sm mb-4">Processing Time: {benefit.processing}</p>
                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                      Learn More
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setCurrentStep('welcome')}
                className="w-full p-2 text-blue-200 hover:text-white mt-6"
              >
                ← Start Over
              </button>
            </div>
          )}

          <div className="mt-16 bg-red-600 text-white p-4 rounded-lg">
            <strong>Need immediate help?</strong> Veterans Crisis Line: 988, Press 1 | Text: 838255
          </div>
        </div>
      </div>

      <PDFExportModal
        userProfile={userProfile}
        benefits={benefits}
        isVisible={showPDFModal}
        onClose={() => setShowPDFModal(false)}
      />
    </section>
  );
}
=======
﻿
>>>>>>> f9f0c79e45cd7a5a376e667e340f6d11d63d8f1e
