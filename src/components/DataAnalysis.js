import React from 'react';
import { FileText, Table, Columns, ArrowRight, ArrowLeft, CheckSquare} from 'lucide-react';
import { Card, CardContent } from './ui/Card.js';
import { Button } from './ui/Button.js';
import { Badge } from './ui/Badge.js';
import { Checkbox } from './ui/Checkbox.js';

const DataAnalysis = ({ fileData, onProceed, selectedFields, onSelectedFieldsChange, onGoBack }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'text': return 'bg-orange-100 text-orange-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'date': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFieldToggle = (fieldName) => {
    const newFields = selectedFields.includes(fieldName)
      ? selectedFields.filter(f => f !== fieldName)
      : [...selectedFields, fieldName];
    onSelectedFieldsChange(newFields);
  };
  
  return (
    <>
    <div className="flex justify-between mb-8">
          <Button onClick={onGoBack} variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Back to File Upload
          </Button>
          <Button onClick={onProceed} className="text-white bg-orange-600 hover:bg-orange-700">
            Proceed to Field Selection
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
        <Card className="mb-8">
      <CardContent>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Table className="inline-block mr-2 text-orange-600" size={20} />
          File Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-orange-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-md font-medium text-gray-900">{fileData.fileName}</p>
                <p className="text-sm text-gray-500">File Type</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Table className="text-orange-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-md font-medium text-gray-900">{fileData.totalRows.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Rows</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Columns className="text-orange-600 text-xl mr-3" size={24} />
              <div>
                <p className="text-md font-medium text-gray-900">{fileData.totalColumns}</p>
                <p className="text-sm text-gray-500">Columns</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Detected Columns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fileData.columns.map((column, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                  <span className="text-md font-medium text-gray-900">{column.name}</span>
                </div>
                <Badge className={getTypeColor(column.type)}>
                  {column.type}
                </Badge>
              </div>
            ))}
          </div>
        </div> */}

        
      </CardContent>
    </Card>

    <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="inline-block mr-2 text-orange-600" size={20} />
            Select Output Fields
          </h2>
          
          <div className="space-y-3">
            {fileData.columns.map((column) => (
              <div key={column.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedFields.includes(column.name)}
                    onCheckedChange={() => handleFieldToggle(column.name)}
                    className="mr-3 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <span className="text-md font-medium text-gray-900">{column.name}</span>
                </div>
                <Badge className={getTypeColor(column.type)}>
                  {column.type}
                </Badge>
              </div>
            ))}
          </div>
          
        </CardContent>
      </Card>
      
      </>
  );
};

export default DataAnalysis;