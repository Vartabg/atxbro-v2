"use client";
import { useState } from 'react';
import PDFExportModal from './PDFExportModal';
import MythBusters from './MythBusters';
import BarriersEducation from './BarriersEducation';
import ProcessingTimeline from './ProcessingTimeline';

export default function VetNav() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeEducationTab, setActiveEducationTab] = useState('myths');

  const benefits = [
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
      estimatedValue: ",000-,000/year",
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
      estimatedValue: "-,500/month",
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
      estimatedValue: ",000-,000 total",
      keyFacts: [
        "36 months of benefits for qualifying service",
        "Housing allowance varies by location",
        "Can be transferred to dependents"
      ]
    }
  ];

  const handleScreeningComplete = (profileData) => {
    setUserProfile(profileData);
    setCurrentStep('results');
  };

  const educationTabs = [
    { id: 'myths', label: 'Myth Busters', component: MythBusters },
    { id: 'barriers', label: 'Common Barriers', component: BarriersEducation },
    { id: 'timeline', label: 'Processing Times', component: ProcessingTimeline }
  ];

  return (
    <section id="vetnav" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Veterans Benefits Navigator
          </h1>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium mb-4">
            Research-Backed • State & Federal
          </div>
          <p className="text-xl text-blue-100 mb-12">
            Evidence-based guidance to help you access the benefits you've earned
          </p>

          {currentStep === 'welcome' && (
            <div>
              {/* Education Tabs */}
              <div className="mb-12">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 inline-flex">
                    {educationTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveEducationTab(tab.id)}
                        className={`px-4 py-2 rounded-md transition-all ${
                          activeEducationTab === tab.id
                            ? 'bg-white/20'
                            : 'text-blue-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Active Education Component */}
                {educationTabs.map((tab) => (
                  activeEducationTab === tab.id && <tab.component key={tab.id} />
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('screening')}
                  className="group relative w-64 h-64 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="text-2xl font-medium mb-2">Find My Benefits</div>
                    <div className="text-sm opacity-80">Personalized Assessment</div>
                  </div>
                </button>
                <p className="text-blue-200 mt-4 text-sm">
                  Based on comprehensive research of veteran benefit barriers and solutions
                </p>
              </div>
            </div>
          )}

          {currentStep === 'screening' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Personalized Benefits Assessment</h2>
              <p className="text-blue-200 mb-8">
                Help us understand your situation to provide the most relevant benefits information
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleScreeningComplete({
                    serviceInfo: {
                      branch: "Army",
                      serviceYears: "4 years",
                      dischargeStatus: "Honorable",
                      combatVeteran: true
                    },
                    demographics: {
                      age: 32,
                      state: "Texas",
                      dependents: 2
                    },
                    disabilities: ["PTSD", "Hearing Loss"]
                  })}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                >
                  I'm a Veteran - Show My Benefits
                </button>
                <button
                  onClick={() => handleScreeningComplete({
                    serviceInfo: {
                      branch: "N/A",
                      serviceYears: "N/A", 
                      dischargeStatus: "N/A",
                      combatVeteran: false
                    },
                    demographics: {
                      age: 45,
                      state: "Texas",
                      dependents: 1
                    },
                    disabilities: []
                  })}
                  className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
                >
                  I'm a Family Member - Show Benefits
                </button>
                <button
                  onClick={() => setCurrentStep('welcome')}
                  className="w-full p-2 text-blue-200 hover:text-white"
                >
                  ← Back to Education
                </button>
              </div>
            </div>
          )}

          {currentStep === 'results' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Your Personalized Benefits</h2>
                  <p className="text-blue-200">Based on research-backed eligibility criteria</p>
                </div>
                <button
                  onClick={() => setShowPDFModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Complete Report
                </button>
              </div>
              
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-left">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-blue-200">{benefit.title}</h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {benefit.eligibilityMatch}% Match
                    </span>
                  </div>
                  
                  <p className="text-white/90 mb-4">{benefit.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="bg-blue-500/20 p-3 rounded">
                      <p className="text-blue-200 font-semibold">Processing Time</p>
                      <p className="text-white">{benefit.processing}</p>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded">
                      <p className="text-green-200 font-semibold">Estimated Value</p>
                      <p className="text-white">{benefit.estimatedValue}</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded">
                      <p className="text-purple-200 font-semibold">Documents Needed</p>
                      <p className="text-white">{benefit.requiredDocuments.length} items</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-blue-200 font-semibold mb-2">Key Facts:</h4>
                    <ul className="text-sm space-y-1">
                      {benefit.keyFacts.map((fact, index) => (
                        <li key={index} className="flex items-center text-green-200">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium">
                      View Details
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-medium">
                      Start Application
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('welcome')}
                  className="text-blue-200 hover:text-white underline"
                >
                  ← Return to Education Center
                </button>
              </div>
            </div>
          )}

          <div className="mt-16 bg-red-600 text-white p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-bold mb-2">Crisis Support</p>
                <p>Veterans Crisis Line: 988, Press 1 | Text: 838255</p>
              </div>
              <div>
                <p className="font-bold mb-2">Free Help Available</p>
                <p>Contact your local Veterans Service Organization (VSO)</p>
              </div>
            </div>
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
