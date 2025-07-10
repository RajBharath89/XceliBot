import React from 'react';
import { WORKFLOW_STEPS } from '../types/index.js';

const steps = [
  { id: WORKFLOW_STEPS.UPLOAD, label: 'Upload File', number: 1 },
  { id: WORKFLOW_STEPS.ANALYSIS, label: 'Select Fields', number: 2 },
  { id: WORKFLOW_STEPS.SELECTION, label: 'Filter Data', number: 3 },
  { id: WORKFLOW_STEPS.PREVIEW, label: 'Export', number: 4 },
];

const ProgressIndicator = ({ currentStep }) => {
  const getStepIndex = (step) => {
    return steps.findIndex(s => s.id === step);
  };
  
  const currentStepIndex = getStepIndex(currentStep);
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStepIndex
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 ml-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;