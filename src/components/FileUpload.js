import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { validateFile } from '../lib/file-utils.js';

const FileUpload = ({ onFileSelect, onProceed, isLoading, error, file }) => {
  const handleFileSelect = useCallback((file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      console.error(validation.error);
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={onProceed}
          className="text-white bg-orange-600 hover:bg-orange-700"
          disabled={!file || isLoading}
        >
          Proceed to Analysis
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>

      <Card className="mt-8">
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="inline-block mr-2 text-orange-600" size={20} />
            Upload Your File
          </h2>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-600 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="mx-auto text-4xl text-gray-400 mb-4" size={48} />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isLoading ? 'Processing file...' : 'Drag and drop your file here'}
            </p>
            <p className="text-md text-gray-600 mb-4">or click to browse</p>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              disabled={isLoading}
            />
            <Button disabled={isLoading} className="text-white bg-orange-600 hover:bg-orange-700">
              Choose File
            </Button>
          </div>

          {file && (
            <div className="mt-4 text-md text-green-700 bg-green-50 border border-green-200 p-3 rounded-md">
              <FileText className="inline mr-2" size={16} />
              Uploaded: <strong>{file.name}</strong>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={16} />
                <span className="text-md text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="mt-4 text-md text-gray-600">
            <p className="flex items-center mb-1">
              <FileText className="inline mr-2" size={16} />
              Supported formats: Excel (.xlsx, .xls), CSV (.csv)
            </p>
            <p className="flex items-center">
              <AlertCircle className="inline mr-2" size={16} />
              Maximum file size: 10MB
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FileUpload;
