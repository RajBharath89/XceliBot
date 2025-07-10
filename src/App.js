import React, { useState, useCallback } from 'react';
import { FileSpreadsheet, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/Button.js';
import ProgressIndicator from './components/ProgressIndicator.js';
import FileUpload from './components/FileUpload.js';
import DataAnalysis from './components/DataAnalysis.js';
import FieldSelection from './components/FieldSelection.js';
import DataPreview from './components/DataPreview.js';
import ExportSection from './components/ExportSection.js';
import { ExcelProcessor } from './lib/excel-processor.js';
import { WORKFLOW_STEPS } from './types/index.js';

// Simple toast notification system
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg z-50`}>
      {message}
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);
  
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);
  
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);
  
  return { toast, showToast, hideToast };
};

function App() {
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.UPLOAD);
  const [fileData, setFileData] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [filterConditions, setFilterConditions] = useState([]);
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { toast, showToast, hideToast } = useToast();
  
  const handleFileSelect = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ExcelProcessor.processFile(file);
      setFileData(data);
      setSelectedFields(data.columns.map(col => col.name)); // Select all fields by default
      setCurrentStep(WORKFLOW_STEPS.ANALYSIS);
      
      showToast(`Loaded ${data.totalRows.toLocaleString()} rows with ${data.totalColumns} columns.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);
  
  const handleProceedToSelection = useCallback(() => {
    setCurrentStep(WORKFLOW_STEPS.SELECTION);
  }, []);
  
  const handleProceedToPreview = useCallback(() => {
    if (!fileData) return;
    
    const processed = ExcelProcessor.filterData(fileData, selectedFields, filterConditions);
    setProcessedData(processed);
    setCurrentStep(WORKFLOW_STEPS.PREVIEW);
  }, [fileData, selectedFields, filterConditions]);
  
  const handleRefreshPreview = useCallback(() => {
    if (!fileData) return;
    
    const processed = ExcelProcessor.filterData(fileData, selectedFields, filterConditions);
    setProcessedData(processed);
    
    showToast(`Preview refreshed - showing ${processed.filteredCount.toLocaleString()} filtered records.`);
  }, [fileData, selectedFields, filterConditions, showToast]);
  
  const handleProceedToExport = useCallback(() => {
    setCurrentStep(WORKFLOW_STEPS.EXPORT);
  }, []);
  
  const handleGoBackToPreview = useCallback(() => {
    setCurrentStep(WORKFLOW_STEPS.PREVIEW);
  }, []);
  
  const handleExport = useCallback(async (options) => {
    if (!processedData || !fileData) return;
    
    try {
      await ExcelProcessor.exportData(processedData, fileData, options);
      
      showToast(`Downloaded ${options.fileName}.${options.format} with ${processedData.filteredCount.toLocaleString()} records.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      showToast(errorMessage, 'error');
      throw err;
    }
  }, [processedData, fileData, showToast]);
  
  const handleStartOver = useCallback(() => {
    setCurrentStep(WORKFLOW_STEPS.UPLOAD);
    setFileData(null);
    setSelectedFields([]);
    setFilterConditions([]);
    setProcessedData(null);
    setError(null);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileSpreadsheet className="text-blue-600 text-2xl mr-3" size={32} />
              <h1 className="text-xl font-semibold text-gray-900">Excel Data Filter & Export</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {fileData ? `${fileData.fileName} loaded` : 'No file uploaded'}
              </span>
              <Button variant="outline" size="sm">
                <HelpCircle className="mr-2" size={16} />
                Help
              </Button>
              {fileData && (
                <Button onClick={handleStartOver} variant="outline" size="sm">
                  Start Over
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === WORKFLOW_STEPS.UPLOAD && (
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            error={error}
          />
        )}
        
        {currentStep === WORKFLOW_STEPS.ANALYSIS && fileData && (
          <DataAnalysis
            fileData={fileData}
            onProceed={handleProceedToSelection}
          />
        )}
        
        {currentStep === WORKFLOW_STEPS.SELECTION && fileData && (
          <FieldSelection
            fileData={fileData}
            selectedFields={selectedFields}
            onSelectedFieldsChange={setSelectedFields}
            filterConditions={filterConditions}
            onFilterConditionsChange={setFilterConditions}
            onProceed={handleProceedToPreview}
          />
        )}
        
        {currentStep === WORKFLOW_STEPS.PREVIEW && processedData && fileData && (
          <DataPreview
            processedData={processedData}
            fileData={fileData}
            onRefresh={handleRefreshPreview}
            onProceed={handleProceedToExport}
          />
        )}
        
        {currentStep === WORKFLOW_STEPS.EXPORT && processedData && (
          <ExportSection
            processedData={processedData}
            selectedFieldsCount={selectedFields.length}
            activeFiltersCount={filterConditions.length}
            onExport={handleExport}
            onGoBack={handleGoBackToPreview}
          />
        )}
      </main>
    </div>
  );
}

export default App;