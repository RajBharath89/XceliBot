import React from 'react';
import { FileText, Table, Columns, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { Badge } from './ui/Badge.js';

const DataAnalysis = ({ fileData, onProceed }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'date': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="mb-8">
      <CardContent>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Table className="inline-block mr-2 text-blue-600" size={20} />
          File Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-blue-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-900">{fileData.fileName}</p>
                <p className="text-xs text-gray-500">File Type</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Table className="text-green-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-900">{fileData.totalRows.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Rows</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Columns className="text-orange-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-sm font-medium text-gray-900">{fileData.totalColumns}</p>
                <p className="text-xs text-gray-500">Columns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Detected Columns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fileData.columns.map((column, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">{column.name}</span>
                </div>
                <Badge className={getTypeColor(column.type)}>
                  {column.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onProceed} className="bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="mr-2" size={16} />
            Proceed to Field Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataAnalysis;