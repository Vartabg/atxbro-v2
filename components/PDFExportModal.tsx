"use client";
import { useState } from 'react';
import { VetNavPDFExporter } from '../utils/pdfExport';

interface PDFExportProps {
  userProfile: any;
  benefits: any[];
  isVisible: boolean;
  onClose: () => void;
}

export default function PDFExportModal({ userProfile, benefits, isVisible, onClose }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const exporter = new VetNavPDFExporter();
      const pdfBlob = exporter.exportBenefitsReport(userProfile, benefits);
      
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
      
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `VetNav-Benefits-Report-${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Export Benefits Report</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your Report Includes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Veteran profile summary</li>
              <li>• {benefits.length} recommended benefits</li>
              <li>• Detailed next steps</li>
              <li>• Required documents checklist</li>
              <li>• Important resources & contacts</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Download PDF Report'}
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
