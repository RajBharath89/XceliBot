import React, { useState } from 'react';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Checkbox } from './ui/Checkbox.js';
import { Select, SelectOption } from './ui/Select.js';
import { EXPORT_FORMATS } from '../types/index.js';

const ExportSection = ({
  processedData,
  selectedFieldsCount,
  activeFiltersCount,
  onExport,
  onGoBack
}) => {
  const [exportOptions, setExportOptions] = useState({
    fileName: 'filtered_data',
    format: EXPORT_FORMATS.XLSX,
    includeHeaders: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
      await onExport(exportOptions);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <>
     <div className="flex justify-between mb-8">
          <Button onClick={onGoBack} variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Back to Preview
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !exportOptions.fileName.trim()}
            className="text-white bg-orange-600 hover:bg-orange-700"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2" size={16} />
                Download {exportOptions.format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="inline-block mr-2 text-orange-600" size={20} />
          Export Filtered Data
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
  <h3 className="text-md font-semibold text-gray-900 mb-3">Export Summary</h3>
  <div className="grid grid-cols-2 gap-4">
    <div className="p-4 bg-gray-50 rounded-md shadow-sm">
      <p className="text-sm text-gray-500">Total Records</p>
      <p className="text-xl font-semibold text-gray-900">
        {processedData.filteredCount.toLocaleString()}
      </p>
    </div>
    <div className="p-4 bg-gray-50 rounded-md shadow-sm">
      <p className="text-sm text-gray-500">Selected Fields</p>
      <p className="text-xl font-semibold text-gray-900">{selectedFieldsCount}</p>
    </div>
    <div className="p-4 bg-gray-50 rounded-md shadow-sm">
      <p className="text-sm text-gray-500">Active Filters</p>
      <p className="text-xl font-semibold text-gray-900">{activeFiltersCount}</p>
    </div>
    <div className="p-4 bg-gray-50 rounded-md shadow-sm">
      <p className="text-sm text-gray-500">File Format</p>
      <p className="text-xl font-semibold text-gray-900">
        {exportOptions.format.toUpperCase()}
      </p>
    </div>
  </div>
</div>
          
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Export Options</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="fileName" className="text-md font-medium text-gray-700 block mb-1">
                  File Name
                </label>
                <Input
                  id="fileName"
                  type="text"
                  value={exportOptions.fileName}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, fileName: e.target.value }))}
                  placeholder="Enter file name"
                />
              </div>
              <div>
                <label htmlFor="format" className="text-md font-medium text-gray-700 block mb-1">
                  Format
                </label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value }))}
                >
                  <SelectOption value={EXPORT_FORMATS.XLSX}>Excel (.xlsx)</SelectOption>
                  <SelectOption value={EXPORT_FORMATS.CSV}>CSV (.csv)</SelectOption>
                  <SelectOption value={EXPORT_FORMATS.JSON}>JSON (.json)</SelectOption>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHeaders"
                  checked={exportOptions.includeHeaders}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeHeaders: Boolean(checked) }))
                  }
                />
                <label htmlFor="includeHeaders" className="text-md text-gray-600">
                  Include column headers
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {exportSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              <span className="text-md text-green-700">File exported successfully!</span>
            </div>
          </div>
        )}
        
        
      </CardContent>
    </Card>
   
        </>
  );
};

export default ExportSection;