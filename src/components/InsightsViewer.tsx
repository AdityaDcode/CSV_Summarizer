import React from 'react';
import { Brain, Lightbulb } from 'lucide-react';

interface Insights {
  english: string;
  hindi: string;
  kannada: string;
  marathi: string;
}

import { LanguageCode } from '../config';

interface InsightsViewerProps {
  insights?: Insights;
  selectedLanguage: LanguageCode;
  isLoading: boolean;
}

function InsightsViewer({ insights, selectedLanguage, isLoading }: InsightsViewerProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Generating AI Insights...</h3>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Upload a CSV file and click "Analyze Data" to generate insights</p>
      </div>
    );
  }

  const currentInsight = insights[selectedLanguage];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          AI-Generated Insights
          {selectedLanguage === 'hindi' && ' (हिंदी)'}
          {selectedLanguage === 'kannada' && ' (ಕನ್ನಡ)'}
          {selectedLanguage === 'marathi' && ' (मराठी)'}
        </h3>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-blue-500">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {currentInsight}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-600">
          💡 These insights are generated using advanced AI analysis of your CSV data. 
          The AI identifies patterns, trends, and key findings to help you understand your data better.
        </p>
      </div>
    </div>
  );
}

export default InsightsViewer;